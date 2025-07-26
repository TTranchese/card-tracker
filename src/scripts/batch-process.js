#!/usr/bin/env node

const BatchProcessor = require("../services/batchProcessor");

async function main() {
  console.log("🚀 Starting batch processing (all expansions)...");
  console.log("📊 This will process all 3,340+ expansions with rate limiting");
  console.log("⏱️  Estimated time: 1-2 hours\n");
  
  try {
    const batchProcessor = new BatchProcessor();
    await batchProcessor.processAll();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

main(); 