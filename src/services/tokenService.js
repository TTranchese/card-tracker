const fs = require("fs");
const path = require("path");

// Token file path
const TOKEN_FILE = path.join(__dirname, "..", "..", ".db", "token.json");

// Ensure .db directory exists
const ensureDbDir = () => {
  const dbDir = path.dirname(TOKEN_FILE);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
};

// Get token from file or config
const getToken = () => {
  try {
    // First try to get from runtime storage
    if (fs.existsSync(TOKEN_FILE)) {
      const tokenData = JSON.parse(fs.readFileSync(TOKEN_FILE, "utf8"));
      if (tokenData.token && tokenData.token.trim() !== "") {
        return tokenData.token;
      }
    }
  } catch (error) {
    console.warn("Warning: Could not read token from file:", error.message);
  }

  // Fallback to config file
  try {
    const { JWT_SECRET } = require("../config");
    if (JWT_SECRET && JWT_SECRET !== "your_jwt_secret_here") {
      return JWT_SECRET;
    }
  } catch (error) {
    console.warn("Warning: Could not read token from config:", error.message);
  }

  return null;
};

// Set token and save to file
const setToken = (token) => {
  if (!token || typeof token !== "string" || token.trim() === "") {
    throw new Error("Token must be a non-empty string");
  }

  // Basic validation - JWT tokens are typically 3 parts separated by dots
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token format. Expected JWT format (3 parts separated by dots)");
  }

  try {
    ensureDbDir();
    const tokenData = {
      token: token.trim(),
      setAt: new Date().toISOString(),
      version: "1.0"
    };
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenData, null, 2));
    console.log("✅ Token saved successfully");
    return true;
  } catch (error) {
    throw new Error(`Failed to save token: ${error.message}`);
  }
};

// Validate token format
const validateToken = (token) => {
  if (!token || typeof token !== "string") {
    return { valid: false, error: "Token must be a string" };
  }

  if (token.trim() === "") {
    return { valid: false, error: "Token cannot be empty" };
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return { valid: false, error: "Invalid JWT format. Expected 3 parts separated by dots" };
  }

  // Check if each part is base64-like (basic validation)
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].trim() === "") {
      return { valid: false, error: "Invalid JWT format. Parts cannot be empty" };
    }
  }

  return { valid: true };
};

// Check if token is set
const hasToken = () => {
  const token = getToken();
  return token !== null && token.trim() !== "";
};

// Clear token
const clearToken = () => {
  try {
    if (fs.existsSync(TOKEN_FILE)) {
      fs.unlinkSync(TOKEN_FILE);
      console.log("✅ Token cleared successfully");
      return true;
    } else {
      console.log("ℹ️  No token file found to clear");
      return true;
    }
  } catch (error) {
    throw new Error(`Failed to clear token: ${error.message}`);
  }
};

// Get token info
const getTokenInfo = () => {
  try {
    if (fs.existsSync(TOKEN_FILE)) {
      const tokenData = JSON.parse(fs.readFileSync(TOKEN_FILE, "utf8"));
      return {
        source: "runtime",
        setAt: tokenData.setAt,
        hasToken: tokenData.token && tokenData.token.trim() !== ""
      };
    }
  } catch (error) {
    console.warn("Warning: Could not read token info:", error.message);
  }

  // Check config file
  try {
    const { JWT_SECRET } = require("../config");
    if (JWT_SECRET && JWT_SECRET !== "your_jwt_secret_here") {
      return {
        source: "config",
        setAt: "unknown",
        hasToken: true
      };
    }
  } catch (error) {
    console.warn("Warning: Could not read config:", error.message);
  }

  return {
    source: "none",
    setAt: null,
    hasToken: false
  };
};

module.exports = {
  getToken,
  setToken,
  validateToken,
  hasToken,
  clearToken,
  getTokenInfo
}; 