#!/usr/bin/env node

const SelectiveProcessor = require("../services/selectiveProcessor");

async function main() {
  console.log("🎮 Processing Magic: The Gathering cards...");
  console.log("📊 This will process Magic expansions");
  console.log("⏱️  Estimated time: 15-20 minutes\n");
  
  try {
    const selectiveProcessor = new SelectiveProcessor();
    await selectiveProcessor.processByGame("Magic");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

main(); 