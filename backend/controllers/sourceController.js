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
    const { name } = req.body;

    try {
        const sourceExists = await Source.findOne({ userId: req.user._id, name });
        if (sourceExists) {
            return res.status(400).json({ message: 'Source already exists' });
        }

        const source = await Source.create({
            userId: req.user._id,
            name
        });

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

module.exports = {
    getSources,
    addSource,
    deleteSource
};
