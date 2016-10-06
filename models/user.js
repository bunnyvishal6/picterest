var mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    config = require('../config/config');
bcrypt = require('bcryptjs');


const Schema = mongoose.Schema;

//User schema
const UserSchema = new Schema({
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    profilepic: {
        type: String
    },
    city: String,
    state: String,
    country: String,
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
},
    {
        timestamps: true
    }
);

//before saving the user crypt the password if it is modified
UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) { return next(); }
    bcrypt.genSalt(10, function (err, salt) {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

//compare method for user schema to compare password
UserSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) { return cb(err); }
        cb(null, isMatch);
    });
};

//getAuthenticated for user schema to authenticate and tokenize the user
UserSchema.statics.getAuthenticated = function (user, cb) {
    this.findOne({ email: user.email }, function (err, doc) {
        if (err) {
            return cb(err, null);
        } else if (!doc) {
            return cb({ message: "Invalid username or password." }, null);
        } else {
            doc.comparePassword(user.password, function (err, match) {
                if (err) { return cb(err); }
                if (match) {
                    var token = jwt.sign({ "email": doc.email, "_id": doc._id }, config.secret, { expiresIn: 10080 });
                    return cb(null, { token: 'JWT ' + token });
                } else {
                    return cb({ message: "Invalid username or password." }, null);
                }
            });
        }
    });
};

//make User object equal to UserSchema
var User = mongoose.model('User', UserSchema);
//export User
module.exports = User;