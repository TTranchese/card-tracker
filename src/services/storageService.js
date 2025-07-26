const Datastore = require("nedb");
const path = require("path");
const util = require("util");
const fs = require("fs");

// Fix for NeDB compatibility with newer Node.js versions
if (!util.isDate) {
  util.isDate = function(obj) {
    return Object.prototype.toString.call(obj) === "[object Date]";
  };
}

// Ensure .db folder exists
const dbFolder = path.join(__dirname, "..", "..", ".db");
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
  expansionsDb.insert(expansions, (err) => {
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
  blueprintsDb.insert(blueprints, (err) => {
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

module.exports = {
  storeExpansions,
  loadExpansions,
  storeBlueprints,
  loadBlueprints,
};
