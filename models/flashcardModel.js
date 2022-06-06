const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'A flash card must have a question!'],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, 'A flash card must have an answer!'],
      trim: true,
    },
    done: {
      type: Boolean,
      required: [true, 'A flash card must have a done statement!'],
      default: false,
    },
    // References
    subject: {
      type: mongoose.Schema.ObjectId,
      ref: 'Subject',
      required: [true, 'A flashcard must belong to a subject!'],
    },
  },
  { id: false }
);

flashcardSchema.index({ question: 1, subject: 1 }, { unique: true });

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

module.exports = Flashcard;
