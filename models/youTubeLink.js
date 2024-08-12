const { default: mongoose } = require('mongoose');
const NewsItem = require('./newsItem');

/**
 * Contains link of youtube video
 */
class YouTubeLink extends NewsItem {
    id;
    link = '';

    constructor(id) {
        super(id);
    }
}

const YouTubeLinkModel = mongoose.model(YouTubeLink, new mongoose.Schema({
    link: { type: String, required: true}
}));

module.exports = { YouTubeLink, YouTubeLinkModel };