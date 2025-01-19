const Expense = require('../models/expenseModel');
const CustomError = require('../utils/customError');

// Create an Expense
const createExpense = async (req, res, next) => {
    
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
const getExpenses = async (req, res, next) => {
    const { startDate, endDate, category,timeTerm,page = 1, limit = 10 } = req.query;

    try {
        const filter = { userId: req.user._id };
        
        if (category) {
            filter.category = category;
        }
        if (timeTerm === "past_week") {
            filter.date = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
        } else if (timeTerm === "past_month") {
            filter.date = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
        } else if (timeTerm === "last_3_month") {
            filter.date = { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) };
        } else if (timeTerm === "custom"){
            if (startDate || endDate) {
                filter.date = {};
                if (startDate) filter.date.$gte = new Date(startDate);
                if (endDate) filter.date.$lte = new Date(endDate);
            }
        }

        const expenses = await Expense.find(filter)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ date: -1 });

        const total = await Expense.countDocuments(filter);

        res.status(200).json({ data: expenses, page: Number(page), limit: Number(limit), total });
    } catch (error) {
        next(error);
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
const updateExpense = async (req, res, next) => {
    const { id } = req.params;
    const { title, amount, category, date } = req.body;

    try {
        const expense = await Expense.findOne({ _id: id, userId: req.user._id });
        if (!expense) {
            throw new CustomError("Expense not found.", 404);
        }

        expense.title = title || expense.title;
        expense.amount = amount || expense.amount;
        expense.category = category || expense.category;
        expense.date = date || expense.date;

        await expense.save();

        res.status(200).json(expense);
    } catch (error) {
        next(error);
    }
};

// Delete an Expense
const deleteExpense = async (req, res, next) => {
    const { id } = req.params;

    try {
        const expense = await Expense.findOneAndDelete({
            _id: id,
            userId: req.user._id,
        });

        if (!expense) {
            throw new CustomError("Expense not found.", 404);
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
};
