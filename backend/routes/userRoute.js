const express = require ('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.createUser);
router.get('/:email', userController.getUserByEmail);
router.post('/login', userController.getUserForLogin);

module.exports = router;