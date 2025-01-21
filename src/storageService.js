const Datastore = require('nedb');
const path = require('path');

const expansionsDb = new Datastore({ filename: path.join(__dirname, 'expansions.db'), autoload: true });
const blueprintsDb = new Datastore({ filename: path.join(__dirname, 'blueprints.db'), autoload: true });

const storeExpansions = (expansions) => {
  expansionsDb.insert(expansions, (err, newDocs) => {
    if (err) {
      console.error('Error storing expansions:', err);
    } else {
      console.log('Expansions stored successfully.');
    }
  });
};

const loadExpansions = () => {
  return new Promise((resolve, reject) => {
    expansionsDb.find({}, (err, docs) => {
      if (err) {
        console.error('Error loading expansions:', err);
        reject(err);
      } else {
        resolve(docs);
      }
    });
  });
};

const storeBlueprints = (blueprints) => {
  blueprintsDb.insert(blueprints, (err, newDocs) => {
    if (err) {
      console.error('Error storing blueprints:', err);
    } else {
      console.log('Blueprints stored successfully.');
    }
  });
};

const loadBlueprints = () => {
  return new Promise((resolve, reject) => {
    blueprintsDb.find({}, (err, docs) => {
      if (err) {
        console.error('Error loading blueprints:', err);
        reject(err);
      } else {
        resolve(docs);
      }
    });
  });
};

module.exports = { storeExpansions, loadExpansions, storeBlueprints, loadBlueprints };
