const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount cannot be negative'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: [
            'Groceries',
            'Leisure',
            'Electronics',
            'Utilities',
            'Clothing',
            'Health',
            'Others',
        ],
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        default: Date.now,
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model('Expense', expenseSchema);
