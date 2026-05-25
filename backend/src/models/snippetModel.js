const mongoose = require("mongoose");

const snippetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Snippet must belong to a user"],
    },
    title: {
      type: String,
      required: [true, "Snippet title is required"],
      trim: true,
      maxlength: [100, "Snippet title cannot exceed 100 characters"],
    },
    language: {
      type: String,
      required: [true, "Language identifier is required"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Snippet code content is required"],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Performance compound index
snippetSchema.index({ user: 1, language: 1 });
snippetSchema.index({ tags: 1 });

module.exports = mongoose.model("Snippet", snippetSchema);
