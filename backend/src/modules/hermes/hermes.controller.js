const { User } = require('../../common/database/models');
const { success } = require('../../common/utils/apiResponse');

/**
 * Get personalized product feed for the user.
 * Currently returns empty — will be enhanced with AI-powered recommendations.
 */
async function personalizedFeed(req, res, next) {
  try {
    return success(res, { items: [], hasMore: false });
  } catch (err) {
    next(err);
  }
}

/**
 * Update user onboarding preferences.
 */
async function updateUserPreference(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id);
    if (user) {
      user.onboarding_data = { ...(user.onboarding_data || {}), preferences: req.body };
      await user.save();
    }
    return success(res, { message: 'Preference updated' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  personalizedFeed,
  updateUserPreference,
};
