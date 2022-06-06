const Flashcard = require('./../models/flashcardModel');
const Subject = require('./../models/subjectModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getMyFlashCards = catchAsync(async (req, res, next) => {
  const subject = await Subject.findOne({
    user: req.user._id,
    _id: req.params.subjectId,
  });

  if (!subject) {
    return next(
      new AppError("Subject for these flashcards doesn't exist!", 404)
    );
  }

  // FILTER
  const filterObj = { ...req.query };
  const excludedFields = ['page', 'limit'];
  excludedFields.forEach((el) => delete filterObj[el]);

  // PAGINATIOM

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;

  const flashcards = await Flashcard.find({
    subject: subject._id,
    ...filterObj,
  })
    .skip(skip)
    .limit(limit)
    .select('-__v -user -subject')
    .sort('question');

  res.status(200).json({
    status: 'success',
    data: {
      flashcards,
    },
  });
});

exports.createMyFlashcard = catchAsync(async (req, res, next) => {
  const subject = await Subject.findOne({
    user: req.user._id,
    _id: req.params.subjectId,
  });

  if (!subject) {
    return next(new AppError("Subject for this flashcard doesn't exist!", 404));
  }

  const flashcard = await Flashcard.create({
    question: req.body.question,
    answer: req.body.answer,
    subject: req.params.subjectId,
  });

  flashcard.__v = undefined;
  flashcard.subject = undefined;

  res.status(201).json({
    status: 'success',
    data: {
      flashcard,
    },
  });
});

exports.getMyFlashCard = catchAsync(async (req, res, next) => {
  const subject = await Subject.findOne({
    user: req.user._id,
    _id: req.params.subjectId,
  });

  if (!subject) {
    return next(new AppError("Subject for this flashcard doesn't exist!", 404));
  }

  const flashcard = await Flashcard.findOne({
    subject: req.params.subjectId,
    _id: req.params.flashcardId,
  });

  if (!flashcard) {
    return next(new AppError("Flashcard doesn't exist!", 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      flashcard,
    },
  });
});

exports.updateMyFlashCard = catchAsync(async (req, res, next) => {
  const subject = await Subject.findOne({
    user: req.user._id,
    _id: req.params.subjectId,
  });

  if (!subject) {
    return next(new AppError("Subject for this flashcard doesn't exist!", 404));
  }

  const flashcard = await Flashcard.findOne({
    subject: subject._id,
    _id: req.params.flashcardId,
  });

  if (!flashcard) {
    return next(new AppError("Flashcard doesn't exist!", 404));
  }

  if (req.body.answer) {
    flashcard.answer = req.body.answer;
  }

  if (req.body.question) {
    flashcard.question = req.body.question;
  }

  if (req.body.hasOwnProperty('done')) {
    flashcard.done = req.body.done;
  }

  await flashcard.save();

  flashcard.__v = undefined;
  flashcard.subject = undefined;

  res.status(200).json({
    status: 'success',
    data: {
      flashcard,
    },
  });
});

exports.deleteMyFlashCard = catchAsync(async (req, res, next) => {
  const subject = await Subject.findOne({
    user: req.user._id,
    _id: req.params.subjectId,
  });

  if (!subject) {
    return next(new AppError("Subject for this flashcard doesn't exist!", 404));
  }

  const flashcard = await Flashcard.findOne({
    subject: subject._id,
    _id: req.params.flashcardId,
  });

  if (!flashcard) {
    return next(new AppError("Flashcard doesn't exist!", 404));
  }

  await flashcard.delete();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
