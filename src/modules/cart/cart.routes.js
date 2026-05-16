const express = require('express');
const router = express.Router();
const cartController = require('./cart.controller');
const verifyToken = require('../../middlewares/verifyToken');

router.use(verifyToken);

router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.patch('/items/:itemId', cartController.updateItem);
router.delete('/items/:itemId', cartController.removeItem);

module.exports = router;
