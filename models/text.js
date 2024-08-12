
const { mongoose } = require('mongoose');
const NewsItem = require('./newsItem');

/**
 * Text of news
 */
class Text extends NewsItem {
    id;
    text = '';
    constructor(id) {
        super(id);
    }
}

const TextModel = mongoose.model(Text, new mongoose.Schema({
    text: { type: String, required: true }
}));

module.exports = { Text, TextModel };