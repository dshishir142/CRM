const express = require ('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');
const upload = multer();

router.get('/', userController.getAllUser);
router.post('/signup', userController.createUser);
router.get('/:email', userController.getUserByEmail);
router.post('/login', userController.getUserForLogin);
router.post('/edituser', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/admin', userController.getAdminForLogin);

module.exports = router;