const asyncWrapper = require('../middlewares/asyncWrapper');
const AppError = require('./appError');
const httpStatusText = require('./httpStatusText');

/**
 * Handler Factory - للـ entities البسيطة فقط
 * 
 * ⚠️ ملاحظة: للـ entities المعقدة، استخدمي Service + Repository
 * هذا للـ CRUD السريع للحالات اللي مفيهاش business logic
 */

exports.getAll = (repository, options = {}) =>
  asyncWrapper(async (req, res) => {
    const result = await repository.findWithFeatures(req.query, {
      searchFields: options.searchFields,
      baseFilter: options.baseFilter,
      populate: options.populate
    });

    res.status(200).json({
      status: httpStatusText.SUCCESS,
      results: result.data.length,
      pagination: result.pagination,
      data: { [options.modelName || 'data']: result.data }
    });
  });

exports.getOne = (repository, options = {}) =>
  asyncWrapper(async (req, res, next) => {
    const doc = await repository.findById(req.params.id, {
      populate: options.populate
    });

    if (!doc) {
      return next(
        AppError.create(
          `${options.modelName || 'Resource'} not found`,
          404,
          httpStatusText.FAIL
        )
      );
    }

    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { [options.modelName || 'data']: doc }
    });
  });

exports.createOne = (repository, options = {}) =>
  asyncWrapper(async (req, res) => {
    const doc = await repository.create(req.body);
    res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: { [options.modelName || 'data']: doc }
    });
  });

exports.updateOne = (repository, options = {}) =>
  asyncWrapper(async (req, res, next) => {
    const doc = await repository.updateById(req.params.id, req.body);

    if (!doc) {
      return next(
        AppError.create(
          `${options.modelName || 'Resource'} not found`,
          404,
          httpStatusText.FAIL
        )
      );
    }

    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { [options.modelName || 'data']: doc }
    });
  });

exports.softDeleteOne = (repository, options = {}) =>
  asyncWrapper(async (req, res, next) => {
    const doc = await repository.softDeleteById(req.params.id);

    if (!doc) {
      return next(
        AppError.create(
          `${options.modelName || 'Resource'} not found`,
          404,
          httpStatusText.FAIL
        )
      );
    }

    res.status(200).json({
      status: httpStatusText.SUCCESS,
      message: `${options.modelName || 'Resource'} deleted successfully`
    });
  });