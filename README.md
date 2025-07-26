# Card Tracker

A powerful Node.js CLI tool for fetching and managing card data from the CardTrader API. This tool allows you to efficiently process expansions and blueprints from various card games like Magic: The Gathering, Pokémon, Yu-Gi-Oh!, and more.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-orange.svg)](package.json)

## ✨ Features

- **🎮 Multi-Game Support**: Process data from Magic: The Gathering, Pokémon, Yu-Gi-Oh!, Flesh and Blood, and more
- **⚡ Flexible Processing**: Process all data, specific games, or individual expansions
- **💾 Local Database**: Store data locally using NeDB for fast access
- **🔐 Token Management**: Runtime token configuration and validation
- **🚦 Rate Limiting**: Built-in rate limiting to respect API limits
- **🖥️ CLI Interface**: Professional command-line interface for easy data management
- **📦 Batch Processing**: Efficient batch processing with progress tracking
- **🔍 Search & List**: Search blueprints and list data by various criteria
- **🗄️ Database Management**: Export, clear, and manage local data
- **📱 Cross-Platform**: Works on Linux, macOS, and Windows

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/card-tracker.git
cd card-tracker

# Install dependencies
npm install

# Install CLI globally (optional)
npm install -g .
```

### Configuration

**Option A: Runtime Configuration (Recommended)**
```bash
# Set your API token
card-tracker set-token <your_jwt_token>

# Test the token
card-tracker set-token <your_jwt_token> --test
```

**Option B: File Configuration (Legacy)**
Create a `src/config.js` file:
```javascript
const HOST = "api.cardtrader.com";
const JWT_SECRET = "your_jwt_secret_here";

module.exports = { HOST, JWT_SECRET };
```

### First Steps

```bash
# Check token status
card-tracker token-status

# List available games
card-tracker list games

# Get a specific expansion
card-tracker get expansion magic "lord of the rings"
```

## 📖 Usage

### Token Management

```bash
# Set your API token
card-tracker set-token <your_jwt_token>

# Set and test token immediately
card-tracker set-token <your_jwt_token> --test

# Check token status
card-tracker token-status

# Test current token
card-tracker token-status --test

# Clear token
card-tracker token-status --clear
```

### Data Retrieval

```bash
# Get specific expansion data
card-tracker get expansion <game> <expansion_name>

# Get all expansions for a game
card-tracker get game <game_name>

# Get specific expansions by ID
card-tracker get expansions <id1> <id2> ...

# List available games
card-tracker list games

# List expansions (all or by game)
card-tracker list expansions [game]

# List blueprints by expansion
card-tracker list blueprints --expansion <id>

# List blueprints by game
card-tracker list blueprints --game <id>
```

### Data Processing

```bash
# Process all expansions (1-2 hours)
card-tracker process all

# Process specific game expansions
card-tracker process game <game_name>

# Process specific expansions by ID
card-tracker process expansions <id1> <id2> ...
```

### Search & Discovery

```bash
# Search blueprints by ID
card-tracker search blueprint <blueprint_id>

# Search blueprints by string
card-tracker search blueprint "black lotus"

# Search in database only
card-tracker search blueprint "dragon" --database

# Search in API only
card-tracker search blueprint "fire" --api
```

### Database Management

```bash
# View database information
card-tracker db info

# Clear all database data
card-tracker db clear

# Export database to file
card-tracker db export <filename>

# Delete specific data from database
card-tracker db delete expansion <expansion_id>
card-tracker db delete game <game_name>
```

## 🎯 Examples

### Basic Usage

```bash
# Set up your API token
card-tracker set-token <your_jwt_token> --test

# Get Lord of the Rings expansion data
card-tracker get expansion magic "lord of the rings"

# Process all Magic: The Gathering expansions
card-tracker process game "Magic: The Gathering"

# List all Pokémon expansions
card-tracker list expansions "Pokémon"

# Search for a specific card
card-tracker search blueprint "black lotus"

# Process specific expansion IDs
card-tracker process expansions 1468 1469 1470

# Clear database and start fresh
card-tracker db clear
```

### Advanced Usage

```bash
# Process with verbose output
card-tracker process game "Pokémon" --verbose

