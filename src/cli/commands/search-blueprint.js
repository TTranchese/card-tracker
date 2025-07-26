const { Command } = require("commander");
const { fetchBlueprintById, searchBlueprints } = require("../../services/apiService");
const { findBlueprintById, searchBlueprints: searchBlueprintsDb } = require("../../services/storageService");

const command = new Command("blueprint")
  .description("Search for blueprints by ID or string")
  .argument("<query>", "Blueprint ID or search string")
  .option("-d, --database", "Search in local database only")
  .option("-a, --api", "Search in API only")
  .option("-l, --limit <number>", "Limit the number of results", "10")
  .option("-v, --verbose", "Show detailed blueprint information")
  .action(async (query, options) => {
    try {
      const limit = parseInt(options.limit);
      const isId = !isNaN(query) && query.trim() !== "";
      
      console.log(`🔍 Searching for blueprint: "${query}"`);
      
      if (options.database) {
        // Search in local database only
        console.log("📁 Searching in local database...");
        
        if (isId) {
          const blueprint = await findBlueprintById(query);
          if (blueprint) {
            console.log("✅ Found blueprint in database:");
            console.log(`  ID: ${blueprint.blueprint_id || blueprint.id}`);
            console.log(`  Name: ${blueprint.name || blueprint.display_name}`);
            if (options.verbose) {
              console.log(`  Expansion ID: ${blueprint.expansion_id}`);
              console.log(`  Game ID: ${blueprint.game_id}`);
              console.log(`  Text: ${blueprint.text || "N/A"}`);
            }
          } else {
            console.log("❌ Blueprint not found in database");
          }
        } else {
          const blueprints = await searchBlueprintsDb(query);
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
        }
      } else if (options.api) {
        // Search in API only
        console.log("🌐 Searching in API...");
        
        if (isId) {
          const blueprint = await fetchBlueprintById(query);
          console.log("✅ Found blueprint in API:");
          console.log(`  ID: ${blueprint.id}`);
          console.log(`  Name: ${blueprint.name || blueprint.display_name}`);
          if (options.verbose) {
            console.log(`  Expansion ID: ${blueprint.expansion_id}`);
            console.log(`  Game ID: ${blueprint.game_id}`);
            console.log(`  Text: ${blueprint.text || "N/A"}`);
          }
        } else {
          const blueprints = await searchBlueprints(query);
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
        }
      } else {
        // Search in both database and API
        console.log("🔍 Searching in database and API...");
        
        if (isId) {
          // Try database first
          let blueprint = await findBlueprintById(query);
          if (blueprint) {
            console.log("✅ Found blueprint in database:");
            console.log(`  ID: ${blueprint.blueprint_id || blueprint.id}`);
            console.log(`  Name: ${blueprint.name || blueprint.display_name}`);
            if (options.verbose) {
              console.log(`  Expansion ID: ${blueprint.expansion_id}`);
              console.log(`  Game ID: ${blueprint.game_id}`);
            }
          } else {
            // Try API
            try {
              blueprint = await fetchBlueprintById(query);
              console.log("✅ Found blueprint in API:");
              console.log(`  ID: ${blueprint.id}`);
              console.log(`  Name: ${blueprint.name || blueprint.display_name}`);
              if (options.verbose) {
                console.log(`  Expansion ID: ${blueprint.expansion_id}`);
                console.log(`  Game ID: ${blueprint.game_id}`);
              }
            } catch (error) {
              console.log("❌ Blueprint not found in database or API");
            }
          }
        } else {
          // Search by string in both
          const [dbResults, apiResults] = await Promise.all([
            searchBlueprintsDb(query).catch(() => []),
            searchBlueprints(query).catch(() => [])
          ]);
          
          const limitedDbResults = dbResults.slice(0, limit);
          const limitedApiResults = apiResults.slice(0, limit);
          
          if (dbResults.length > 0) {
            console.log(`📁 Found ${dbResults.length} blueprint(s) in database:`);
            limitedDbResults.forEach((bp, index) => {
              console.log(`  ${index + 1}. ${bp.name || bp.display_name} (ID: ${bp.blueprint_id || bp.id})`);
              if (options.verbose) {
                console.log(`     Expansion: ${bp.expansion_id}, Game: ${bp.game_id}`);
              }
            });
            
            if (dbResults.length > limit) {
              console.log(`  ... and ${dbResults.length - limit} more`);
            }
          }
          
          if (apiResults.length > 0) {
            console.log(`🌐 Found ${apiResults.length} blueprint(s) in API:`);
            limitedApiResults.forEach((bp, index) => {
              console.log(`  ${index + 1}. ${bp.name || bp.display_name} (ID: ${bp.id})`);
              if (options.verbose) {
                console.log(`     Expansion: ${bp.expansion_id}, Game: ${bp.game_id}`);
              }
            });
            
            if (apiResults.length > limit) {
              console.log(`  ... and ${apiResults.length - limit} more`);
            }
          }
          
          if (dbResults.length === 0 && apiResults.length === 0) {
            console.log("❌ No blueprints found matching your search");
          }
        }
      }
    } catch (error) {
      console.error("❌ Error searching blueprints:", error.message);
      process.exit(1);
    }
  });

module.exports = command; 