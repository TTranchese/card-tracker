const { Command } = require("commander");

const command = new Command("delete")
  .description("Delete specific data from database")
  .addCommand(require("./db-delete-expansion"))
  .addCommand(require("./db-delete-game"));

module.exports = command; 