const { Command } = require("commander");
const SelectiveProcessor = require("../../services/selectiveProcessor");

const command = new Command("expansion")
  .description("Get specific expansion data")
  .argument("<game>", "Game name (e.g., magic, pokemon)")
  .argument("<expansion_name>", "Expansion name to search for")
  .option("-p, --process", "Process and store the expansion data")
  .action(async (game, expansionName, options) => {
    try {
      console.log(`🔍 Searching for expansion: "${expansionName}" in game: "${game}"`);
      
      const processor = new SelectiveProcessor();
      
      // First, get all expansions for the game
      const games = await processor.fetchGames();
      const targetGame = games.find(g => 
        g.name.toLowerCase().includes(game.toLowerCase()) ||
        g.display_name.toLowerCase().includes(game.toLowerCase())
      );
      
      if (!targetGame) {
        console.log(`❌ Game "${game}" not found. Available games:`);
        games.forEach(g => console.log(`  - ${g.display_name} (${g.name})`));
        return;
      }
      
      console.log(`🎮 Found game: ${targetGame.display_name}`);
      
      // Get expansions for this game
      const expansions = await processor.fetchExpansions();
      const gameExpansions = expansions.filter(e => e.game_id === targetGame.id);
      
      // Search for the specific expansion
      const matchingExpansions = gameExpansions.filter(expansion =>
        expansion.name.toLowerCase().includes(expansionName.toLowerCase())
      );
      
      if (matchingExpansions.length === 0) {
        console.log(`❌ No expansions found matching "${expansionName}" in ${targetGame.display_name}`);
        console.log(`💡 Available expansions in ${targetGame.display_name}:`);
        gameExpansions.slice(0, 10).forEach(exp => console.log(`  - ${exp.name} (Expansion ID: ${exp.id})`));
        if (gameExpansions.length > 10) {
          console.log(`  ... and ${gameExpansions.length - 10} more`);
        }
        return;
      }
      
      console.log(`📦 Found ${matchingExpansions.length} matching expansion(s):`);
      matchingExpansions.forEach(exp => {
        console.log(`  - ${exp.name} (Expansion ID: ${exp.id})`);
      });
      
      if (options.process && matchingExpansions.length > 0) {
        console.log(`\n🚀 Processing ${matchingExpansions.length} expansion(s)...`);
        await processor.processExpansions(matchingExpansions);
      }
      
    } catch (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  });

module.exports = command; 