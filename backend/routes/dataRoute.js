const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController.js');

router.get('/:id', dataController.getHistory);

module.exports = router;