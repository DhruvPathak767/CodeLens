const Snippet = require("../models/snippetModel");
const { ApiError } = require("../middleware/errorMiddleware");

/**
 * Service to save a new reusable code snippet.
 */
const createSnippet = async (userId, title, language, code, tags = []) => {
  return await Snippet.create({
    user: userId,
    title,
    language,
    code,
    tags,
  });
};

/**
 * Service to fetch user's saved snippets list.
 */
const getSnippets = async (userId) => {
  return await Snippet.find({ user: userId }).sort({ createdAt: -1 }).lean();
};

/**
 * Service to fetch a single snippet by ID.
 */
const getSnippetById = async (snippetId, userId) => {
  const snippet = await Snippet.findOne({ _id: snippetId, user: userId }).lean();
  if (!snippet) {
    throw new ApiError(404, "Snippet not found or unauthorized.");
  }
  return snippet;
};

/**
 * Service to update a snippet record.
 */
const updateSnippet = async (snippetId, userId, updateData) => {
  // Prevent user parameter hijack injection
  if (updateData.user) delete updateData.user;

  const snippet = await Snippet.findOneAndUpdate(
    { _id: snippetId, user: userId },
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean();

  if (!snippet) {
    throw new ApiError(404, "Snippet not found or unauthorized to update.");
  }

  return snippet;
};

/**
 * Service to delete a snippet record.
 */
const deleteSnippet = async (snippetId, userId) => {
  const snippet = await Snippet.findOneAndDelete({ _id: snippetId, user: userId });
  if (!snippet) {
    throw new ApiError(404, "Snippet not found or unauthorized to delete.");
  }
  return { id: snippetId };
};

module.exports = {
  createSnippet,
  getSnippets,
  getSnippetById,
  updateSnippet,
  deleteSnippet,
};
