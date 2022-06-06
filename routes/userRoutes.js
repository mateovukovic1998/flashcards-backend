const express = require('express');

const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
const subjectController = require('./../controllers/subjectController');
const flashcardController = require('./../controllers/flashcardController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.patch('/me/updateData', authController.protect, userController.updateMe);

router.delete('/me/delete', authController.protect, userController.deleteMe);
router.patch(
  '/me/updatePassword',
  authController.protect,
  userController.updatePassword
);

router
  .route('/me/subjects')
  .get(authController.protect, subjectController.getMySubjects)
  .post(authController.protect, subjectController.createMySubject);

router
  .route('/me/subjects/:subjectId')
  .get(authController.protect, subjectController.getMySubject)
  .patch(authController.protect, subjectController.updateMySubject)
  .delete(authController.protect, subjectController.deleteMySubject);

router
  .route('/me/subjects/:subjectId/flashcards')
  .get(authController.protect, flashcardController.getMyFlashCards)
  .post(authController.protect, flashcardController.createMyFlashcard);

router
  .route('/me/subjects/:subjectId/flashcards/:flashcardId')
  .get(authController.protect, flashcardController.getMyFlashCard)
  .patch(authController.protect, flashcardController.updateMyFlashCard)
  .delete(authController.protect, flashcardController.deleteMyFlashCard);

module.exports = router;
