const { Command } = require("commander");
const SelectiveProcessor = require("../../services/selectiveProcessor");

const command = new Command("expansions")
  .description("List expansions (all or by game)")
  .argument("[game]", "Game name to filter by (optional)")
  .option("-l, --limit <number>", "Limit the number of expansions to show", parseInt)
  .option("-v, --verbose", "Show additional expansion information")
  .action(async (game, options) => {
    try {
      const processor = new SelectiveProcessor();
      
      if (game) {
        console.log(`📦 Listing expansions for: ${game}`);
      } else {
        console.log("📦 Listing all expansions...");
      }
      
      const expansions = await processor.fetchExpansions();
      const games = await processor.fetchGames();
      
      let filteredExpansions = expansions;
      
      if (game) {
        const targetGame = games.find(g => 
          g.name.toLowerCase().includes(game.toLowerCase()) ||
          g.display_name.toLowerCase().includes(game.toLowerCase())
        );
        
        if (!targetGame) {
          console.log(`❌ Game "${game}" not found. Available games:`);
          games.forEach(g => console.log(`  - ${g.display_name} (${g.name})`));
          return;
        }
        
        filteredExpansions = expansions.filter(e => e.game_id === targetGame.id);
        console.log(`📊 Found ${filteredExpansions.length} expansions for ${targetGame.display_name}`);
      } else {
        console.log(`📊 Found ${filteredExpansions.length} total expansions`);
      }
      
      // Apply limit if specified
      const limit = options.limit || 50;
      const displayExpansions = filteredExpansions.slice(0, limit);
      
      console.log("\n📋 Expansions:");
      displayExpansions.forEach((expansion, index) => {
        const game = games.find(g => g.id === expansion.game_id);
        const gameName = game?.display_name || "Unknown";
        
        if (options.verbose) {
          console.log(`  ${(index + 1).toString().padStart(4)}. ${expansion.name}`);
          console.log(`      ID: ${expansion.id}`);
          console.log(`      Game: ${gameName}`);
          console.log("");
        } else {
          console.log(`  ${(index + 1).toString().padStart(4)}. ${expansion.name} (Expansion ID: ${expansion.id}, Game: ${gameName})`);
        }
      });
      
      if (filteredExpansions.length > limit) {
        console.log(`\n  ... and ${filteredExpansions.length - limit} more`);
      }
      
    } catch (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  });

module.exports = command; 