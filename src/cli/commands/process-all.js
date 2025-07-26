const { Command } = require("commander");
const BatchProcessor = require("../../services/batchProcessor");

const command = new Command("all")
  .description("Process all expansions (1-2 hours)")
  .option("-y, --yes", "Skip confirmation prompt")
  .action(async (options) => {
    try {
      console.log("🚀 Starting batch processing of all expansions...");
      console.log("📊 This will process all 3,340+ expansions with rate limiting");
      console.log("⏱️  Estimated time: 1-2 hours\n");
      
      if (!options.yes) {
        console.log("⚠️  This is a long-running operation. Are you sure? (y/N)");
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
      
      console.log("🎯 Starting batch processing...\n");
      
      const batchProcessor = new BatchProcessor();
      await batchProcessor.processAll();
      
      console.log("\n✅ Batch processing completed successfully!");
      
    } catch (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  });

module.exports = command; 