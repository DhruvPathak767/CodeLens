const snippetService = require("../services/snippetService");
const logActivity = require("../helpers/activityLogger");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { ApiError } = require("../middleware/errorMiddleware");
const API_MESSAGES = require("../constants/apiMessages");

/**
 * @desc    Save a new reusable code snippet
 * @route   POST /api/snippets
 * @access  Private
 */
const createSnippet = asyncHandler(async (req, res, next) => {
  const { title, language, code, tags } = req.body;

  if (!title || !language || !code) {
    return next(new ApiError(400, "Please provide 'title', 'language', and 'code' content."));
  }

  const snippet = await snippetService.createSnippet(req.user._id, title, language, code, tags);

  // Log activity
  logActivity(req.user._id, "snippet_create", { snippetId: snippet._id, language });

  return sendSuccess(res, 201, API_MESSAGES.SNIPPET.CREATED, snippet);
});

/**
 * @desc    List all saved code snippets
 * @route   GET /api/snippets
 * @access  Private
 */
const getSnippets = asyncHandler(async (req, res, next) => {
  const snippets = await snippetService.getSnippets(req.user._id);

  return sendSuccess(res, 200, API_MESSAGES.SNIPPET.FETCHED, snippets);
});

/**
 * @desc    Get detailed single snippet by ID
 * @route   GET /api/snippets/:id
 * @access  Private
 */
const getSnippetById = asyncHandler(async (req, res, next) => {
  const snippet = await snippetService.getSnippetById(req.params.id, req.user._id);

  return sendSuccess(res, 200, "Snippet retrieved successfully", snippet);
});

/**
 * @desc    Update a saved snippet details
 * @route   PUT /api/snippets/:id
 * @access  Private
 */
const updateSnippet = asyncHandler(async (req, res, next) => {
  const snippet = await snippetService.updateSnippet(req.params.id, req.user._id, req.body);

  // Log activity
  logActivity(req.user._id, "snippet_update", { snippetId: req.params.id });

  return sendSuccess(res, 200, API_MESSAGES.SNIPPET.UPDATED, snippet);
});

/**
 * @desc    Delete a saved snippet record
 * @route   DELETE /api/snippets/:id
 * @access  Private
 */
const deleteSnippet = asyncHandler(async (req, res, next) => {
  const result = await snippetService.deleteSnippet(req.params.id, req.user._id);

  // Log activity
  logActivity(req.user._id, "snippet_delete", { snippetId: req.params.id });

  return sendSuccess(res, 200, API_MESSAGES.SNIPPET.DELETED, result);
});

module.exports = {
  createSnippet,
  getSnippets,
  getSnippetById,
  updateSnippet,
  deleteSnippet,
};
