const path = require("path");
const util = require("util");
const fs = require("fs");

// Suppress deprecation warnings for util.isArray
const originalEmitWarning = process.emitWarning;
process.emitWarning = function(warning, ...args) {
  if (warning && typeof warning === "string" && warning.includes("util.isArray")) {
    return; // Suppress the warning
  }
  return originalEmitWarning.call(this, warning, ...args);
};

// Fix for NeDB compatibility with newer Node.js versions
if (!util.isDate) {
  util.isDate = function(obj) {
    return Object.prototype.toString.call(obj) === "[object Date]";
  };
}

if (!util.isRegExp) {
  util.isRegExp = function(obj) {
    return Object.prototype.toString.call(obj) === "[object RegExp]";
  };
}

if (!util.isArray) {
  util.isArray = function(obj) {
    return Array.isArray(obj);
  };
}

const Datastore = require("nedb");

// Determine the database folder path
let dbFolder;
const isPkg = typeof process !== "undefined" && process.pkg;

if (isPkg) {
  // In pkg, use the current working directory
  dbFolder = path.join(process.cwd(), ".db");
} else {
  // Normal Node.js environment
  dbFolder = path.join(__dirname, "..", "..", ".db");
}

// Ensure .db folder exists
if (!fs.existsSync(dbFolder)) {
  fs.mkdirSync(dbFolder, { recursive: true });
}

const expansionsDbPath = path.join(dbFolder, "expansions.db");
const blueprintsDbPath = path.join(dbFolder, "blueprints.db");

const expansionsDb = new Datastore({
  filename: expansionsDbPath,
  autoload: true,
});
const blueprintsDb = new Datastore({
  filename: blueprintsDbPath,
  autoload: true,
});

const storeExpansions = (expansions) => {
  // Ensure consistent ID naming
  const normalizedExpansions = Array.isArray(expansions) ? expansions.map(exp => ({
    ...exp,
    expansion_id: exp.id || exp.expansion_id,
    game_id: exp.game_id
  })) : [{
    ...expansions,
    expansion_id: expansions.id || expansions.expansion_id,
    game_id: expansions.game_id
  }];

  expansionsDb.insert(normalizedExpansions, (err) => {
    if (err) {
      console.error("Error storing expansions:", err);
    } else {
      console.log("Expansions stored successfully.");
    }
  });
};

const loadExpansions = () => {
  return new Promise((resolve, reject) => {
    expansionsDb.find({}, (err, docs) => {
      if (err) {
        console.error("Error loading expansions:", err);
        reject(err);
      } else {
        resolve(docs);
      }
    });
  });
};

const storeBlueprints = (blueprints) => {
  // Ensure consistent ID naming
  const normalizedBlueprints = Array.isArray(blueprints) ? blueprints.map(bp => ({
    ...bp,
    blueprint_id: bp.id || bp.blueprint_id,
    expansion_id: bp.expansion_id
  })) : [{
    ...blueprints,
    blueprint_id: blueprints.id || blueprints.blueprint_id,
    expansion_id: blueprints.expansion_id
  }];

  blueprintsDb.insert(normalizedBlueprints, (err) => {
    if (err) {
      console.error("Error storing blueprints:", err);
    } else {
      console.log("Blueprints stored successfully.");
    }
  });
};

const loadBlueprints = () => {
  return new Promise((resolve, reject) => {
    blueprintsDb.find({}, (err, docs) => {
      if (err) {
        console.error("Error loading blueprints:", err);
        reject(err);
      } else {
        resolve(docs);
      }
    });
  });
};

// New function to find blueprint by ID
const findBlueprintById = (blueprintId) => {
  return new Promise((resolve, reject) => {
    blueprintsDb.findOne({ $or: [{ id: blueprintId }, { blueprint_id: blueprintId }] }, (err, doc) => {
      if (err) {
        console.error("Error finding blueprint by ID:", err);
        reject(err);
      } else {
        resolve(doc);
      }
    });
  });
};

// New function to search blueprints by string
const searchBlueprints = (searchTerm) => {
  return new Promise((resolve, reject) => {
    const regex = new RegExp(searchTerm, "i");
    blueprintsDb.find({
      $or: [
        { name: regex },
        { display_name: regex },
        { text: regex }
      ]
    }, (err, docs) => {
      if (err) {
        console.error("Error searching blueprints:", err);
        reject(err);
      } else {
        resolve(docs);
      }
    });
  });
};

// New function to find blueprints by expansion ID
const findBlueprintsByExpansionId = (expansionId) => {
  return new Promise((resolve, reject) => {
    blueprintsDb.find({ expansion_id: expansionId }, (err, docs) => {
      if (err) {
        console.error("Error finding blueprints by expansion ID:", err);
        reject(err);
      } else {
        resolve(docs);
      }
    });
  });
};

// New function to find blueprints by game ID
const findBlueprintsByGameId = (gameId) => {
  return new Promise((resolve, reject) => {
    blueprintsDb.find({ game_id: gameId }, (err, docs) => {
      if (err) {
        console.error("Error finding blueprints by game ID:", err);
        reject(err);
      } else {
        resolve(docs);
      }
    });
  });
};

// New function to delete blueprint by ID
const deleteBlueprintById = (blueprintId) => {
  return new Promise((resolve, reject) => {
    blueprintsDb.remove({ $or: [{ id: blueprintId }, { blueprint_id: blueprintId }] }, { multi: true }, (err, numRemoved) => {
      if (err) {
        console.error("Error deleting blueprint by ID:", err);
        reject(err);
      } else {
        console.log(`Deleted ${numRemoved} blueprint(s) with ID: ${blueprintId}`);
        resolve(numRemoved);
      }
    });
  });
};

// New function to delete blueprints by expansion ID
const deleteBlueprintsByExpansionId = (expansionId) => {
  return new Promise((resolve, reject) => {
    blueprintsDb.remove({ expansion_id: expansionId }, { multi: true }, (err, numRemoved) => {
      if (err) {
        console.error("Error deleting blueprints by expansion ID:", err);
        reject(err);
      } else {
        console.log(`Deleted ${numRemoved} blueprint(s) for expansion ID: ${expansionId}`);
        resolve(numRemoved);
      }
    });
  });
};

// New function to delete blueprints by game ID
const deleteBlueprintsByGameId = (gameId) => {
  return new Promise((resolve, reject) => {
    blueprintsDb.remove({ game_id: gameId }, { multi: true }, (err, numRemoved) => {
      if (err) {
        console.error("Error deleting blueprints by game ID:", err);
        reject(err);
      } else {
        console.log(`Deleted ${numRemoved} blueprint(s) for game ID: ${gameId}`);
        resolve(numRemoved);
      }
    });
  });
};

module.exports = {
  storeExpansions,
  loadExpansions,
  storeBlueprints,
  loadBlueprints,
  findBlueprintById,
  searchBlueprints,
  findBlueprintsByExpansionId,
  findBlueprintsByGameId,
  deleteBlueprintById,
  deleteBlueprintsByExpansionId,
  deleteBlueprintsByGameId,
};
