const { Command } = require("commander");
const fs = require("fs");
const path = require("path");

const command = new Command("clear")
  .description("Clear all database data")
  .option("-y, --yes", "Skip confirmation prompt")
  .option("--expansions-only", "Clear only expansions database")
  .option("--blueprints-only", "Clear only blueprints database")
  .action(async (options) => {
    try {
      const dbFolder = path.join(__dirname, "..", "..", "..", ".db");
      const expansionsDbPath = path.join(dbFolder, "expansions.db");
      const blueprintsDbPath = path.join(dbFolder, "blueprints.db");
      
      const expansionsExists = fs.existsSync(expansionsDbPath);
      const blueprintsExists = fs.existsSync(blueprintsDbPath);
      
      if (!expansionsExists && !blueprintsExists) {
        console.log("✅ Database is already empty");
        return;
      }
      
      let filesToDelete = [];
      let operation = "all database files";
      
      if (options.expansionsOnly) {
        if (expansionsExists) filesToDelete.push(expansionsDbPath);
        operation = "expansions database";
      } else if (options.blueprintsOnly) {
        if (blueprintsExists) filesToDelete.push(blueprintsDbPath);
        operation = "blueprints database";
      } else {
        if (expansionsExists) filesToDelete.push(expansionsDbPath);
        if (blueprintsExists) filesToDelete.push(blueprintsDbPath);
      }
      
      if (filesToDelete.length === 0) {
        console.log("✅ No files to delete");
        return;
      }
      
      console.log(`🗑️  About to delete ${operation}:`);
      filesToDelete.forEach(file => {
        const stats = fs.statSync(file);
        console.log(`  - ${path.basename(file)} (${formatBytes(stats.size)})`);
      });
      
      if (!options.yes) {
        console.log("\n⚠️  This action cannot be undone. Are you sure? (y/N)");
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
      
      // Delete files
      filesToDelete.forEach(file => {
        try {
          fs.unlinkSync(file);
          console.log(`✅ Deleted: ${path.basename(file)}`);
        } catch (error) {
          console.log(`❌ Failed to delete: ${path.basename(file)} (${error.message})`);
        }
      });
      
      console.log("\n✅ Database cleared successfully!");
      
    } catch (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  });

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

module.exports = command; 