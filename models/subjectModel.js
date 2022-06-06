const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A subject must have a name!'],
      trim: true,
    },
    // References
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A subject must belong to a user!'],
    },
  },
  { id: false, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

subjectSchema.index({ name: 1, user: 1 }, { unique: true });

subjectSchema.virtual('flashcards', {
  ref: 'Flashcard',
  foreignField: 'subject',
  localField: '_id',
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
