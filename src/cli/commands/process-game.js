const { Command } = require("commander");
const SelectiveProcessor = require("../../services/selectiveProcessor");

const command = new Command("game")
  .description("Process all expansions for a specific game")
  .argument("<game_name>", "Game name (e.g., Magic: The Gathering, Pokémon)")
  .option("-y, --yes", "Skip confirmation prompt")
  .action(async (gameName, options) => {
    try {
      console.log(`🎮 Processing game: "${gameName}"`);
      
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
      
      // Get expansions for this game
      const expansions = await processor.fetchExpansions();
      const gameExpansions = expansions.filter(e => e.game_id === targetGame.id);
      
      console.log(`📦 Found ${gameExpansions.length} expansions for ${targetGame.display_name}`);
      console.log(`⏱️  Estimated time: ${Math.ceil(gameExpansions.length / 10)}-${Math.ceil(gameExpansions.length / 5)} minutes\n`);
      
      if (!options.yes) {
        console.log("⚠️  Continue with processing? (y/N)");
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
      
      console.log("🚀 Starting processing...\n");
      await processor.processExpansions(gameExpansions);
      
      console.log("\n✅ Game processing completed successfully!");
      
    } catch (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  });

module.exports = command; 