'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
    firstName: { type: String, required: true, index: true },
    lastName: { type: String, required: true, index: true },
    userName: {
        type: String,
        lowercase: true,
        trim: true,
        minLength: 2,
        unique: true,
        required: true
    },
    city: {type: String, required: true, index: true},
    state: {type: String, required: true, maxLength: 2, index: true},
    email: {type: String, required: true},
    image: {type: String, required: true, default: './images/preview-avatar.png'}
});

userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`.trim();
});

userSchema.virtual('location').get(function() {
    return `${this.city}, ${this.state}`.trim();
});

userSchema.methods.serialize = function() {
    return {
        id: this._id,
        fullName: this.fullName,
        userName: this.userName,
        location: this.location
    };
};

const User = mongoose.model('User', userSchema);


module.exports = { User };
