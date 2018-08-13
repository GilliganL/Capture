//feed routes

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const validator = require('validator');

const { User } = require('../users/models');
const { FeedPost } = require('./models');

//how do you set up pagination?
//if someone updates a post (PUT) does GET need to be called again?
router.get('/', (req, res) => {
    FeedPost
        .find()
        .populate('user')
        .then(posts => {
            res.status(200).json(posts.map(post => post.serialize()));
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({error: 'something went wrong'});
        });
});

//get posts by User id
router.get('/:id', (req, res) => {
    User
        .findById(req.params.id)
        .then(user => {
            if(user) {
                FeedPost
                //how to get this to work with pre function in models?
                    .find({user : req.params.id})
                    .populate('user')
                    .then(posts => {
                        res.status(201).json(posts.map(post => post.serialize()));
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).json({error: 'Something went wrong get Posts by ID'});
                    });
            } else {
                const message = 'User not found';
                console.error(message);
                return res.status(400).send(message);
            };
        })
        .catch(err => {
            console.error(err);
            res.status(400).json({error: 'Something went wrong: GET posts by user ID'});
        });
});

router.post('/', (req, res) => {
    //user is person logged in
    const requiredFields = ['user', 'image'];
    for(let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if(!(field in req.body)) {
            const message = `Missing \'${field}\' in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    };

    //validate file uploaded

    User
        .findById(req.body.user._id)
        .then(user => {
            if(user) {
                FeedPost   
                    .findOneAndUpdate({_id: new mongoose.Types.ObjectId()}, {
                        user: req.body.user,
                        image: req.body.image,
                        caption: req.body.caption
                    }, {upsert: true, new: true})
                    .populate('user')
                    .then(feedPost => res.status(201).json(feedPost.serialize()))
                    .catch(err => {
                        console.error(err);
                        res.status(500).json({ error: 'Something went wrong: POST FeedPost'});
                    });
            } else {
                const message = 'User not found';
                console.error(message);
                return res.status(400).send(message);
            }
        })
        .catch(err => {
            console.error(err);
            res.status(400).json({error: 'Something went wrong: POST User'});
        });
});

router.put('/:id', (req, res) => {
    if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.status(400).json({
            error: 'Request path ID and request body ID values must match'
        });
    };

    const updated = {};
    const updateableFields = ['caption'];
    updateableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        } else {
            res.status(400).json({error: `Cannot update \'${field}\'`});
        };
    });

    FeedPost
        .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
        .populate('user')
        .then(updatedPost => res.status(201).json(updatedPost.serialize()))
        .catch(err => {
            console.error(err);
            res.status(400).json({message: 'Something went wrong: PUT FeedPost'});
        });
});

router.delete('/:id', (req, res) => {
    FeedPost
        .findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).json({ message: 'success'})
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went wrong: DELETE FeedPost'})
        });
});

module.exports = router;
