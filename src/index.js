const BatchProcessor = require("./services/batchProcessor");
const SelectiveProcessor = require("./services/selectiveProcessor");

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log("🎯 Card Trader Data Processor");
  console.log("=============================\n");

  try {
    switch (command) {
    case "batch": {
      console.log("🚀 Starting batch processing (all expansions)...");
      const batchProcessor = new BatchProcessor();
      await batchProcessor.processAll();
      break;
    }

    case "game": {
      const gameName = args[1];
      if (!gameName) {
        console.log("❌ Please specify a game name: node src/index.js game <game_name>");
        console.log("💡 Example: node src/index.js game 'Magic: The Gathering'");
        return;
      }
      console.log(`🎮 Processing game: ${gameName}`);
      const selectiveProcessor = new SelectiveProcessor();
      await selectiveProcessor.processByGame(gameName);
      break;
    }

    case "expansions": {
      const expansionIds = args.slice(1).map(id => parseInt(id));
      if (expansionIds.length === 0) {
        console.log("❌ Please specify expansion IDs: node src/index.js expansions <id1> <id2> ...");
        console.log("💡 Example: node src/index.js expansions 1 3 5");
        return;
      }
      console.log(`📦 Processing specific expansions: ${expansionIds.join(", ")}`);
      const selectiveProcessor2 = new SelectiveProcessor();
      await selectiveProcessor2.processByExpansionIds(expansionIds);
      break;
    }

    case "list-games": {
      console.log("🎮 Listing available games...");
      const selectiveProcessor3 = new SelectiveProcessor();
      await selectiveProcessor3.listGames();
      break;
    }

    case "list-expansions": {
      const gameFilter = args[1];
      console.log(gameFilter ? `📦 Listing expansions for: ${gameFilter}` : "📦 Listing all expansions...");
      const selectiveProcessor4 = new SelectiveProcessor();
      await selectiveProcessor4.listExpansions(gameFilter);
      break;
    }

    default: {
      console.log("📖 Usage:");
      console.log("  node src/index.js batch                    # Process all expansions");
      console.log("  node src/index.js game <game_name>        # Process specific game");
      console.log("  node src/index.js expansions <id1> <id2>  # Process specific expansions");
      console.log("  node src/index.js list-games              # List available games");
      console.log("  node src/index.js list-expansions [game]  # List expansions");
      console.log("");
      console.log("💡 Examples:");
      console.log("  node src/index.js game 'Magic: The Gathering'");
      console.log("  node src/index.js expansions 1 3 5");
      console.log("  node src/index.js list-expansions 'Pokemon'");
      break;
    }
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main(); 