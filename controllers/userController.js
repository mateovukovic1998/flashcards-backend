const User = require('./../models/userModel');
const Flashcard = require('./../models/flashcardModel');
const Subject = require('./../models/subjectModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.updateMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  console.log(req.body);
  console.log(req.body.firstName);

  if (req.body.email) {
    user.email = req.body.email;
  }

  if (req.body.firstName) {
    user.firstName = req.body.firstName;
  }

  if (req.body.lastName) {
    user.lastName = req.body.lastName;
  }

  await user.save();

  user.password = undefined;
  user.__v = undefined;

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const subjects = await Subject.find({ user: user._id });

  for (const subject of subjects) {
    await Flashcard.deleteMany({ subject: subject._id });
  }

  await Subject.deleteMany({ user: user._id });

  await user.delete();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { password, currentPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  const currentIsValid = await user.correctPassword(
    currentPassword,
    user.password
  );

  if (!currentIsValid) {
    return next(new AppError('Your current password is not valid!', 400));
  }

  user.password = password;

  await user.save();

  user.password = undefined;
  user.__v = undefined;

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
