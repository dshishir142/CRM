const express = require('express');
const router = express.Router();
const mailController = require('../controllers/mailController');

router.get('/', mailController.getEmails);

module.exports = router;