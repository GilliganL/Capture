//users routes

const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');
const validator = require('validator');
const passport = require('passport');

const { User, passwordSchema } = require('./models');

aws.config.region = 'us-east-1';

const jwtAuth = passport.authenticate('jwt', { session: false });

router.post('/', (req, res) => {
    const requiredFields = ['firstName', 'lastName', 'username', 'city', 'state', 'email', 'password'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \'${field} \' in request body`;
            console.error(message);
            return res.status(400).json({error: message});
        }
    };

    if (!(validator.isAlpha(req.body.firstName)) || !(validator.isAlpha(req.body.lastName)) || !(validator.isAlpha(req.body.city)) || !(validator.isAlpha(req.body.state))) {
        const message = `First name, last name, city and state can only contain letters`;
        console.error(message);
        return res.status(400).json({error: message});
    };

    if (!(validator.isEmail(req.body.email))) {
        const message = `Please enter a valid email address`;
        console.error(message);
        return res.status(400).json({error: message});
    };

    if (!(validator.isAlphanumeric(req.body.username)) || (req.body.username.trim() !== req.body.username)) {
        const message = 'Please use letters and numbers only in username';
        console.error(message);
        return res.status(400).json({error: message});
    }

    if (!(passwordSchema.validate(req.body.password))) {
        const failed = passwordSchema.validate(req.body.password, { list: true });
        let message = 'Password must contain at least 8 characters including 1 uppercase letter and 1 number';
        console.error(message);
        return res.status(400).json({error: message});
    }

    User
        .findOne({ username: req.body.username })
        .then(user => {
            if (user) {
                const message = 'username not available';
                console.error(message);
                return res.status(400).json({error: message});
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

router.get('/', (req, res) => {
    User
        .find({ _id: { $ne: req.user.id } })
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
        .findById(req.user.id)
        .then(user => res.status(201).json(user.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went wrong: get by ID' });
        });
});

router.put('/:id', (req, res) => {
    const updated = {};
    const updateFields = ['firstName', 'lastName', 'city', 'state', 'image', 'email'];
    updateFields.forEach(field => {
        if (req.body[field]) {
            updated[field] = req.body[field];
        }
    })

    if(updated.firstName) {
        if (!(validator.isAlpha(updated.firstName))) {
            const message = `First name can only contain letters`;
            console.error(message);
            return res.status(400).json({error: message});
        };
    }

    if(updated.lastName) {
        if (!(validator.isAlpha(updated.lastName))) {
            const message = `last name can only contain letters`;
            console.error(message);
            return res.status(400).json({error: message});
        };
    }

    if(updated.city) {
        if (!(validator.isAlpha(updated.city))) {
            const message = `City can only contain letters`;
            console.error(message);
            return res.status(400).json({error: message});
        };
    }

    if(updated.state) {
        if (!(validator.isAlpha(updated.state))) {
            const message = `State can only contain letters`;
            console.error(message);
            return res.status(400).json({error: message});
        };
    }

    if (updated.email) {
        if (!(validator.isEmail(updated.email))) {
            const message = `Please enter a valid email address`;
            console.error(message);
            return res.status(400).json({error: message});
        } else {
            updated.email = req.body.email;
        };
    }

    User
        .findByIdAndUpdate(req.user.id, { $set: updated }, { new: true })
        .then(updatedUser => res.status(201).json(updatedUser))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Please enter an existing user ID' });
        });
});

router.delete('/:id', (req, res) => {
    User
        .findByIdAndRemove(req.user.id)
        .then(() => {
            res.status(200).json({ message: 'success' })
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went wrong: delete user' });
        });
});

module.exports = router;
