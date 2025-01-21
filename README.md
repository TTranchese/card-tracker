# Card Price Tracker

This project is a backend application built with Node.js to fetch all cards from the CardTrader API. The fetched data will be stored in an in-memory database and used to expose CRUD operations for a client application.

## Features

- Fetch all expansions and blueprints from the CardTrader API.
- Store expansions and blueprints in an in-memory database using `nedb`.
- Expose CRUD operations for the client application to interact with the stored data.

## Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/card-price-tracker.git
   cd card-price-tracker
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `config.js` file in the `src` directory with your JWT secret:
   ```javascript
   const HOST = "api.cardtrader.com";
   const JWT_SECRET = "your_jwt_secret_here";

   module.exports = { HOST, JWT_SECRET };
   ```

4. Run the application:
   ```sh
   npm start
   ```

## Usage

The application will fetch all expansions and blueprints from the CardTrader API and store them in the in-memory database. You can then use the exposed CRUD operations to interact with the stored data.

## License

This project is licensed under the MIT License.