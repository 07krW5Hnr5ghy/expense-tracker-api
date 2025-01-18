const Expense = require('../models/expenseModel');

// Create an Expense
const createExpense = async (req, res) => {
    const { title, amount, category, date } = req.body;

    try {
        const expense = await Expense.create({
            userId: req.user._id,
            title,
            amount,
            category,
            date,
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get All Expenses with Filters
const getExpenses = async (req, res) => {
    const { startDate, endDate, category } = req.query;

    try {
        const filter = { userId: req.user._id };
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }
        if (category) {
            filter.category = category;
        }

        const expenses = await Expense.find(filter).sort({ date: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update an Expense
const updateExpense = async (req, res) => {
    const { id } = req.params;
    const { title, amount, category, date } = req.body;

    try {
        const expense = await Expense.findOne({ _id: id, userId: req.user._id });
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        expense.title = title || expense.title;
        expense.amount = amount || expense.amount;
        expense.category = category || expense.category;
        expense.date = date || expense.date;

        await expense.save();

        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete an Expense
const deleteExpense = async (req, res) => {
    const { id } = req.params;

    try {
        const expense = await Expense.findOneAndDelete({
            _id: id,
            userId: req.user._id,
        });

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
};
