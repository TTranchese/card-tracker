#!/usr/bin/env node

const { Command } = require("commander");
const program = new Command();

// Set up the CLI
program
  .name("card-tracker")
  .description("A powerful CLI tool for fetching and managing card data from the CardTrader API")
  .version("1.0.0", "-v, --version");

// Token management commands
program.addCommand(require("./cli/commands/set-token"));
program.addCommand(require("./cli/commands/token-status"));

// Get commands
program
  .command("get")
  .description("Retrieve data from the API or database")
  .addCommand(require("./cli/commands/get-expansion"))
  .addCommand(require("./cli/commands/get-game"))
  .addCommand(require("./cli/commands/get-expansions"));

// Search commands
program
  .command("search")
  .description("Search for data")
  .addCommand(require("./cli/commands/search-blueprint"));

// List commands
program
  .command("list")
  .description("List available data")
  .addCommand(require("./cli/commands/list-games"))
  .addCommand(require("./cli/commands/list-expansions"))
  .addCommand(require("./cli/commands/list-blueprints"));

// Process commands
program
  .command("process")
  .description("Process and store data")
  .addCommand(require("./cli/commands/process-all"))
  .addCommand(require("./cli/commands/process-game"))
  .addCommand(require("./cli/commands/process-expansions"));

// Database commands
program
  .command("db")
  .description("Database management operations")
  .addCommand(require("./cli/commands/db-info"))
  .addCommand(require("./cli/commands/db-clear"))
  .addCommand(require("./cli/commands/db-export"))
  .addCommand(require("./cli/commands/db-delete"));

program.parse(); 