const { Command } = require("commander");
const { fetchAllBlueprints } = require("../../services/apiService");
const { loadBlueprints, findBlueprintsByExpansionId, findBlueprintsByGameId } = require("../../services/storageService");

const command = new Command("blueprints")
  .description("List blueprints by various criteria")
  .option("-e, --expansion <id>", "List blueprints for specific expansion ID")
  .option("-g, --game <id>", "List blueprints for specific game ID")
  .option("-a, --all", "List all blueprints (may be slow)")
  .option("-d, --database", "List from local database only")
  .option("-l, --limit <number>", "Limit the number of results", "20")
  .option("-v, --verbose", "Show detailed blueprint information")
  .action(async (options) => {
    try {
      const limit = parseInt(options.limit);
      
      if (options.expansion) {
        console.log(`📦 Listing blueprints for expansion ID: ${options.expansion}`);
        const blueprints = await findBlueprintsByExpansionId(options.expansion);
        const limitedResults = blueprints.slice(0, limit);
        
        console.log(`📊 Found ${blueprints.length} blueprint(s):`);
        limitedResults.forEach((bp, index) => {
          console.log(`  ${index + 1}. ${bp.name || bp.display_name} (ID: ${bp.blueprint_id || bp.id})`);
          if (options.verbose) {
            console.log(`     Game ID: ${bp.game_id}, Text: ${bp.text || "N/A"}`);
          }
        });
        
        if (blueprints.length > limit) {
          console.log(`  ... and ${blueprints.length - limit} more`);
        }
      } else if (options.game) {
        console.log(`🎮 Listing blueprints for game ID: ${options.game}`);
        const blueprints = await findBlueprintsByGameId(options.game);
        const limitedResults = blueprints.slice(0, limit);
        
        console.log(`📊 Found ${blueprints.length} blueprint(s):`);
        limitedResults.forEach((bp, index) => {
          console.log(`  ${index + 1}. ${bp.name || bp.display_name} (ID: ${bp.blueprint_id || bp.id})`);
          if (options.verbose) {
            console.log(`     Expansion ID: ${bp.expansion_id}, Text: ${bp.text || "N/A"}`);
          }
        });
        
        if (blueprints.length > limit) {
          console.log(`  ... and ${blueprints.length - limit} more`);
        }
      } else if (options.all) {
        if (options.database) {
          console.log("📁 Listing all blueprints from database...");
          const blueprints = await loadBlueprints();
          const limitedResults = blueprints.slice(0, limit);
          
          console.log(`📊 Found ${blueprints.length} blueprint(s) in database:`);
          limitedResults.forEach((bp, index) => {
            console.log(`  ${index + 1}. ${bp.name || bp.display_name} (ID: ${bp.blueprint_id || bp.id})`);
            if (options.verbose) {
              console.log(`     Expansion: ${bp.expansion_id}, Game: ${bp.game_id}`);
            }
          });
          
          if (blueprints.length > limit) {
            console.log(`  ... and ${blueprints.length - limit} more`);
          }
        } else {
          console.log("🌐 Listing all blueprints from API...");
          console.log("⚠️  This may take a while and could be rate-limited");
          
          try {
            const blueprints = await fetchAllBlueprints();
            const limitedResults = blueprints.slice(0, limit);
            
            console.log(`📊 Found ${blueprints.length} blueprint(s) in API:`);
            limitedResults.forEach((bp, index) => {
              console.log(`  ${index + 1}. ${bp.name || bp.display_name} (ID: ${bp.id})`);
              if (options.verbose) {
                console.log(`     Expansion: ${bp.expansion_id}, Game: ${bp.game_id}`);
              }
            });
            
            if (blueprints.length > limit) {
              console.log(`  ... and ${blueprints.length - limit} more`);
            }
          } catch (error) {
            console.log("❌ Error fetching all blueprints from API:", error.message);
            console.log("💡 Try using --database flag to list from local database");
          }
        }
      } else {
        console.log("📋 Blueprint listing options:");
        console.log("  -e, --expansion <id>  List blueprints for specific expansion ID");
        console.log("  -g, --game <id>       List blueprints for specific game ID");
        console.log("  -a, --all             List all blueprints (may be slow)");
        console.log("  -d, --database        List from local database only");
        console.log("  -l, --limit <number>  Limit the number of results (default: 20)");
        console.log("  -v, --verbose         Show detailed blueprint information");
        console.log("");
        console.log("Examples:");
        console.log("  card-tracker list blueprints -e 1468");
        console.log("  card-tracker list blueprints -g 1 -l 10");
        console.log("  card-tracker list blueprints -a -d");
      }
    } catch (error) {
      console.error("❌ Error listing blueprints:", error.message);
      process.exit(1);
    }
  });

module.exports = command; 