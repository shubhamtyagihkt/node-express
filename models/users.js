const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
    /*username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },*/
    admin: {
        type: Boolean,
        default: false
    }
});

// passport Local mongoose plugin itself include username, password field and
// also various other field required for passport authentication
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);