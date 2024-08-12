const User = require('../models/users');
const News = require('../models/news');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const secret = 'af010c115600c00ee246901678110005';
const salt = 10;


/**
 * Puts a news in database and
 * creates unique id for every news
 */
exports.writeNews = async (req, res) => {
    const r = req.body;
    News.create({
        thumbnail: r['thumbnail'],
        section: r['section'],
        title: r['title'],
        snipet: r['snipet'],
        news: r['news'],
        nick: r['nick'],
        newsId: uuidv4(),
        flag: r['flag'],
        views: 0,
        likes: new Array(),
        likesNum: 0,
        commentsNum: 0,
        comments: new Array(),
        date: new Date()
    }).then(result => {
        res.status(200).json(result);
    }).catch(error => {
        res.status(400).send(error);
    });
}, error => {
    res.status(error);
};

/**
 * Provides storing comment inside 
 * database and incrementing number
 * of comments per news
 * Only if user is logged with 
 * google account
 * @param {*} req 
 * @param {*} res 
 */
exports.comment = async(req, res) => {
    const img = req.body.img;
    const comment = req.body.comment;
    const commentNick = req.body.commentNick;
    const newsId = req.body.newsId;

    let comments = await News.findOne({newsId: newsId});

    News.updateOne({'newsId': newsId}, {$push: {'comments': {'commentText': comment, 'commentNick': commentNick, 'img': img}}})
        .then(() => { res.status(200).json({'message': "Comment is setted!", 
                                            'commentText': comment, 'commentNick': commentNick, 'img': img, 
                                            'commentsNum': comments.commentsNum + 1 })})
        .catch(error => { console.log(error); res.status(500).json(error) });

    News.updateOne({'newsId': newsId}, {$set: {'commentsNum': comments.commentsNum + 1}})
        .then(() => { })
        .catch(error => { res.status(500).json(error)});
};


/**
 * Provides login for app used for writting news:
 * (1) Checks does user exists
 * (2) Checks does password is valid
 * (3) Returns role, access, refresh token and nickname
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({username: username});

        if (!user) {
            return res.status(404).send('User not found');
        }

        const passwordIsValid = bcrypt.compareSync(password, user.get('password'));
        if (!passwordIsValid) {
            return res.status(401).send('Invalid password');
        }

        const accessToken = jwt.sign({ id: user.get('id'), role: user.get('role') }, secret, { expiresIn: '1h' });
        const refreshToken = jwt.sign(user.toJSON(), secret, {expiresIn: '7d'});

        res.status(200).send({ auth: true, role: user.get('role'), token: accessToken, refreshToken: refreshToken, nick: user.get('nick') });
    } catch(error) {
        return res.status(400).send(error);
    }
};

/**
 * Loges out a user 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.logout = async (req, res) => {
    const { username } = req.body;
    try {
        const user = await User.findOne({username: username});
        
        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).send({'loggedOut': 'Logged out'});
    } catch(error) {
        return res.status(400).send(error);
    }
};

/**
 * Gets a refresh token so that 
 * can return a new access token
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getNewToken = async (req, res) => {

    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(refreshToken, secret, (err, user) => {
        if (err) return res.status(403).send(err);
        const accessToken = jwt.sign(user, secret);
        res.json({ accessToken });
    });
};

/**
 * Accepts username and returns 
 * refresh and access token
 * in app for writing news
 * when refresh token expires 
 * @param {*} req 
 * @param {*} res 
 */
exports.getRefreshToken = async (req, res) => {

    const { username } = req.body;

    try {
        const user = await User.findOne({username: username});
        const refreshToken = jwt.sign(user.toJSON(), secret);
        const accessToken = jwt.sign(user.toJSON(), secret);
        res.json({ refreshToken, accessToken });
    } catch(error) {
        res.status(404).send(error);
    }
};

/**
 * Used in app for writing news
 * Accepts data for new user
 * only if current user is admin
 * and creates new user
 * @param {*} req 
 * @param {*} res 
 */
exports.addUser = async (req, res) => {
    const { username, password, nick } = req.body;
    try {
        const users = await User.find();
        const user = { id: users.length, username: username, password: bcrypt.hashSync(password, salt), role: 'user', nick: nick };
        await User.create({id: user.id, username: user.username, password: user.password, role: user.role, nick: user.nick})
                  .then(() => {
                    res.status(200).send({added: true});
                  })
                  .catch(error => {
                    res.status(400).send(error);
                  });
    } catch(error) {
        res.status(400).send(error);
    }
};


