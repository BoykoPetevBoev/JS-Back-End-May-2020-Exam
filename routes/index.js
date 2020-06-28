const user = require('../handlers/user');
const home = require('../handlers/home');
const theater = require('../handlers/theater');
const auth = require('../utils/authHandler');

module.exports = (app) => {
    // USER
    app.get('/logout',
        auth.userAutorization,
        auth.userStatus,
        user.userLogout
    );
    app.get('/login',
        auth.guestAutorization,
        auth.userStatus,
        user.loadLoginPage
    );
    app.get('/register',
        auth.guestAutorization,
        auth.userStatus,
        user.loadRegisterPage
    );
    app.post('/login',
        auth.guestAutorization,
        auth.userStatus,
        user.loginHandler
    );
    app.post('/register',
        auth.guestAutorization,
        auth.userStatus,
        user.registerHandler
    );




    app.get('/theater/create',
        auth.userAutorization,
        auth.userStatus,
        theater.loadCreateTheaterPage
    );
    app.post('/theater/create',
        auth.userAutorization,
        auth.userStatus,
        theater.createTheaterHandler
    );
    app.get('/details/:id',
        auth.userAutorization,
        auth.userStatus,
        theater.loadDetailsPage
    );
    app.get('/edit/:id',
        auth.userAutorization,
        auth.userStatus,
        theater.loadEditPage
    );
    app.post('/edit/:id',
        auth.userAutorization,
        auth.userStatus,
        theater.editHandler
    );
    app.get('/delete/:id',
        auth.userAutorization,
        auth.userStatus,
        theater.deletePlay
    );
    app.get('/like/:id',
        auth.userAutorization,
        auth.userStatus,
        theater.likeHandler
    );

    
    app.get('/',
        auth.userStatus,
        home.loadHomePage
    );
    app.get('/sort-by-date',
        auth.userAutorization,
        auth.userStatus,
        home.sortByDate
    )
    app.get('/sort-by-likes',
        auth.userAutorization,
        auth.userStatus,
        home.sortByLikes
    )


}