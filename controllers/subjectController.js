const Subject = require('./../models/subjectModel');
const Flashcard = require('./../models/flashcardModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getMySubjects = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;

  const subjects = await Subject.find({ user: req.user._id })
    .skip(skip)
    .limit(limit)
    .select('-__v -user')
    .sort('name');

  res.status(200).json({
    status: 'success',
    data: {
      subjects,
    },
  });
});

exports.createMySubject = catchAsync(async (req, res, next) => {
  const subject = await Subject.create({
    name: req.body.name,
    user: req.user._id,
  });

  subject.__v = undefined;
  subject.user = undefined;

  res.status(201).json({
    status: 'success',
    data: {
      subject,
    },
  });
});

exports.getMySubject = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;

  const alone = req.query.alone;

  let subject;

  if (alone) {
    subject = await Subject.findOne({
      user: req.user._id,
      _id: req.params.subjectId,
    });
  } else {
    subject = await Subject.findOne({
      user: req.user._id,
      _id: req.params.subjectId,
    })
      .populate({
        path: 'flashcards',
        model: 'Flashcard',
        select: 'question answer done -subject',
        options: {
          skip,
        },
      })
      .select('-__v');
  }

  if (!subject) {
    return next(new AppError("Subject doesn't exist!", 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      subject,
    },
  });
});

exports.updateMySubject = catchAsync(async (req, res, next) => {
  const subject = await Subject.findOne({
    user: req.user._id,
    _id: req.params.subjectId,
  });

  if (!subject) {
    return next(new AppError("Subject doesn't exist!", 404));
  }

  if (req.body.name) {
    subject.name = req.body.name;
  }

  await subject.save();

  subject.__v = undefined;
  subject.user = undefined;

  res.status(200).json({
    status: 'success',
    data: {
      subject,
    },
  });
});

exports.deleteMySubject = catchAsync(async (req, res, next) => {
  const subject = await Subject.findOne({
    user: req.user._id,
    _id: req.params.subjectId,
  });

  if (!subject) {
    return next(new AppError("Subject doesn't exist!", 404));
  }

  const flashcards = await Flashcard.find({ subject: subject._id });

  if (flashcards.length > 0) {
    return next(
      new AppError(
        'You can not delete the subject, unless you delete all the flash cards for it!',
        400
      )
    );
  }

  await subject.delete();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
