const News = require('../models/news');
/**
 * Updates already writen news
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.updateNews = async(req, res) => {
    const updateData = req.body;
    if (!updateData) {
      return res.status(400).json({ message: 'newsId and updateData are required' });
    }
  
    try {
      const result = await News.updateOne({ newsId: updateData.newsId }, { $set: updateData });
      
      if (result.nModified === 0) {
        return res.status(404).json({ message: 'News item not found or no changes detected' });
      }
  
      res.status(200).json({ message: 'News item updated successfully', result });
    } catch (error) {
      res.status(500).json({ message: 'Error updating news item', error: error.message });
    }
};


/**
 * Increments likes or decrements 
 * if already the news is liked
 * Users that are logged in with
 * google account can like the news
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.like = async(req, res) => {
    const newsId = req.body.newsId;
    const email = req.body.email;
    if (!newsId || !email) {
      return res.status(400).json({ message: 'newsId and email are required' });
    }

    try {
        let likes = await News.findOne({newsId: newsId});
        const ind = likes.likes.findIndex(l => l.get('email') === email);
        if (ind >= 0) {
            if (likes.likes[ind].get('liked')) {
                await likes.updateOne({$set: {'likesNum': likes.likesNum - 1, likes: 
                                             {'liked': !likes.likes[ind].get('liked'), email: email }}});
                return res.status(200).json({message: 'Likes updated succesfully', 
                                                      'liked': false, 
                                                      'numberOfLikes': likes.likesNum - 1});
            } else { 
                await likes.updateOne({$set: {'likesNum': likes.likesNum + 1, likes: 
                                             {'liked': !likes.likes[ind].get('liked'), email: email }}});
                return res.status(200).json({message: 'Likes updated succesfully', 
                                                      'liked': true,
                                                      'numberOfLikes': likes.likesNum + 1});
            }
        } else {
            try {
                await likes.updateOne({$set: {likes: {liked: true, email: email}, likesNum: likes.likesNum + 1}});
                return res.status(200).json({message: 'Likes updated succesfully', 
                                                      'numberOfLikes': likes.likesNum + 1,
                                                      'liked': true});
            } catch(error) {
                return res.status(500).json({message: 'Error getting likes', error: error.message});
            }
        }   
    } catch(error) {
        res.status(500).json({message: 'Error getting likes', error: error.message});
    }
};