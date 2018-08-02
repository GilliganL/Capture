'use strict';

// const uuid = require('uuid');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const userSchema = mongoose.Schema({
    firstName: 'string',
    lastName: 'string',
    userName: {
        type: 'string',
        unique: true
    },
    city: 'string'
    // state: ,
    // email: 
});




//virtual fullName, location

const User = mongoose.model('User', userSchema);


module.exports = { User };
