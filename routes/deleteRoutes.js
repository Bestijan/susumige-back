const express = require('express');
const router = express.Router();
const deleteController = require('../controllers/deleteController');
const { verifyToken, checkRole } = require('../middleware/auth');

router.delete('/delete-news/:deleteData', deleteController.deleteNews);
router.delete('/delete-user', [verifyToken, checkRole('admin')], deleteController.deleteUser);

module.exports = router;