#!/usr/bin/env node

const SelectiveProcessor = require("../services/selectiveProcessor");

async function main() {
  console.log("🧪 Testing with specific expansions...");
  console.log("📊 This will process expansions 1468, 1469, 1470");
  console.log("⏱️  Estimated time: 1-2 minutes\n");
  
  try {
    const selectiveProcessor = new SelectiveProcessor();
    await selectiveProcessor.processByExpansionIds([1468, 1469, 1470]);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

main(); 