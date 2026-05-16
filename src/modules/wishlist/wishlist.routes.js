const express = require('express');
const router = express.Router();
const wishlistController = require('./wishlist.controller');
const verifyToken = require('../../middlewares/verifyToken');
router.use(verifyToken);

router
  .route('/')
  .get(wishlistController.getWishlist)
  .post(wishlistController.addToWishlist);

router
  .route('/:productId')
  .delete(wishlistController.removeFromWishlist);

module.exports = router;