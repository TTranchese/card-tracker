const axios = require("axios");
const { HOST, JWT_SECRET } = require("../config");
const { storeExpansions, storeBlueprints } = require("./storageService");

class BatchProcessor {
  constructor() {
    this.delay = 100; // 100ms between requests
    this.batchSize = 5; // Process 5 expansions at a time
    this.processed = 0;
    this.failed = 0;
    this.total = 0;
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
      console.log(`Found ${response.data.length} expansions`);
      return response.data;
    } catch (error) {
      console.error("Error fetching expansions:", error.message);
      throw error;
    }
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
      return []; // Return empty array on error, don't fail the whole process
    }
  }

  async processBatch(expansions, startIndex) {
    const batch = expansions.slice(startIndex, startIndex + this.batchSize);
    const promises = batch.map(async (expansion) => {
      try {
        const blueprints = await this.fetchBlueprintsForExpansion(expansion.id);
        if (blueprints.length > 0) {
          await this.storeBlueprintsSafely(blueprints);
        }
        this.processed++;
        console.log(`✅ Processed ${this.processed}/${this.total}: Expansion ${expansion.id} (${blueprints.length} blueprints)`);
        return { success: true, expansionId: expansion.id, blueprintCount: blueprints.length };
      } catch (error) {
        this.failed++;
        console.log(`❌ Failed expansion ${expansion.id}: ${error.message}`);
        return { success: false, expansionId: expansion.id, error: error.message };
      }
    });

    return Promise.all(promises);
  }

  async storeBlueprintsSafely(blueprints) {
    return new Promise((resolve) => {
      storeBlueprints(blueprints);
      resolve();
    });
  }

  async processAll() {
    try {
      const expansions = await this.fetchExpansions();
      this.total = expansions.length;
      
      console.log(`\n🚀 Starting batch processing of ${this.total} expansions`);
      console.log(`📊 Batch size: ${this.batchSize}, Delay: ${this.delay}ms\n`);

      // Store expansions first
      await this.storeExpansionsSafely(expansions);
      console.log("✅ Expansions stored successfully\n");

      // Process blueprints in batches
      for (let i = 0; i < expansions.length; i += this.batchSize) {
        const results = await this.processBatch(expansions, i);
        
        // Log batch summary
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;
        console.log(`📦 Batch ${Math.floor(i/this.batchSize) + 1}: ${successful} successful, ${failed} failed`);
        
        // Rate limiting delay
        if (i + this.batchSize < expansions.length) {
          console.log(`⏳ Waiting ${this.delay}ms before next batch...`);
          await this.delay(this.delay);
        }
      }

      console.log("\n🎉 Processing complete!");
      console.log(`✅ Successfully processed: ${this.processed}`);
      console.log(`❌ Failed: ${this.failed}`);
      console.log(`📊 Success rate: ${((this.processed / this.total) * 100).toFixed(1)}%`);

    } catch (error) {
      console.error("Fatal error in batch processing:", error);
      throw error;
    }
  }

  async storeExpansionsSafely(expansions) {
    return new Promise((resolve) => {
      storeExpansions(expansions);
      resolve();
    });
  }
}

module.exports = BatchProcessor; 