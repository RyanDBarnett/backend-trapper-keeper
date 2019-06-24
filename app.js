// Require express library
const express = require('express');
// Require cross origin request library
const cors = require('cors');
// Require uuid for unique ids
const uuidv1 = require('uuid/v1')

// Create an express application
const app = express();
// Use cors to prevent cors errors
app.use(cors());
// Use express.json to automatically parse incoming requests
app.use(express.json());

// Dummy cards data
app.locals.cards = [
  {id: 1, name: 'Grocery List',  list: 
    [
      {list_id: 123123, item: 'Pop', checked: true},
      {list_id: 321312, item: 'Coke', checked: false},
      {list_id: 231312, item: 'Soda', checked: true}
    ]
  },
  {id: 2, name: 'Chores List', list: 
    [
      {list_id: 243432, item: 'Do the dishes', checked: false}
    ]
  }
]

// Get request to show all the cards
app.get('/api/v1/cards', (req, res) => {
  // Return a response with a 200 status code and all of the cards in json
  return res.status(200).json(app.locals.cards);
});

// Post request to add a new card
app.post('/api/v1/cards', (req, res) => {
  // Destructure the request body into name and list variables
  const { name, list } = req.body;
  // If there isn't a name then return a response with a 422 status code
  // with an error message telling the user to name their card
  if(!name) return res.status(422).json('Please name your card');
  // Add an id to the new card
  const newCard = {
      id: Date.now(),
      ...req.body
  };
  // Add the new card to all the other cards on the server
  app.locals.cards = [...app.locals.cards, newCard];
  // Return a response with a status code of 201 and the new card in json format
  return res.status(201).json(newCard);
});

// Get request for an individual card based on it's id
app.get('/api/v1/cards/:id', (req, res) => {
  // Destructure the id from the request params
  const { id } = req.params;
  // Find the specific card by its id
  const matchingCard = app.locals.cards.find(card => card.id == id);
  // If there isn't a card return a 404 status code and an error message
  if (!matchingCard) return res.status(404).json(`Card with id of ${id} does not exist`);
  // Return a response status code of 200 with the card in json format
  return res.status(200).json(matchingCard);
});

// A put request to update a specific card with new data
app.put('/api/v1/cards/:id', (req, res) => {
  // Destructure the request body into name and list variables
  const { name, list } = req.body;
  // If there isn't a name return a response with a 422 status code and an error message
  if (!name) return res.status(422).json('Your card must have a name');
  // If the list doesn't have any elements then return a response with a 422 status code and an error message
  if (!list.length) return res.status(422).json('You must have at least 1 list item before you can save this card');
  // Get the card id from the request params
  const id = parseInt(req.params.id);
  // Find the card index by the id
  const targetCardIndex = app.locals.cards.findIndex(card => card.id === id);
  // If the card index is -1 then that card doesn't exist so return a response of 404 status code and an error message
  if (targetCardIndex === -1) return res.status(404).json(`Cannot update: Card not found at the id of ${id}`);
  // Create a new card object from the id, name, and list
  const updatedCard = {id, name, list};
  // Replace the old card with the updated card info
  app.locals.cards.splice(targetCardIndex, 1, updatedCard);
  // Return a response with a status code of 204
  return res.sendStatus(204);
});

// Delete a card based on its id
app.delete('/api/v1/cards/:id', (req , res) => {
  // Find the card index from the request params id
  const cardIndex = app.locals.cards.findIndex( card => card.id == req.params.id);
  // If the card index is -1 then the card doesn't exist so return a response of 404 with an error message of card not found
  if(cardIndex === -1) return res.status(404).json('Card not found');
  // Remove the card
  app.locals.cards.splice(cardIndex, 1);
  // Return a response with a 204 status code.
  return res.sendStatus(204);
});

// Export the express app so it can be imported in server.js
module.exports = app;