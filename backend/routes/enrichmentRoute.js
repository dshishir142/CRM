const express = require('express');
const router = express.Router();
const enrichmentController = require('../controllers/enrichmentController.js')

router.get('/domain', enrichmentController.domainLookup);
router.get('/', enrichmentController.emailLookup);
router.get('/verify', enrichmentController.verifyEmail);

module.exports = router;