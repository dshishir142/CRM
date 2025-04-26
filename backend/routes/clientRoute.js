const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.post('/', clientController.addClient);
router.get('/:agent', clientController.getAllClient);
router.put('/interestscore/:client', clientController.changeInterestScore);
router.get('/client-product/:agent', clientController.getClientProduct);

module.exports = router;