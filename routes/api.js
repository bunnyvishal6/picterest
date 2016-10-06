var express = require('express'),
    app = express(),
    passport = require('passport'),
    User = require('../models/user'),
    Pic = require('../models/pic'),
    router = express.Router();

//get the config file
var config = require('../config/config');

//get passport config
require('../config/passport')(passport);

//post signup
router.post('/signup/local', function (req, res) {
    if (!req.body.email || !req.body.username.length > 5 || !req.body.password1 || !/^[a-z]+[1-9]*0?[1-9]*$/.test(req.body.username)) {
        res.json({ message: "please send mail, username and password to register" });
    } else {
        var newUser = new User({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password1
        });

        //attempt to save this neUser
        newUser.save(function (err) {
            if (err) {
                return res.json(err.errmsg.split(':')[2]);
            }
            res.json("Account creation success");
        });
    }
});

router.post('/auth/login/local', function (req, res) {
    User.getAuthenticated({ email: req.body.email, password: req.body.password }, function (err, token) {
        if (err) {
            return res.json(err);
        } else if (token) {
            res.json(token);
        }
    });
});

router.get('/mypics', passport.authenticate('jwt', { session: false }), function (req, res) {
    Pic.find({ owner: req.user.email }, function (err, pics) {
        if (err) {
            return res.json(err);
        }
        if (pics.length > 0) {
            return res.status(200).json(pics);
        } else {
            return res.status(200).json('no-pics');
        }
    });
});

router.post('/addpic', passport.authenticate('jwt', { session: false }), function (req, res) {
    var newPic = new Pic({
        owner: req.user.email,
        title: req.body.title,
        picUrl: req.body.url,
        likes: []
    });
    newPic.save(function (err) {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        res.json("success");
    });
});

router.get('/getmyprofile', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (req.user) {
        User.findOne({ email: req.user.email }, function (err, doc) {
            if (err) {
                return res.json(err);
            }
            if (doc) {
                return res.json({ city: doc.city, state: doc.state, country: doc.country });
            }
            return res.json("No user found");
        });
    }
});

router.post('/updatemyprofile', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (req.user) {
        User.findOne({ email: req.user.email }, function (err, doc) {
            if (err) {
                return res.json(err);
            }
            if (doc) {
                doc.city = req.body.city;
                if (req.body.state) {
                    doc.state = req.body.state;
                }
                if (req.body.country) {
                    doc.country = req.body.country;
                }
                doc.save(function (err) {
                    if (err) {
                        return res.json(err);
                    }
                    return res.json('success');
                });
            }
        });
    } else {
        res.json('password do not match');
    }
});

router.post('/changemypassword', passport.authenticate('jwt', { session: false }), function (req, res) {
    if (req.user) {
        User.findOne({ email: req.user.email }, function (err, doc) {
            if (err) {
                return res.json(err);
            }
            if (!doc) {
                return res.json('nouserfound');
            }
            doc.comparePassword(req.body.password, function (err, match) {
                if (err) {
                    return res.json(err);
                }
                if (match) {
                    doc.password = req.body.password1;
                    doc.save(function (err) {
                        if (err) {
                            return res.json(err);
                        }
                        return res.json('success');
                    });
                } else {
                    return res.json('password do not match');
                }
            });
        });
    } else {
        res.json('password do not match');
    }
});

router.post('/removemypic', passport.authenticate('jwt', {session: false}), function(req, res){
    Pic.findOneAndRemove({_id: req.body.id, owner: req.user.email}, function(err){
        if(err){
            return res.json(err);
        }

        res.json('success');
    })
});


module.exports = router;