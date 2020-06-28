const env = process.env.NODE_ENV || 'development';

const config = {
    development: {
        port: process.env.PORT || 3000,
        dbUser: 'user',
        dbPassword: 123,
        dbName: 'Theaters', 
        dbAddress: 'softuni-dx3ut.mongodb.net',
        tokenKey: 'SuperSecretKey'
    },
    production: {}
}

module.exports = config[env];