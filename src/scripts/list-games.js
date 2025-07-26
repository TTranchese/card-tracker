#!/usr/bin/env node

const SelectiveProcessor = require("../services/selectiveProcessor");

async function main() {
  console.log("🎮 Listing available games...\n");
  
  try {
    const selectiveProcessor = new SelectiveProcessor();
    await selectiveProcessor.listGames();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

main(); 