# List blueprints with details
card-tracker list blueprints --expansion 1468 --verbose

# Search with limit
card-tracker search blueprint "dragon" --limit 5

# Export database to JSON
card-tracker db export data.json

# Delete specific expansion data
card-tracker db delete expansion 1468
```

## 📦 NPM Scripts

For quick access without global installation:

```bash
# Process all expansions
npm run batch

# Process specific games
npm run pokemon
npm run magic

# List data
npm run games
npm run pokemon-list
npm run magic-list
npm run all-expansions
npm run all-magic

# Test with specific expansions
npm run test

# Build executables
npm run build
```

## 🎮 Supported Games

- **Magic: The Gathering** (720+ expansions)
- **Pokémon** (776+ expansions)
- **Yu-Gi-Oh!** (expansions)
- **Flesh and Blood** (expansions)
- **Digimon** (expansions)
- **Dragon Ball Super** (expansions)
- **Cardfight!! Vanguard** (expansions)
- **My Hero Academia** (expansions)
- **One Piece** (expansions)
- **Disney Lorcana** (expansions)
- **Star Wars Unlimited** (expansions)
- **Union Arena** (expansions)
- **Riftbound | League of Legends** (expansions)
- **Gundam** (expansions)
- **And more...**

## ⚡ Performance

- **Batch Processing**: 1-2 hours for all 3,340+ expansions
- **Game-Specific**: 10-20 minutes for popular games
- **Rate Limiting**: Built-in delays to respect API limits
- **Local Storage**: Fast access to processed data
- **Memory Efficient**: Processes data in chunks

## 🗄️ Database

Data is stored locally in the `.db/` folder using NeDB:
- `expansions.db` - Expansion metadata
- `blueprints.db` - Card blueprint data
- `token.json` - Runtime token storage

Database files are automatically gitignored to prevent accidental commits.

## 📁 Project Structure

```
card-tracker/
├── .db/                        # Database files (gitignored)
│   ├── expansions.db
│   ├── blueprints.db
│   └── token.json
├── src/
│   ├── cli.js                 # CLI entry point
│   ├── index.js               # Main entry point
│   ├── config.js              # API configuration
│   ├── services/              # Business logic
│   │   ├── apiService.js
│   │   ├── tokenService.js
│   │   ├── batchProcessor.js
│   │   ├── selectiveProcessor.js
│   │   └── storageService.js
│   ├── cli/                   # CLI commands
│   │   └── commands/
│   │       ├── set-token.js
│   │       ├── token-status.js
│   │       ├── get-expansion.js
│   │       ├── list-games.js
│   │       └── ...
│   └── scripts/               # NPM script executables
│       ├── batch-process.js
│       ├── process-pokemon.js
│       ├── process-magic.js
│       └── ...
├── package.json
├── README.md
└── PACKAGING.md
```

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- CardTrader API access

### Setup

```bash
# Clone and install
git clone https://github.com/yourusername/card-tracker.git
cd card-tracker
npm install

# Set up your token
card-tracker set-token <your_jwt_token> --test

# Run linting
npm run lint

# Test the CLI
card-tracker --help
```

### Building

```bash
# Build executables for all platforms
npm run build

# Build for specific platform
npm run build:linux
npm run build:mac
npm run build:win
```

## 📦 Packaging

The tool can be packaged into standalone executables:

- **pkg**: Cross-platform Node.js executables
- **AppImage**: Linux portable applications
- **Docker**: Containerized deployment

See [PACKAGING.md](PACKAGING.md) for detailed instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [CardTrader API](https://api.cardtrader.com/) for providing the card data
- [NeDB](https://github.com/louischatriot/nedb) for lightweight database storage
- [Commander.js](https://github.com/tj/commander.js) for CLI framework
- [Axios](https://axios-http.com/) for HTTP client

## 📞 Support

If you encounter any issues or have questions:

1. Check the [documentation](#usage)
2. Search existing [issues](https://github.com/yourusername/card-tracker/issues)
3. Create a new issue with detailed information

---

**Made with ❤️ for the card gaming community**