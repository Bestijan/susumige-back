const mongoose = require('mongoose');

/**
 * Class that is inherited by 
 * parts of news - it can be
 * text, image, link or youtube link
 */
class NewsItem extends mongoose.Model {
   id;

   constructor(id) {
        this.id = id;
   }
}

const NewsItemModel = mongoose.model(NewsItem, new mongoose.Schema({}));

module.exports = { NewsItem, NewsItemModel };
