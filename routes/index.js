var express = require('express'),
path = require('path'),
app = express(),
passport = require('passport');
router = express.Router();

router.get('/signup', function(req, res){
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/mywall', function(req, res){
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/settings', function(req, res){
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/logout', function(req, res){
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/publicwall', function(req, res){
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/users/:username', function(req, res){
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// module exports
module.exports = router;