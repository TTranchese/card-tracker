const { Command } = require("commander");
const { loadExpansions, loadBlueprints } = require("../../services/storageService");
const fs = require("fs");
const path = require("path");

const command = new Command("info")
  .description("Show database information")
  .option("-v, --verbose", "Show detailed database information")
  .action(async (options) => {
    try {
      console.log("📊 Database Information\n");
      
      const dbFolder = path.join(__dirname, "..", "..", "..", ".db");
      const expansionsDbPath = path.join(dbFolder, "expansions.db");
      const blueprintsDbPath = path.join(dbFolder, "blueprints.db");
      
      // Check if database files exist
      const expansionsExists = fs.existsSync(expansionsDbPath);
      const blueprintsExists = fs.existsSync(blueprintsDbPath);
      
      if (!expansionsExists && !blueprintsExists) {
        console.log("❌ No database files found. Run a processing command first.");
        return;
      }
      
      // Get file sizes
      const getFileSize = (filePath) => {
        if (!fs.existsSync(filePath)) return 0;
        const stats = fs.statSync(filePath);
        return stats.size;
      };
      
      const expansionsSize = getFileSize(expansionsDbPath);
      const blueprintsSize = getFileSize(blueprintsDbPath);
      
      console.log("📁 Database Files:");
      console.log(`  Expansions: ${expansionsExists ? "✅" : "❌"} (${formatBytes(expansionsSize)})`);
      console.log(`  Blueprints: ${blueprintsExists ? "✅" : "❌"} (${formatBytes(blueprintsSize)})`);
      
      if (options.verbose) {
        console.log("\n📋 Database Details:");
        
        if (expansionsExists) {
          try {
            const expansions = await loadExpansions();
            console.log(`  Expansions in DB: ${expansions.length}`);
          } catch (error) {
            console.log(`  Expansions in DB: Error loading (${error.message})`);
          }
        }
        
        if (blueprintsExists) {
          try {
            const blueprints = await loadBlueprints();
            console.log(`  Blueprints in DB: ${blueprints.length}`);
          } catch (error) {
            console.log(`  Blueprints in DB: Error loading (${error.message})`);
          }
        }
      }
      
      console.log("\n💡 Use \"card-tracker db clear\" to reset the database");
      console.log("💡 Use \"card-tracker db export <filename>\" to export data");
      
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