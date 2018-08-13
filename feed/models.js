'use strict';

// const uuid = require('uuid');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//import User model?

const feedPostSchema = mongoose.Schema({
    //do you have to use ID to reference user or can username be used?
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    image: {type: String, required: true},
    caption: {type: String},
    created: {type: Date, default: Date.now}
});

feedPostSchema.virtual('fullName').get(function() {
    return `${this.user.firstName} ${this.user.lastName}`.trim();
});

feedPostSchema.virtual('location').get(function() {
    return `${this.user.city}, ${this.user.state}`.trim();
});

feedPostSchema.methods.serialize = function() {
    return {
        id: this._id,
        user: this.fullName,
        image: this.image,
        caption: this.caption,
        created: this.created
    };
};

// feedPostSchema.pre('find', function(next) {
//     this.populate('user');
//     next();
// });

feedPostSchema.pre('findById', function(next) {
    this.populate('user');
    next();
});

const FeedPost = mongoose.model('FeedPost', feedPostSchema);

module.exports = { FeedPost };
