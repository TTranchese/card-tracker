#!/usr/bin/env node

const SelectiveProcessor = require("../services/selectiveProcessor");

async function main() {
  console.log("🎮 Processing Pokémon cards...");
  console.log("📊 This will process ~776 Pokémon expansions");
  console.log("⏱️  Estimated time: 10-15 minutes\n");
  
  try {
    const selectiveProcessor = new SelectiveProcessor();
    await selectiveProcessor.processByGame("Pokémon");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

main(); 