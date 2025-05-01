const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.post('/', clientController.addClient);
router.get('/one/:client', clientController.getClientById);
router.get('/all', clientController.getAllClients);
router.get('/:agent', clientController.getClients);
router.put('/:client', clientController.updateClient);
router.put('/interestscore/:client', clientController.changeInterestScore);
router.get('/client-product/:agent', clientController.getClientProduct);
router.post('/assign-product', clientController.assignProduct);
router.delete('/:client', clientController.deleteClient);

module.exports = router;