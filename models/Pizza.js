const { Schema, model } = require('mongoose');

// define the pizza schema
const PizzaSchema = new Schema({
    pizzaName: {
        type: String
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    size: {
        type: String, 
        default: 'Large'
    },
    toppings: [],
    comments: [
        {
            // tell mongoose to expect an ObjectId and that its data comes from the Comment model
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
},
{
    // tell the schema that it can use virtuals
    toJSON: {
        virtuals: true
    },
    id: false
});

// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.length;
})

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;
