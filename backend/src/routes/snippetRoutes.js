const express = require("express");
const {
  createSnippet,
  getSnippets,
  getSnippetById,
  updateSnippet,
  deleteSnippet,
} = require("../controllers/snippetController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply JWT verification protect middleware to all snippet endpoints
router.use(protect);

router.post("/", createSnippet);
router.get("/", getSnippets);

router.get("/:id", getSnippetById);
router.put("/:id", updateSnippet);
router.delete("/:id", deleteSnippet);

module.exports = router;
