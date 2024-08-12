const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { verifyToken, checkRole } = require('../middleware/auth');

router.post('/write-news', postController.writeNews);
router.post('/comment', postController.comment);
router.post('/login', postController.login);
router.post('/logout', postController.logout);
router.post('/get-new-token', postController.getNewToken);
router.post('/get-refresh-token', postController.getRefreshToken);
router.post('/add-user', [verifyToken, checkRole('admin')], postController.addUser);

module.exports = router;