const express = require('express');
const router = express.Router();
const mailController = require('../controllers/mailController');

router.get('/', mailController.getEmails);
router.post('/', mailController.sendEmail);

module.exports = router;