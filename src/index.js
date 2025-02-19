const {
  fetchExpansions,
  fetchBlueprintsForExpansion,
} = require("./services/apiService");
const {
  storeBlueprints,
  storeExpansions,
} = require("./services/storageService");

const main = async () => {
  try {
    const expansions = await fetchExpansions();
    storeExpansions(expansions);
    console.log("Expansions fetched and stored successfully.");

    for (const expansion of expansions) {
      const blueprints = await fetchBlueprintsForExpansion(expansion.id);
      storeBlueprints(blueprints);
      console.log(
        `Blueprints for expansion ID ${expansion.id} fetched and stored successfully.`
      );
    }
  } catch (error) {
    console.error("Failed to fetch and store blueprints or expansions:", error);
  }
};

main();
