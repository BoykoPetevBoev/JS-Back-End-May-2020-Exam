const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    likedPlays: [{
        type: Schema.Types.ObjectId,
        ref: 'Play'
    }]
});

module.exports = mongoose.model('User', UserSchema);