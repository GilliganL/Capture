'use strict';

// const uuid = require('uuid');

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
    email: {type: String, required: true}
    //add profile picture
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
        name: this.fullName,
        userName: this.userName,
        location: this.location
    };
};

const User = mongoose.model('User', userSchema);


module.exports = { User };
