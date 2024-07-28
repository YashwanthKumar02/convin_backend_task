const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    splitType: {
        type: String,
        required: true,
        enum: ['equal', 'exact', 'percentage']
    },
    participants: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
            amount: { type: Number }
        }
    ]
});

module.exports = mongoose.model('Expense', expenseSchema);
