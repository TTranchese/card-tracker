const { Command } = require("commander");
const { setToken, validateToken, getTokenInfo } = require("../../services/tokenService");

const command = new Command("set-token")
  .description("Set the CardTrader API bearer token")
  .argument("<token>", "Your CardTrader API bearer token")
  .option("-t, --test", "Test the token after setting it")
  .action(async (token, options) => {
    try {
      console.log("🔐 Setting CardTrader API token...");

      // Validate token format
      const validation = validateToken(token);
      if (!validation.valid) {
        console.error(`❌ Invalid token: ${validation.error}`);
        process.exit(1);
      }

      // Set the token
      await setToken(token);

      // Show token info
      const tokenInfo = getTokenInfo();
      console.log(`📅 Token set at: ${tokenInfo.setAt}`);
      console.log(`📁 Source: ${tokenInfo.source}`);

      // Test the token if requested
      if (options.test) {
        console.log("\n🧪 Testing token with API...");
        try {
          const { testApiConnection } = require("../../services/apiService");
          await testApiConnection();
          console.log("✅ Token is valid and working!");
        } catch (error) {
          console.error("❌ Token test failed:", error.message);
          console.log("💡 The token format is correct, but it may be expired or invalid.");
          process.exit(1);
        }
      } else {
        console.log("\n💡 Tip: Use 'card-tracker set-token <token> --test' to validate your token");
      }

      console.log("\n🎉 Token configured successfully!");
      console.log("You can now use all card-tracker commands that require API access.");

    } catch (error) {
      console.error("❌ Error setting token:", error.message);
      process.exit(1);
    }
  });

module.exports = command; 