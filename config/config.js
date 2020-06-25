const env = process.env.NODE_ENV || 'development';

const config = {
    development: {
        port: process.env.PORT || 3000,
        dbUser: 'user',
        dbPassword: 123,
        dbName: '', //TODO
        dbAddress: 'softuni-dx3ut.mongodb.net'
    },
    production: {}
}

module.exports = config[env];