const axios = require("axios");
const { HOST, JWT_SECRET } = require("../config");
const { storeBlueprints } = require("./storageService");

class SelectiveProcessor {
  constructor() {
    this.delayMs = 200; // Slower rate limiting for selective processing
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async fetchExpansions() {
    try {
      console.log("Fetching all expansions...");
      const response = await axios.get(`https://${HOST}/api/v2/expansions`, {
        headers: { Authorization: `Bearer ${JWT_SECRET}` }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching expansions:", error.message);
      throw error;
    }
  }

  async fetchGames() {
    try {
      console.log("Fetching games...");
      const response = await axios.get(`https://${HOST}/api/v2/games`, {
        headers: { Authorization: `Bearer ${JWT_SECRET}` }
      });
      return response.data.array || response.data; // Handle the array wrapper
    } catch (error) {
      console.error("Error fetching games:", error.message);
      throw error;
    }
  }

  async processByGame(gameName) {
    try {
      const games = await this.fetchGames();
      const game = games.find(g => 
        g.name.toLowerCase().includes(gameName.toLowerCase()) ||
        g.display_name.toLowerCase().includes(gameName.toLowerCase())
      );
      
      if (!game) {
        console.log(`❌ Game "${gameName}" not found. Available games:`);
        games.forEach(g => console.log(`  - ${g.display_name} (${g.name})`));
        return;
      }

      console.log(`🎮 Processing game: ${game.display_name}`);
      const expansions = await this.fetchExpansions();
      const gameExpansions = expansions.filter(e => e.game_id === game.id);
      
      console.log(`📦 Found ${gameExpansions.length} expansions for ${game.display_name}`);
      
      await this.processExpansions(gameExpansions);
      
    } catch (error) {
      console.error("Error processing by game:", error);
    }
  }

  async processByExpansionIds(expansionIds) {
    try {
      const expansions = await this.fetchExpansions();
      const selectedExpansions = expansions.filter(e => expansionIds.includes(e.id));
      
      console.log(`📦 Processing ${selectedExpansions.length} selected expansions`);
      
      await this.processExpansions(selectedExpansions);
      
    } catch (error) {
      console.error("Error processing by expansion IDs:", error);
    }
  }

  async processExpansions(expansions) {
    let processed = 0;
    let failed = 0;
    const total = expansions.length;

    console.log(`\n🚀 Starting processing of ${total} expansions\n`);

    for (const expansion of expansions) {
      try {
        console.log(`📦 Processing expansion: ${expansion.name} (ID: ${expansion.id})`);
        
        const blueprints = await this.fetchBlueprintsForExpansion(expansion.id);
        
        if (blueprints.length > 0) {
          await this.storeBlueprintsSafely(blueprints);
          console.log(`✅ Stored ${blueprints.length} blueprints for ${expansion.name}`);
        } else {
          console.log(`⚠️  No blueprints found for ${expansion.name}`);
        }
        
        processed++;
        
        // Rate limiting
        if (processed < total) {
          console.log(`⏳ Waiting ${this.delayMs}ms...`);
          await this.delay(this.delayMs);
        }
        
      } catch (error) {
        failed++;
        console.log(`❌ Failed to process expansion ${expansion.id}: ${error.message}`);
      }
    }

    console.log("\n🎉 Processing complete!");
    console.log(`✅ Successfully processed: ${processed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📊 Success rate: ${((processed / total) * 100).toFixed(1)}%`);
  }

  async fetchBlueprintsForExpansion(expansionId) {
    try {
      const response = await axios.get(
        `https://${HOST}/api/v2/blueprints/export?expansion_id=${expansionId}`,
        { headers: { Authorization: `Bearer ${JWT_SECRET}` } }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching blueprints for expansion ${expansionId}:`, error.message);
      return [];
    }
  }

  async storeBlueprintsSafely(blueprints) {
    return new Promise((resolve) => {
      storeBlueprints(blueprints);
      resolve();
    });
  }

  async listGames() {
    try {
      const games = await this.fetchGames();
      console.log("\n🎮 Available games:");
      games.forEach(game => console.log(`  - ${game.display_name} (ID: ${game.id}, Code: ${game.name})`));
    } catch (error) {
      console.error("Error listing games:", error);
    }
  }

  async listExpansions(gameName = null) {
    try {
      const expansions = await this.fetchExpansions();
      const games = await this.fetchGames();
      
      let filteredExpansions = expansions;
      
      if (gameName) {
        const game = games.find(g => 
          g.name.toLowerCase().includes(gameName.toLowerCase()) ||
          g.display_name.toLowerCase().includes(gameName.toLowerCase())
        );
        if (game) {
          filteredExpansions = expansions.filter(e => e.game_id === game.id);
          console.log(`\n📦 Expansions for ${game.display_name} (${filteredExpansions.length} total):`);
        } else {
          console.log(`❌ Game "${gameName}" not found`);
          return;
        }
      } else {
        console.log(`\n📦 All expansions (${filteredExpansions.length} total):`);
      }
      
      // Show all expansions with better formatting
      filteredExpansions.forEach((expansion, index) => {
        const game = games.find(g => g.id === expansion.game_id);
        const gameName = game?.display_name || "Unknown";
        console.log(`  ${(index + 1).toString().padStart(4)}. ${expansion.name} (ID: ${expansion.id}, Game: ${gameName})`);
      });
      
      console.log(`\n📊 Total: ${filteredExpansions.length} expansions`);
      
    } catch (error) {
      console.error("Error listing expansions:", error);
    }
  }
}

module.exports = SelectiveProcessor; 