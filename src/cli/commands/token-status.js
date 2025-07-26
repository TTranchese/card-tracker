const { Command } = require("commander");
const { getTokenInfo, clearToken } = require("../../services/tokenService");

const command = new Command("token-status")
  .description("Show current token status and manage token")
  .option("-c, --clear", "Clear the current token")
  .option("-t, --test", "Test the current token with API")
  .action(async (options) => {
    try {
      const tokenInfo = getTokenInfo();

      console.log("🔐 CardTrader API Token Status");
      console.log("=" .repeat(40));

      if (tokenInfo.hasToken) {
        console.log("✅ Status: Token configured");
        console.log(`📁 Source: ${tokenInfo.source}`);
        console.log(`📅 Set at: ${tokenInfo.setAt || "Unknown"}`);
      } else {
        console.log("❌ Status: No token configured");
        console.log("💡 Use 'card-tracker set-token <token>' to configure your token");
      }

      // Test token if requested
      if (options.test && tokenInfo.hasToken) {
        console.log("\n🧪 Testing token with API...");
        try {
          const { testApiConnection } = require("../../services/apiService");
          await testApiConnection();
          console.log("✅ Token is valid and working!");
        } catch (error) {
          console.error("❌ Token test failed:", error.message);
          console.log("💡 Your token may be expired or invalid. Try setting a new one.");
        }
      } else if (options.test && !tokenInfo.hasToken) {
        console.log("\n❌ Cannot test token: No token configured");
      }

      // Clear token if requested
      if (options.clear) {
        if (tokenInfo.hasToken) {
          console.log("\n🗑️  Clearing token...");
          await clearToken();
          console.log("✅ Token cleared successfully");
        } else {
          console.log("\nℹ️  No token to clear");
        }
      }

      console.log("\n📋 Available commands:");
      console.log("  card-tracker set-token <token>     - Set your API token");
      console.log("  card-tracker set-token <token> -t  - Set and test token");
      console.log("  card-tracker token-status          - Show current status");
      console.log("  card-tracker token-status -c       - Clear current token");
      console.log("  card-tracker token-status -t       - Test current token");

    } catch (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  });

module.exports = command; 