#!/usr/bin/env node

const SelectiveProcessor = require("../services/selectiveProcessor");

async function main() {
  console.log("📦 Listing Pokémon expansions...\n");
  
  try {
    const selectiveProcessor = new SelectiveProcessor();
    await selectiveProcessor.listExpansions("Pokémon");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

main(); 