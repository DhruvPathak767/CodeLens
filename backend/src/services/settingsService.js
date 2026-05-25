const UserSettings = require("../models/settingsModel");

/**
 * Retrieves preferences for the user, upserting defaults if not created.
 *
 * @param {string} userId - User's MongoDB ID
 * @returns {Promise<Object>} - UserSettings document
 */
const getUserSettings = async (userId) => {
  let settings = await UserSettings.findOne({ user: userId });

  if (!settings) {
    // Upsert default settings
    settings = await UserSettings.create({
      user: userId,
      theme: "dark",
      notificationsEnabled: true,
      preferredLanguage: "JavaScript",
      aiModel: "gemini-1.5-flash",
      emailAlerts: true,
    });
  }

  return settings;
};

/**
 * Updates preferences settings for the user.
 *
 * @param {string} userId - User's MongoDB ID
 * @param {Object} updateData - Key-values to update
 * @returns {Promise<Object>} - Updated UserSettings document
 */
const updateUserSettings = async (userId, updateData) => {
  // Prune user parameter to prevent account hijacking injection
  if (updateData.user) delete updateData.user;

  // Discard email updates to protect user identity and maintain uniqueness
  if (updateData.email) delete updateData.email;

  // Persist profile updates in the User collection
  const User = require("../models/userModel");
  if (updateData.name || updateData.email) {
    const userUpdate = {};
    if (updateData.name) userUpdate.name = updateData.name;
    if (updateData.email) userUpdate.email = updateData.email;

    await User.findByIdAndUpdate(userId, { $set: userUpdate }, { runValidators: true });
    
    // Remove from updateData to prevent saving in UserSettings schema
    delete updateData.name;
    delete updateData.email;
  }

  const settings = await UserSettings.findOneAndUpdate(
    { user: userId },
    { $set: updateData },
    { new: true, upsert: true, runValidators: true }
  );

  return settings;
};

module.exports = {
  getUserSettings,
  updateUserSettings,
};
