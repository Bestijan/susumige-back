const express = require('express');
const router = express.Router();
const putController = require('../controllers/putController');

router.put('/update-news', putController.updateNews);
router.put('/like', putController.like);

module.exports = router;