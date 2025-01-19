const Expense = require('../models/expenseModel');
const CustomError = require('../utils/customError');

// Create an Expense
const createExpense = async (req, res,next) => {
    
    try {
        const { title, amount, category, date } = req.body;

        if (!title || !amount || !category || !date) {
            throw new CustomError("Title, amount, category and date are required fields.", 400);
        }

        if (amount < 0.01) {
            throw new CustomError("Amount must be a positive value.", 400);
        }

        const validCategories = [
            "Groceries",
            "Leisure",
            "Electronics",
            "Utilities",
            "Clothing",
            "Health",
            "Others",
        ];

        if (!validCategories.includes(category)) {
            throw new CustomError(`Invalid category. Must be one of: ${validCategories.join(", ")}`, 400);
        }

        const expense = await Expense.create({
            userId: req.user._id,
            title,
            amount,
            category,
            date,
        });

        res.status(201).json(expense);
    } catch (error) {
        next(error);
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

// Get expense by Id
const getExpenseById = async (req,res,next) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            throw new CustomError("Expense not found.", 404);
        }

        if (expense.userId.toString() !== req.user.id) {
            throw new CustomError("You do not have permission to view this expense.", 403);
        }

        res.status(200).json(expense);
    } catch (error) {
        next(error);
    }
}

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
    getExpenseById,
    updateExpense,
    deleteExpense,
};
