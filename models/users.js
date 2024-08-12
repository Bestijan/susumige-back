const { mongoose } = require('mongoose');

/**
 * User that can be admin or user (created by admin)
 * Contains username, password and nick 
 */
class User extends mongoose.Model {
    id = 0;
    username = '';
    password = '';
    role = 'admin' | 'user';
    nick = '';
}

const UserModel = mongoose.model(User, new mongoose.Schema({
    id: { type: Number, required: true},
    username: { type: String, required: true },
    password: { type: String, required: true},
    role: { type: String, required: true},
    nick: { type: String, required: true}
}));

module.exports = { UserModel, User };