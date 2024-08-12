const User = require('../models/users');
const News = require('../models/news');

/**
 * Providing deleting news in
 * app used for news manipulation
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.deleteNews = async(req, res) => {
    const deleteData = req.params.deleteData;
    if (!deleteData) {
      return res.status(400).json({ message: 'newsId and updateData are required' });
    }
  
    try {
      const result = await News.deleteOne({ newsId: deleteData });

      if (result.nModified === 0) {
        return res.status(404).json({ message: 'News item not found or no changes detected' });
      }
  
      res.status(200).json({ message: 'News item deleted successfully', result });
    } catch (error) {
      res.status(500).json({ message: 'Error updating news item', error: error.message });
    }
};

/**
 * Deleting user (only admin can delete an user)
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteUser = async (req, res) => {
    const { id } = req.body;
    await User.deleteOne({id: id})
              .then(() => {
                res.status(200).send({deleted: true});
              })
              .catch(error => {
                res.status(400).send(error);
              });
};