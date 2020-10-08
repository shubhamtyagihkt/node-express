const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    }
});

// passport Local mongoose plugin itself include username, password field and
// also various other field required for passport authentication
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);