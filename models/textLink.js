const { mongoose } = require('mongoose');
const NewsItem = require('./newsItem');

/**
 * Link inside the news
 */
class TextLink extends NewsItem {
    id;
    link = '';

    constructor(id) {
        super(id);
    }
}

const TextLinkModel = mongoose.model(TextLink, mongoose.Schema({
    link: { type: String, required: true }
}));

module.exports = { TextLink, TextLinkModel };