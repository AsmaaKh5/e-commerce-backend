const wishlistService = require('./wishlist.service');
const asyncWrapper = require('../../middlewares/asyncWrapper');
const httpStatusText = require('../../utils/httpStatusText');

exports.getWishlist = asyncWrapper(async (req, res) => {
  const wishlist = await wishlistService.getUserWishlist(req.user._id);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { wishlist }
  });
});

exports.addToWishlist = asyncWrapper(async (req, res) => {
  const { productId } = req.body;
  const wishlistItem = await wishlistService.addToWishlist(req.user._id, productId);
  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { wishlistItem }
  });
});

exports.removeFromWishlist = asyncWrapper(async (req, res) => {
  const { productId } = req.params;
  const result = await wishlistService.removeFromWishlist(req.user._id, productId);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: result.message
  });
});