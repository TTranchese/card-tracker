const axios = require("axios");
const { HOST, JWT_SECRET } = require("../config");

// Test function to check API accessibility
const testApiConnection = async () => {
  try {
    console.log("Testing API connection...");
    const response = await axios.get(`https://${HOST}/api/v2/info`, {
      headers: {
        Authorization: `Bearer ${JWT_SECRET}`,
      },
    });
    console.log("API is accessible:", response.data);
    return response.data;
  } catch (error) {
    console.error("API connection test failed:", error.response?.data || error.message);
    throw error;
  }
};

const fetchExpansions = async () => {
  try {
    console.log("Fetching all expansions...");
    const response = await axios.get(`https://${HOST}/api/v2/expansions`, {
      headers: {
        Authorization: `Bearer ${JWT_SECRET}`,
      },
    });
    const expansions = response.data;
    console.log(`Fetched ${expansions.length} expansions.`);
    return expansions;
  } catch (error) {
    console.error("Error fetching expansions:", error);
    throw error;
  }
};

const fetchBlueprintsForExpansion = async (expansionId) => {
  try {
    console.log(`Fetching blueprints for expansion ID: ${expansionId}`);
    const response = await axios.get(
      `https://${HOST}/api/v2/blueprints/export?expansion_id=${expansionId}`,
      {
        headers: {
          Authorization: `Bearer ${JWT_SECRET}`,
        },
      }
    );
    const blueprints = response.data;
    console.log(
      `Fetched ${blueprints.length} blueprints for expansion ID: ${expansionId}`
    );
    return blueprints;
  } catch (error) {
    console.error(
      `Error fetching blueprints for expansion ID: ${expansionId}`,
      error
    );
    throw error;
  }
};

const startFetchProcessing = async () => {
  try {
    console.log("Starting fetch process...");
    const expansions = await fetchExpansions();
    const blueprints = await Promise.all(
      expansions.map((expansion) => fetchBlueprintsForExpansion(expansion.id))
    );
    console.log("Fetch process completed.");
    return blueprints.flat();
  } catch (error) {
    console.error("Error fetching blueprints:", error);
    throw error;
  }
};

module.exports = {
  startFetchProcessing,
  fetchExpansions,
  fetchBlueprintsForExpansion,
  testApiConnection,
};
