'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const feedPostSchema = mongoose.Schema({
    //thinking of when you try to get more info on client side
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

feedPostSchema.pre('findById', function(next) {
    this.populate('user');
    next();
});

const FeedPost = mongoose.model('FeedPost', feedPostSchema);

module.exports = { FeedPost };
