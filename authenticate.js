const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/users');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtracJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 36000});
}

var opts = {};
opts.jwtFromRequest = ExtracJwt.fromAuthHeaderAsBearerToken('bearer');
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("JWT payload: ", jwt_payload);
    User.findOne({_id: jwt_payload._id}, (err, user) => {
        if (err) {
            return done;
        }
        else if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    })
}));

exports.verifyUser = passport.authenticate('jwt', {session: false});
exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin == true) {
        next();
    }
    else {
        var err = new Error("You are not authorized to perform this operation!");
        res.status = 403;
        next(err);
    }
}