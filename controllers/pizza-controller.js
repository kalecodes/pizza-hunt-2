const { Pizza } = require('../models');

// create methods of pizzaController 
// will be used as the callback functions for the Express.js routes, so will take params (req, res)
const pizzaController = {
    // get all pizzas
    getAllPizzas(req, res) {
        Pizza.find({})
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // get one pizza by id
    getPizzaById({ params }, res) {
        Pizza.findOne({ _id: params.id })
            .then(dbPizzaData => {
                // if no pizza found, 404
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => {
                console.log(err);
                res.status(404).json(err);
            });
    },

    // create pizza
    createPizza({ body }, res) {
        Pizza.create(body)
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.status(400).json(err));
    },

    // update pizza by id
    // setting param new: true, we are instrucitng mongoose to return the new version of the document (post updating)
    updatePizza({ params, body }, res) {
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err));
    },

    // delete pizza by id
    deletePizza({ params }, res) {
        Pizza.findOneAndDelete({ _id: params.id })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err));
    }
};

module.exports = pizzaController;