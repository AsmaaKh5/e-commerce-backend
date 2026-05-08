const cartService = require('./cart.service');
const asyncWrapper = require('../../middlewares/asyncWrapper');
const httpStatusText = require('../../utils/httpStatusText');

exports.getCart = asyncWrapper(async (req, res) => {
  const cart = await cartService.getUserCart(req.user._id);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { cart }
  });
});

exports.addItem = asyncWrapper(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const cart = await cartService.addItem(req.user._id, productId, quantity);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { cart }
  });
});

exports.updateItem = asyncWrapper(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const cart = await cartService.updateItem(req.user._id, itemId, quantity);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { cart }
  });
});

exports.removeItem = asyncWrapper(async (req, res) => {
  const { itemId } = req.params;
  const cart = await cartService.removeItem(req.user._id, itemId);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { cart }
  });
});