const News = require('../models/news');
const User = require('../models/users');
const popular = 'ПОПУЛАРНО';
const chosen = 'ИЗАБРАНО';

/**
 * Returns data when app is started
 * @param {*} req 
 * @param {*} res 
 */
exports.bundleNews = async (req, res) => {
    News.find()
        .then((result) => {
            const headerNews = result.filter(news => news.flag === popular);
            const centralNews = result.filter(news => news.flag === chosen);
            return res.status(200).json({'leftNews': result.slice(0, 5), 'header': headerNews, 'main': centralNews});
    }).catch(error => {
        console.log(error);
    });
};

/**
 * Returns all news (used only on mobile phones)
 * @param {*} req 
 * @param {*} res 
 */
exports.allNews = async(req, res) => {
    News.find()
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch(error => {
            return res.status(400).json(error);
        }); 
};

/**
 * Increments number of views each time when
 * a news is opened
 * @param {*} req 
 * @param {*} res 
 */
exports.news = async(req, res) => {
    const newsId = req.query.newsId;
    News.findOne({ 'newsId' : newsId })
        .then(result => {
              if (result) {
                  News.updateOne({ newsId: newsId }, { $set: { views: result.views++ } }).
                  then(() => { res.status(200).json(result); })
                  .catch(error => {
                        console.log(error);
                        res.status(500);
                  });
              }
        })
        .catch(error => {
            console.log(error);
            res.status(500);
        });
};


exports.mobileViewNews = async(req, res) => {
    News.find()
        .then((result) => {
            return res.status(200).json(result.slice(0, 5));
        })
        .catch(error => {
            return res.status(400).json(error);
        }); 
};

/**
 * On scrolling down in leftsidebar
 * loads previous news
 * @param {*} req 
 * @param {*} res 
 */
exports.newerNews = async(req, res) => {
    const gt = new Date(req.query.date);

    var queryNewerNews = {
        $gt: gt
    };

    await News.findOne({'date' : queryNewerNews})
           .then(result => {
                res.status(200).json(result);
           }).catch(error => {
             console.log(error);
             res.status(400);
           });
};

/**
 * On scrolling up in leftsidebar
 * loads newer news
 * @param {*} req 
 * @param {*} res 
 */
exports.olderNews = async(req, res) => {
    const lt = new Date(req.query.date);

    var queryOlderNews = {
        $lt: lt
    };

    await News.findOne({'date': queryOlderNews}).sort({date: -1})
            .then(result => {
                    res.status(200).json(result);
            }).catch(error => {
                console.log(error);
                res.status(400);
            });
};

/**
 * Filtering news by section
 * @param {*} req 
 * @param {*} res 
 */
exports.sectionNews = async(req, res) => {
    const section = req.query.section;
    if (section === '') {
        await News.find({'flag': chosen})
        .then(result => {
              res.status(200).json(result);
        })
        .catch(() => {
          res.status(400);
        });
    } else {
        await News.find({'section': section})
                .then(result => {
                      res.status(200).json(result);
                })
                .catch(() => {
                    res.status(400);
                });
    }
};

/**
 * Provides searcing news by title
 * @param {*} req 
 * @param {*} res 
 */

exports.search = async(req, res) => {
    const search = req.query.search;

    await News.find({title : new RegExp(search, 'i')})
              .then(result => {
                    res.status(200).json(result);
              })
              .catch(() => {
                     res.status(400);
              });
};

// Protected route - only accessible by admin
exports.getUsers = async (req, res) => {
    await User.UserModel.find()
              .then(users => {
                res.status(200).send(users.filter(u => u.get('role') !== 'admin'));
              })
              .catch(error => {
                res.status(400).send(error);
              });
};

// Protected route - accessible by user and admin
exports.user = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send({users: null, user: users.find(u => u.username === req.body.username)});
    } catch(error) {
        res.status(400).send(error);
    }
};