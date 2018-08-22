//users routes

const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');
const validator = require('validator');

const { User } = require('./models');

const { S3_BUCKET } = require('../config');

aws.config.region='us-east-1';

router.get('/sign-s3', (req, res) => {
    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: `profile-images/${fileName}`,
        Expires: 600,
        ACL: 'public-read',
        ContentType: fileType
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if(err) {
            console.log(err);
            return res.end();
        }
        const returnData = {
            signedRequest: data,
            url: `https://${S3_BUCKET}.s3.amazonaws.com/feed-post-images/${fileName}`
        };
        res.write(JSON.stringify(returnData));
        res.end();
    });
});

//search users with query from URL - Separate GET route? or use query object here with if statement
//Use get endpoint, $search { $search: req.query.name }
// { name: `*${req.query.name}*` }
// {
//     name: {
//       $regex: `${req.query.name}`,
//       $options: 'i'
//     }
//   } 
// $or: [
//     {
//       name: {
//         $regex: `${req.query.name}`,
//         $options: 'i'
//       }
//     },     {
//       name: {
//         $regex: `${req.query.name}`,
//         $options: 'i'
//       }
//     }, ] 

router.get('/', (req, res) => {
    User
        .find()
        .then(users => {
            res.status(200).json(users.map(user => user.serialize()));
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'something went wrong: get users'});
        });
});

router.get('/:id', (req, res) => {
    User
        .findById(req.params.id)
        //add error if user doesn't exist, or use line 23? Add if statement
        //use this only for editting own profile, remove serialize from here & test?
        .then(user => res.status(201).json(user))
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'something went wrong: get by ID'});
        });
});

router.post('/', (req, res) => {
    const requiredFields = ['firstName', 'lastName', 'userName', 'city', 'state', 'email'];
    for(let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if(!(field in req.body)) {
            const message = `Missing \'${field} \' in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    };

    if(!(validator.isEmail(req.body.email))) {
        const message = `Please enter a valid email address`;
        console.error(message);
        return res.status(400).send(message);
    };

    if(!(validator.isAlphanumeric(req.body.userName)) || !(validator.isAlphanumeric(req.body.firstName)) 
        || !(validator.isAlphanumeric(req.body.lastName))) {
            const message = 'Please use letters and numbers only for first, last, and user names';
            console.error(message);
            return res.status(400).send(message);
        }

    if(!(validator.isAlpha(req.body.state))) {
        const message = 'Please enter a valid city';
        console.error(message);
        return res.status(400).send(message);
    }

    //validate state abbreviation

    User
        .findOne({userName: req.body.userName})
        .then(user => {
            if (user) {
                const message = 'Username not available';
                console.error(message);
                return res.status(400).send(message);
            } else {
                User
                    .create({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        userName: req.body.userName,
                        city: req.body.city,
                        state: req.body.state,
                        email: req.body.email
                    })
                    .then(user => res.status(201).json(user.serialize()))
                    .catch(err => {
                        console.error(err);
                        res.status(500).json({error: 'Something went wrong: post create user'});
                    });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'something went wrong: post user'})
        });
});

router.put('/:id', (req, res) => {
    if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.status(400).json({
            error: 'Request path ID and request body ID must match'
        });
    }

    const updated = {};
    const updateableFields = ['firstName', 'lastName', 'city', 'state', 'email'];
    updateableFields.forEach(field => {
    //add check if value is empty
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });
 
    User   
        .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
        .then(updatedUser => res.status(201).json(updatedUser))
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Please enter an existing user ID'});
        });
});

router.delete('/:id', (req, res) => {
    User
        .findByIdAndRemove(req.params.id)
        //add error if user ID doesn't exist or use line 114? add if statement
        .then(() => {
            res.status(200).json({message: 'success'})
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'something went wrong: delete user'});
        });
});

module.exports = router;
