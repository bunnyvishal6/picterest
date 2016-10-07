var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

//Pic Schema
const PicSchema = new Schema({
    owner: {
        type: String,
        required: true
    },
    ownerUsername: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    picUrl: {
        type: String,
        required: true
    },
    likes: Array
});

var Pic = mongoose.model('Pic', PicSchema);

module.exports = Pic;
