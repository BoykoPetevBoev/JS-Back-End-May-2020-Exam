const Play = require('../models/Play');

async function loadHomePage(req, res) {
    const isLoggedIn = req.isLoggedIn;
    const theaters = (await Play.find().lean()).filter((course) => course.isPublic === true);
    if (isLoggedIn) {
        theaters.sort((a, b) => new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1);
        return res.render('home/user-home.hbs', {
            isLoggedIn,
            ...req.user,
            theaters
        })
    }
    const topThree = theaters
        .sort((a, b) => (a.usersLiked.length < b.usersLiked.length) ? 1 : -1)
        .slice(0, 3);
    res.render('home/guest-home.hbs', {
        isLoggedIn,
        theaters: topThree
    })
}
async function sortByDate(req, res, next) {
    const theaters =
        (await Play.find().lean())
            .filter((course) => course.isPublic === true)
            .sort((a, b) => new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1)
    return res.render('home/user-home.hbs', {
        isLoggedIn: req.isLoggedIn,
        ...req.user,
        theaters
    })
}
async function sortByLikes(req, res, next) {
    const theaters =
        (await Play.find().lean())
            .filter((course) => course.isPublic === true)
            .sort((a, b) => (a.usersLiked.length < b.usersLiked.length) ? 1 : -1);
    return res.render('home/user-home.hbs', {
        isLoggedIn: req.isLoggedIn,
        ...req.user,
        theaters
    })
}

module.exports = {
    loadHomePage,
    sortByDate,
    sortByLikes
}