const axios = require("axios");
const { HOST } = require("../config");
const { getToken } = require("./tokenService");

// Test function to check API accessibility
const testApiConnection = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No API token configured. Use 'card-tracker set-token <token>' to set your token.");
    }

    console.log("Testing API connection...");
    const response = await axios.get(`https://${HOST}/api/v2/info`, {
      headers: {
        Authorization: `Bearer ${token}`,
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
    const token = getToken();
    if (!token) {
      throw new Error("No API token configured. Use 'card-tracker set-token <token>' to set your token.");
    }

    console.log("Fetching all expansions...");
    const response = await axios.get(`https://${HOST}/api/v2/expansions`, {
      headers: {
        Authorization: `Bearer ${token}`,
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
    const token = getToken();
    if (!token) {
      throw new Error("No API token configured. Use 'card-tracker set-token <token>' to set your token.");
    }

    console.log(`Fetching blueprints for expansion ID: ${expansionId}`);
    const response = await axios.get(
      `https://${HOST}/api/v2/blueprints/export?expansion_id=${expansionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
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

// New function to search for blueprints by ID
const fetchBlueprintById = async (blueprintId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No API token configured. Use 'card-tracker set-token <token>' to set your token.");
    }

    console.log(`Fetching blueprint by ID: ${blueprintId}`);
    const response = await axios.get(
      `https://${HOST}/api/v2/blueprints/${blueprintId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const blueprint = response.data;
    console.log(`Fetched blueprint: ${blueprint.name || blueprintId}`);
    return blueprint;
  } catch (error) {
    console.error(`Error fetching blueprint ID: ${blueprintId}`, error);
    throw error;
  }
};

// New function to search for blueprints by string
const searchBlueprints = async (searchTerm) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No API token configured. Use 'card-tracker set-token <token>' to set your token.");
    }

    console.log(`Searching blueprints for: "${searchTerm}"`);
    const response = await axios.get(
      `https://${HOST}/api/v2/blueprints/search?q=${encodeURIComponent(searchTerm)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const blueprints = response.data;
    console.log(`Found ${blueprints.length} blueprints matching "${searchTerm}"`);
    return blueprints;
  } catch (error) {
    console.error(`Error searching blueprints for: "${searchTerm}"`, error);
    throw error;
  }
};

// New function to fetch all blueprints (if available)
const fetchAllBlueprints = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No API token configured. Use 'card-tracker set-token <token>' to set your token.");
    }

    console.log("Fetching all blueprints...");
    const response = await axios.get(`https://${HOST}/api/v2/blueprints`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const blueprints = response.data;
    console.log(`Fetched ${blueprints.length} blueprints.`);
    return blueprints;
  } catch (error) {
    console.error("Error fetching all blueprints:", error);
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
  fetchBlueprintById,
  searchBlueprints,
  fetchAllBlueprints,
  testApiConnection,
};
