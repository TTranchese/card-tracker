const { Command } = require("commander");
const { loadExpansions, loadBlueprints } = require("../../services/storageService");
const fs = require("fs");
const path = require("path");

const command = new Command("export")
  .description("Export database to JSON file")
  .argument("<filename>", "Output filename (without extension)")
  .option("--expansions-only", "Export only expansions data")
  .option("--blueprints-only", "Export only blueprints data")
  .option("--format <format>", "Output format (json, csv)", "json")
  .action(async (filename, options) => {
    try {
      console.log(`📤 Exporting database to: ${filename}.${options.format}`);
      
      let data = {};
      let exportType = "all data";
      
      if (options.expansionsOnly) {
        try {
          data.expansions = await loadExpansions();
          exportType = "expansions only";
        } catch (error) {
          console.log("❌ No expansions data found");
          return;
        }
      } else if (options.blueprintsOnly) {
        try {
          data.blueprints = await loadBlueprints();
          exportType = "blueprints only";
        } catch (error) {
          console.log("❌ No blueprints data found");
          return;
        }
      } else {
        try {
          data.expansions = await loadExpansions();
          data.blueprints = await loadBlueprints();
        } catch (error) {
          console.log("❌ No database data found");
          return;
        }
      }
      
      console.log(`📊 Exporting ${exportType}:`);
      if (data.expansions) console.log(`  - Expansions: ${data.expansions.length}`);
      if (data.blueprints) console.log(`  - Blueprints: ${data.blueprints.length}`);
      
      // Create output file
      const outputPath = path.resolve(filename + "." + options.format);
      
      if (options.format === "json") {
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(outputPath, jsonData);
      } else if (options.format === "csv") {
        // Simple CSV export for expansions
        if (data.expansions && data.expansions.length > 0) {
          const csvHeader = "id,name,game_id,code,release_date\n";
          const csvData = data.expansions.map(exp => 
            `${exp.id},"${exp.name}",${exp.game_id},"${exp.code || ""}","${exp.release_date || ""}"`
          ).join("\n");
          fs.writeFileSync(outputPath, csvHeader + csvData);
        }
      }
      
      const stats = fs.statSync(outputPath);
      console.log(`✅ Exported to: ${outputPath} (${formatBytes(stats.size)})`);
      
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