const { Command } = require("commander");
const SelectiveProcessor = require("../../services/selectiveProcessor");
const Datastore = require("nedb");
const path = require("path");
const fs = require("fs");

const command = new Command("game")
  .description("Delete all data for a specific game")
  .argument("<game_name>", "Game name to delete")
  .option("-y, --yes", "Skip confirmation prompt")
  .action(async (gameName, options) => {
    try {
      console.log(`🗑️  Deleting all data for game: "${gameName}"`);
      
      const processor = new SelectiveProcessor();
      
      // Get games and find the target game
      const games = await processor.fetchGames();
      const targetGame = games.find(g => 
        g.name.toLowerCase().includes(gameName.toLowerCase()) ||
        g.display_name.toLowerCase().includes(gameName.toLowerCase())
      );
      
      if (!targetGame) {
        console.log(`❌ Game "${gameName}" not found. Available games:`);
        games.forEach(g => console.log(`  - ${g.display_name} (${g.name})`));
        return;
      }
      
      console.log(`✅ Found game: ${targetGame.display_name}`);
      
      // Get expansions for this game
      const expansions = await processor.fetchExpansions();
      const gameExpansions = expansions.filter(e => e.game_id === targetGame.id);
      
      console.log(`📦 Found ${gameExpansions.length} expansions for ${targetGame.display_name}`);
      
      if (gameExpansions.length === 0) {
        console.log("✅ No expansions to delete");
        return;
      }
      
      const dbFolder = path.join(__dirname, "..", "..", "..", ".db");
      const blueprintsDbPath = path.join(dbFolder, "blueprints.db");
      
      if (!fs.existsSync(blueprintsDbPath)) {
        console.log("❌ No blueprints database found");
        return;
      }
      
      const blueprintsDb = new Datastore({
        filename: blueprintsDbPath,
        autoload: true,
      });
      
      // Count blueprints for all expansions of this game
      const expansionIds = gameExpansions.map(exp => exp.id);
      const count = await new Promise((resolve, reject) => {
        blueprintsDb.count({ expansion_id: { $in: expansionIds } }, (err, count) => {
          if (err) reject(err);
          else resolve(count);
        });
      });
      
      if (count === 0) {
        console.log("✅ No blueprints found for this game");
        return;
      }
      
      console.log(`📊 Found ${count} blueprints for ${gameExpansions.length} expansions`);
      
      if (!options.yes) {
        console.log("⚠️  This will delete all blueprints for this game. Continue? (y/N)");
        const readline = require("readline");
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        const answer = await new Promise(resolve => {
          rl.question("", resolve);
        });
        rl.close();
        
        if (answer.toLowerCase() !== "y" && answer.toLowerCase() !== "yes") {
          console.log("❌ Operation cancelled");
          return;
        }
      }
      
      // Delete blueprints for all expansions of this game
      const deleted = await new Promise((resolve, reject) => {
        blueprintsDb.remove({ expansion_id: { $in: expansionIds } }, { multi: true }, (err, numRemoved) => {
          if (err) reject(err);
          else resolve(numRemoved);
        });
      });
      
      console.log(`✅ Deleted ${deleted} blueprints for ${targetGame.display_name}`);
      
    } catch (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  });

module.exports = command; 