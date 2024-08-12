const { mongoose } = require('mongoose');
const { TextImage } = require('./textImage');

/**
 * Comment class with nick of user,
 * text of comment and image of user
 * from google account
 */
class Comment extends mongoose.Model {
    commentNick = '';
    commentText = '';
    img = new TextImage(-1);
}

const CommentModel = mongoose.model(Comment, new mongoose.Schema({
    commentNick: { type: String, required: true },
    commentText: { type: Number, required: true},
    img: { type: mongoose.Schema.Types.Map, required: true}
}));

module.exports = { CommentModel, Comment };