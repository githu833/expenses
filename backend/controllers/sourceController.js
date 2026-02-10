const Source = require('../models/sourceModel');
const Transaction = require('../models/transactionModel');

const getSources = async (req, res) => {
    try {
        const sources = await Source.find({ userId: req.user._id });
        res.json(sources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addSource = async (req, res) => {
    const { name, initialBalance } = req.body;

    try {
        const sourceExists = await Source.findOne({ userId: req.user._id, name });
        if (sourceExists) {
            return res.status(400).json({ message: 'Source already exists' });
        }

        const source = await Source.create({
            userId: req.user._id,
            name
        });

        // Create initial balance transaction if initialBalance > 0
        if (initialBalance > 0) {
            await Transaction.create({
                userId: req.user._id,
                type: 'income',
                amount: initialBalance,
                sourceId: source._id,
                source: 'Initial Balance',
                category: 'Other',
                date: new Date(),
                purpose: 'Initial Balance Setup'
            });
        }

        res.status(201).json(source);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteSource = async (req, res) => {
    try {
        const source = await Source.findById(req.params.id);

        if (!source) {
            return res.status(404).json({ message: 'Source not found' });
        }

        if (source.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // Check if transactions exist for this source
        const transactionExists = await Transaction.findOne({ sourceId: req.params.id });
        if (transactionExists) {
            return res.status(400).json({ message: 'Cannot delete source with existing transactions' });
        }

        await source.deleteOne();
        res.json({ message: 'Source removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const completeOnboarding = async (req, res) => {
    const { sources } = req.body; // Expecting [{ name: string, balance: number }]

    try {
        const createdSources = [];
        for (const s of sources) {
            // Create the source
            const source = await Source.create({
                userId: req.user._id,
                name: s.name
            });
            createdSources.push(source);

            // Create initial balance transaction if balance > 0
            if (s.balance > 0) {
                await Transaction.create({
                    userId: req.user._id,
                    type: 'income',
                    amount: s.balance,
                    sourceId: source._id,
                    source: 'Initial Balance',
                    category: 'Other',
                    date: new Date(),
                    purpose: 'Initial Balance Setup'
                });
            }
        }
        res.status(201).json(createdSources);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getSources,
    addSource,
    deleteSource,
    completeOnboarding
};
