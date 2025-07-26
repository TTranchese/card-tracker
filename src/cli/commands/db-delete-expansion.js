const { Command } = require("commander");
const Datastore = require("nedb");
const path = require("path");
const fs = require("fs");

const command = new Command("expansion")
  .description("Delete specific expansion from database")
  .argument("<expansion_id>", "Expansion ID to delete")
  .option("-y, --yes", "Skip confirmation prompt")
  .action(async (expansionId, options) => {
    try {
      const expansionIdNum = parseInt(expansionId);
      console.log(`🗑️  Deleting expansion ID: ${expansionIdNum}`);
      
      const dbFolder = path.join(__dirname, "..", "..", "..", ".db");
      const blueprintsDbPath = path.join(dbFolder, "blueprints.db");
      
      if (!fs.existsSync(blueprintsDbPath)) {
        console.log("❌ No blueprints database found");
        return;
      }
      
      const blueprintsDb = new Datastore({
        filename: blueprintsDbPath,
        autoload: true,
      });
      
      // Count blueprints for this expansion
      const count = await new Promise((resolve, reject) => {
        blueprintsDb.count({ expansion_id: expansionIdNum }, (err, count) => {
          if (err) reject(err);
          else resolve(count);
        });
      });
      
      if (count === 0) {
        console.log("✅ No blueprints found for this expansion ID");
        return;
      }
      
      console.log(`📊 Found ${count} blueprints for expansion ID: ${expansionIdNum}`);
      
      if (!options.yes) {
        console.log("⚠️  Continue with deletion? (y/N)");
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
      
      // Delete blueprints for this expansion
      const deleted = await new Promise((resolve, reject) => {
        blueprintsDb.remove({ expansion_id: expansionIdNum }, { multi: true }, (err, numRemoved) => {
          if (err) reject(err);
          else resolve(numRemoved);
        });
      });
      
      console.log(`✅ Deleted ${deleted} blueprints for expansion ID: ${expansionIdNum}`);
      
    } catch (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  });

module.exports = command; 