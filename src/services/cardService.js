const apiClient = require('../utils/apiClient');

async function getCards() {
    // Placeholder for fetching cards from an API
    return [
        { name: 'Card 1', price: 10 },
        { name: 'Card 2', price: 20 },
    ];
}

module.exports = {
    getCards,
};
