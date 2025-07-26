const { Command } = require("commander");
const SelectiveProcessor = require("../../services/selectiveProcessor");

const command = new Command("games")
  .description("List all available games")
  .option("-v, --verbose", "Show additional game information")
  .action(async (options) => {
    try {
      console.log("🎮 Fetching available games...\n");
      
      const processor = new SelectiveProcessor();
      const games = await processor.fetchGames();
      
      console.log(`📊 Found ${games.length} games:\n`);
      
      games.forEach((game, index) => {
        if (options.verbose) {
          console.log(`${(index + 1).toString().padStart(2)}. ${game.display_name}`);
          console.log(`    Code: ${game.name}`);
          console.log(`    ID: ${game.id}`);
          console.log("");
        } else {
          console.log(`  ${(index + 1).toString().padStart(2)}. ${game.display_name} (${game.name})`);
        }
      });
      
    } catch (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  });

module.exports = command; 