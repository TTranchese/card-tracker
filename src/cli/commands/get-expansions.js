const { Command } = require("commander");
const SelectiveProcessor = require("../../services/selectiveProcessor");

const command = new Command("expansions")
  .description("Get specific expansions by ID")
  .argument("<ids...>", "Expansion IDs (space-separated)")
  .option("-p, --process", "Process and store the expansion data")
  .action(async (ids, options) => {
    try {
      const expansionIds = ids.map(id => parseInt(id));
      console.log(`📦 Getting expansions with IDs: ${expansionIds.join(", ")}`);
      
      const processor = new SelectiveProcessor();
      
      // Get all expansions and filter by IDs
      const expansions = await processor.fetchExpansions();
      const games = await processor.fetchGames();
      
      const matchingExpansions = expansions.filter(e => expansionIds.includes(e.id));
      
      if (matchingExpansions.length === 0) {
        console.log("❌ No expansions found with the provided IDs");
        return;
      }
      
      console.log(`✅ Found ${matchingExpansions.length} expansion(s):`);
      matchingExpansions.forEach(expansion => {
        const game = games.find(g => g.id === expansion.game_id);
        const gameName = game?.display_name || "Unknown";
        console.log(`  - ${expansion.name} (Expansion ID: ${expansion.id}, Game: ${gameName})`);
      });
      
      if (options.process) {
        console.log(`\n🚀 Processing ${matchingExpansions.length} expansion(s)...`);
        await processor.processExpansions(matchingExpansions);
      }
      
    } catch (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  });

module.exports = command; 