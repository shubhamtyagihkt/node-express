const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const Favorites = require('../models/favorite');
const cors = require('./cors');
const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.find({'user': req.user._id})
    .populate('dishes')
    .populate('user')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({'user': req.user._id})
    .then(favorites => {
        if (favorites.length) {
            // if single dish_id given in body
            if (req.body._id)
            {
                if (favorites[0].dishes.indexOf(req.body._id) == -1)
                    favorites[0].dishes.push(req.body._id);
            }
            // if array of dish_ids given in req.body
            if (req.body.length)
            {
                for (let i = 0; i < req.body.length; i++)
                {
                    if (favorites[0].dishes.indexOf(req.body[i]._id) == -1)
                    favorites[0].dishes.push(req.body[i]._id);
                }
            }
            favorites[0].save(function (err, favorite) {
                if (err) throw err;
                console.log('Something is up!');
                res.json(favorite);
            });
        } else {
            Favorites.create({user: req.user._id}, function (err, favorite) {
                if (err) throw err;
                // if single dish_id given in body
                if (req.body._id)
                {
                    favorite.dishes.push(req.body._id);
                }
                // if array of dish_ids given in req.body
                if (req.body.length)
                {
                    for (let i = 0; i < req.body.length; i++)
                    {
                        favorite.dishes.push(req.body[i]._id);
                    }
                }
                favorite.save(function (err, favorite) {
                    if (err) throw err;
                    console.log('Something is up!');
                    res.json(favorite);
                });
            })
        }
    });
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.remove({'user': req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({'user': req.user._id})
    .then(favorites => {
        if (favorites.length) {
            if (favorites[0].dishes.indexOf(req.params.dishId) == -1)
                favorites[0].dishes.push(req.params.dishId);
            favorites[0].save(function (err, favorite) {
                if (err) throw err;
                console.log('Something is up!');
                res.json(favorite);
            });
        } else {
            Favorites.create({user: req.user._id}, function (err, favorite) {
                if (err) throw err;
                favorite.dishes.push(req.params.dishId);
                favorite.save(function (err, favorite) {
                    if (err) throw err;
                    console.log('Something is up!');
                    res.json(favorite);
                });
            })
        }
    })
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({'user': req.user._id}, function (err, favorites) {
        if (err) return err;
        var favorite = favorites ? favorites[0] : null;

        if (favorite) {
            for (var i = (favorite.dishes.length - 1); i >= 0; i--) {
                if (favorite.dishes[i] == req.params.dishId) {
                    favorite.dishes.remove(req.params.dishId);
                }
            }
            favorite.save(function (err, favorite) {
                if (err) throw err;
                console.log('Here you go!');
                res.json(favorite);
            });
        } else {
            console.log('No favourites!');
            res.json(favorite);
        }
    });
});

module.exports = favoriteRouter;