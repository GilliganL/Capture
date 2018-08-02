'use strict';

// const uuid = require('uuid');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;




const feedPostSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    image: 'string',
    caption: 'string',
    created: {type: Date, default: Date.now}

})




const FeedPost = mongoose.model('FeedPost', feedPostSchema);

module.exports = { FeedPost };
