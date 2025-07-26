#!/usr/bin/env node

const SelectiveProcessor = require("../services/selectiveProcessor");

async function main() {
  console.log("📦 Listing ALL Magic: The Gathering expansions...");
  console.log("⏱️  This may take a moment to fetch all expansions...\n");
  
  try {
    const selectiveProcessor = new SelectiveProcessor();
    await selectiveProcessor.listExpansions("Magic");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

main(); 