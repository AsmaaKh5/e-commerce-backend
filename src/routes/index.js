const express = require('express');
const router = express.Router();


router.use('/auth', require('../modules/auth/auth.routes'));
router.use('/users', require('../modules/user/user.routes'));
router.use('/categories', require('../modules/category/category.routes'));
router.use('/brands', require('../modules/brand/brand.routes'));
router.use('/products', require('../modules/product/product.routes'));
router.use('/cart', require('../modules/cart/cart.routes'));
router.use('/wishlist', require('../modules/wishlist/wishlist.routes'));

module.exports = router;