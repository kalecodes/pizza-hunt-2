const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

// define the pizza schema
const PizzaSchema = new Schema({
    pizzaName: {
        type: String,
        required: true,
        trim: true
    },
    createdBy: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // format data before it gets to controller
        get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
        type: String,
        required: true,
        enum: ['Personal', 'Small', 'Medium', "Large", "Extra Large"],
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
    // tell the schema that it can use virtuals and getters
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
});

// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
})

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;
