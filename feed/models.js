'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const feedPostSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    image: {type: String},
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
        userId: this.user._id,
        image: this.image,
        caption: this.caption,
        created: this.created
    };
};

feedPostSchema.pre('findById', function(next) {
    this.populate('user');
    next();
});

feedPostSchema.pre('')

const FeedPost = mongoose.model('FeedPost', feedPostSchema);

module.exports = { FeedPost };
