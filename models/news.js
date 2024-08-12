const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Schema for news
 */
const newsSchema = new Schema({
    thumbnail: {
        type: mongoose.Schema.Types.Map
    },
    section: {
        type: String
    },
    title: {
        type: String
    },
    snipet: {
        type: String
    },
    news: [{
        type: mongoose.Schema.Types.Map
    }],
    nick: {
        type: String
    },
    newsId: {
        type: String
    },
    flag: {
        type: String
    },
    views: {
        type: Number
    },
    likes: [{
        type: mongoose.Schema.Types.Map
    }],
    likesNum: {
        type: Number
    },
    comments: [{
        type: mongoose.Schema.Types.Map
    }],
    commentsNum: {
        type: Number
    },
    date: {
        type: Date
    }
}, { timestamps: true});

const News = mongoose.model('News', newsSchema);

module.exports = News;
