const { Command } = require("commander");
const SelectiveProcessor = require("../../services/selectiveProcessor");

const command = new Command("expansions")
  .description("Process specific expansions by ID")
  .argument("<ids...>", "Expansion IDs (space-separated)")
  .option("-y, --yes", "Skip confirmation prompt")
  .action(async (ids, options) => {
    try {
      const expansionIds = ids.map(id => parseInt(id));
      console.log(`📦 Processing expansions with IDs: ${expansionIds.join(", ")}`);
      
      const processor = new SelectiveProcessor();
      
      // Get all expansions and filter by IDs
      const expansions = await processor.fetchExpansions();
      const games = await processor.fetchGames();
      
      const matchingExpansions = expansions.filter(e => expansionIds.includes(e.id));
      
      if (matchingExpansions.length === 0) {
        console.log("❌ No expansions found with the provided IDs");
        return;
      }
      
      console.log(`✅ Found ${matchingExpansions.length} expansion(s) to process:`);
      matchingExpansions.forEach(expansion => {
        const game = games.find(g => g.id === expansion.game_id);
        const gameName = game?.display_name || "Unknown";
        console.log(`  - ${expansion.name} (ID: ${expansion.id}, Game: ${gameName})`);
      });
      
      console.log("⏱️  Estimated time: 1-2 minutes\n");
      
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
      await processor.processExpansions(matchingExpansions);
      
      console.log("\n✅ Expansion processing completed successfully!");
      
    } catch (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  });

module.exports = command; 