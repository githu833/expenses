const express = require('express');
const router = express.Router();
const { getSources, addSource, deleteSource } = require('../controllers/sourceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getSources)
    .post(protect, addSource);

router.route('/:id')
    .delete(protect, deleteSource);

module.exports = router;
