const { ForbiddenError, NotFoundError } = require('../utils/errors');

function requireResourceOwner(ResourceModel, idParam = 'id', userIdField = 'user_id') {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[idParam] || req.body[idParam];
      if (!resourceId) return next(new NotFoundError('Resource ID is required'));

      const resource = await ResourceModel.findByPk(resourceId, { paranoid: false });
      if (!resource) return next(new NotFoundError('Resource not found'));

      if (resource[userIdField] !== req.user.id && req.user.role !== 'admin') {
        return next(new ForbiddenError('You do not have permission to access this resource'));
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { requireResourceOwner };
