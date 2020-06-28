const Play = require('../models/Play');
const User = require('../models/User');

function loadCreateTheaterPage(req, res) {
    res.render('theater-pages/create-theater.hbs', {
        isLoggedIn: req.isLoggedIn,
        ...req.user
    });
}
async function createTheaterHandler(req, res) {
    const { title, description, imageUrl, publicStatus } = req.body;
    if (!title) {
        return invalidData('Title can not be empty!');
    }
    else if (!description) {
        return invalidData('Description can not be empty!');
    }
    else if (!imageUrl) {
        return invalidData('Image Url can not be empty!');
    }
    else if (description.length > 50) {
        return invalidData('Description can not be more than 50 characters!');
    }
    const isPublic = publicStatus === 'on' ? true : false;
    const alreadyCreated = await Play.findOne({ title });
    if (alreadyCreated) {
        return invalidData(`${title} is already created!`);
    }
    const createdAt = new Date().toString().slice(0, 21);
    const creator = req.user.userId;
    const theater = new Play({
        title,
        description,
        imageUrl,
        isPublic,
        createdAt,
        creator
    });
    const status = await theater.save();
    if (status) {
        console.log('New play created successfully');
    }
    return res.redirect('/');
    function invalidData(errMessage) {
        return res.render('theater-pages/create-theater.hbs', {
            isLoggedIn: req.isLoggedIn,
            ...req.user,
            errMessage,
            title,
            description,
            imageUrl
        })
    }
}
async function loadDetailsPage(req, res) {
    const userId = req.user.userId;
    const { id } = req.params;
    const theater = await Play.findById(id).lean();
    const creator = theater.creator.toString();
    const usersLiked = theater.usersLiked.toString();
    let isCreator = creator === userId ? true : false;
    let liked = usersLiked.includes(userId) ? true : false;
    res.render('theater-pages/theater-details', {
        isLoggedIn: req.isLoggedIn,
        ...req.user,
        ...theater,
        isCreator,
        liked
    })
}
async function loadEditPage(req, res) {
    const { id } = req.params;
    const userId = req.user.userId;
    const theater = await Play.findById(id).lean();
    const creator = theater.creator.toString();
    if (userId !== creator) {
        return res.redirect('/');
    }
    res.render('theater-pages/edit-theater.hbs', {
        isLoggedIn: req.isLoggedIn,
        ...req.user,
        ...theater,
    })
}
async function editHandler(req, res) {
    const { title, description, imageUrl, publicStatus } = req.body;
    const { id } = req.params;
    const userId = req.user.userId;
    const theater = await Play.findById(id).lean();
    const creator = theater.creator.toString();
    if (userId !== creator) {
        return res.redirect('/');
    }
    if (!title) {
        return invalidData('Title can not be empty!');
    }
    else if (!description) {
        return invalidData('Description can not be empty!');
    }
    else if (!imageUrl) {
        return invalidData('Image Url can not be empty!');
    }
    else if (description.length > 50) {
        return invalidData('Description can not be more than 50 characters!');
    }
    const isPublic = publicStatus === 'on' ? true : false;
    await Play.findOneAndUpdate({ _id: id }, {
        title,
        description,
        imageUrl,
        isPublic
    })
    res.redirect(`/details/${id}`);

    function invalidData(errMessage) {
        return res.render('theater-pages/edit-theater.hbs', {
            isLoggedIn: req.isLoggedIn,
            ...req.user,
            errMessage,
            title,
            description,
            imageUrl,
            _id: id
        })
    }
}
async function deletePlay(req, res) {
    const { id } = req.params;
    const userId = req.user.userId;
    const theater = await Play.findById(id).lean();
    const creator = theater.creator.toString();
    if (userId !== creator) {
        return res.redirect('/');
    }
    await Play.deleteOne({ _id: id });
    console.log("Successful deletion");
    res.redirect('/');
}
async function likeHandler(req, res) {
    const userId = req.user.userId;
    const { id } = req.params;
    const theater = await Play.findById(id).lean();
    const usersLiked = theater.usersLiked.toString();
    if (usersLiked.includes(userId)) {
        return res.redirect(`/details/${id}`);
    }
    await Play.update({ _id: id }, { $push: { usersLiked: userId } });
    await User.update({ _id: userId }, { $push: { likedPlays: id } });

    res.redirect(`/details/${id}`);
}

module.exports = {
    loadCreateTheaterPage,
    createTheaterHandler,
    loadDetailsPage,
    loadEditPage,
    editHandler,
    deletePlay,
    likeHandler
}