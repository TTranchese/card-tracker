const { Command } = require("commander");
const SelectiveProcessor = require("../../services/selectiveProcessor");

const command = new Command("game")
  .description("Get all expansions for a specific game")
  .argument("<game_name>", "Game name (e.g., Magic: The Gathering, Pokémon)")
  .option("-p, --process", "Process and store the game expansions")
  .option("-l, --limit <number>", "Limit the number of expansions to show", parseInt)
  .action(async (gameName, options) => {
    try {
      console.log(`🎮 Getting expansions for game: "${gameName}"`);
      
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
      
      // Display expansions
      const limit = options.limit || 20;
      const displayExpansions = gameExpansions.slice(0, limit);
      
      displayExpansions.forEach((expansion, index) => {
        console.log(`  ${(index + 1).toString().padStart(3)}. ${expansion.name} (Expansion ID: ${expansion.id})`);
      });
      
      if (gameExpansions.length > limit) {
        console.log(`  ... and ${gameExpansions.length - limit} more`);
      }
      
      if (options.process) {
        console.log(`\n🚀 Processing ${gameExpansions.length} expansions for ${targetGame.display_name}...`);
        await processor.processExpansions(gameExpansions);
      }
      
    } catch (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  });

module.exports = command; 