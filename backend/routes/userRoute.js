const express = require ('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');
const upload = multer();

router.post('/signup', userController.createUser);
router.get('/:email', userController.getUserByEmail);
router.post('/login', userController.getUserForLogin);
router.post('/edituser', userController.updateUser);
router.get('/', userController.getAllUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;