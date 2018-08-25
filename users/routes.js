//users routes

const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');
const validator = require('validator');
const passport = require('passport');

const { User } = require('./models');

const { S3_BUCKET } = require('../config');

aws.config.region = 'us-east-1';

const jwtAuth = passport.authenticate('jwt', { session: false });



router.post('/', (req, res) => {
    const requiredFields = ['firstName', 'lastName', 'username', 'city', 'state', 'email', 'password'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \'${field} \' in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    };

    if (!(validator.isEmail(req.body.email))) {
        const message = `Please enter a valid email address`;
        console.error(message);
        return res.status(400).send(message);
    };

    if (!(validator.isAlphanumeric(req.body.username))) {
        const message = 'Please use letters and numbers only in username';
        console.error(message);
        return res.status(400).send(message);
    }

    if (!(validator.isAlpha(req.body.state)) || !(validator.isAlpha(req.body.firstName))
    || !(validator.isAlpha(req.body.lastName)) || !(validator.isAlpha(req.body.city))) {
        const message = 'First name, last name, city and state must be letters only';
        console.error(message);
        return res.status(400).send(message);
    }

    //validate state abbreviation

    //validate password length & complexity

    User
        .findOne({ username: req.body.username })
        .then(user => {
            if (user) {
                const message = 'username not available';
                console.error(message);
                return res.status(400).send(message);
            }
            return User.hashPassword(req.body.password);
        })
        .then(hash => {
            return User
                .create({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    username: req.body.username,
                    city: req.body.city,
                    state: req.body.state,
                    email: req.body.email,
                    password: hash
                })
        })
        .then(user => res.status(201).json(user.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went wrong: post user' })
        });
});

router.use(jwtAuth);

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
        if (err) {
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

router.get('/', (req, res) => {

// exclude signed in user
    User
        .find()
        .then(users => {
            res.status(200).json(users.map(user => user.serialize()));
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went wrong: get users' });
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
            res.status(500).json({ error: 'something went wrong: get by ID' });
        });
});



router.put('/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.status(400).json({
            error: 'Request path ID and request body ID must match'
        });
    }

    const updated = {};
    const updateableFields = ['firstName', 'lastName', 'city', 'state', 'email'];
    updateableFields.forEach(field => {
    
        //check for empty key values
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });

    User
        .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
        .then(updatedUser => res.status(201).json(updatedUser))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Please enter an existing user ID' });
        });
});

router.delete('/:id', (req, res) => {
    User
        .findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(200).json({ message: 'success' })
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went wrong: delete user' });
        });
});

module.exports = router;


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
