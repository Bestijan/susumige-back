const express = require('express');
const router = express.Router();
const getController = require('../controllers/getController');
const { verifyToken, checkRole } = require('../middleware/auth');

router.get('/bundle-news', getController.bundleNews);
router.get('/all-news', getController.allNews);
router.get('/news', getController.news);
router.get('/older-news', getController.olderNews);
router.get('/section-news', getController.sectionNews);
router.get('/search', getController.search);
router.get('/get-users', [verifyToken, checkRole('admin')] , getController.getUsers);
router.get('/user', verifyToken , getController.user);

module.exports = router;