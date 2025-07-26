#!/usr/bin/env node

const SelectiveProcessor = require("../services/selectiveProcessor");

async function main() {
  console.log("📦 Listing ALL expansions across all games...");
  console.log("⏱️  This may take a moment to fetch all 3,340+ expansions...\n");
  
  try {
    const selectiveProcessor = new SelectiveProcessor();
    await selectiveProcessor.listExpansions();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

main(); 