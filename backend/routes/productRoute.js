const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController.js');

router.get('/', productController.getAllProducts);
router.post('/', productController.addProduct);
router.put('/:product_id', productController.editProduct);
router.delete('/:product_id', productController.deleteProduct);
router.get('/getclients', productController.getClientByProduct)

module.exports = router;