//feed routes
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const aws = require('aws-sdk');

const { User } = require('../users/models');
const { FeedPost } = require('./models');

const { S3_BUCKET } = require('../config');

aws.config.region = 'us-east-1';

router.get('/sign-s3', (req, res) => {
    const s3 = new aws.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: `feed-post-images/${fileName}`,
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
    FeedPost
        .find()
        .sort({ created: -1 })
        .populate('user')
        .then(posts => {
            res.status(200).json(posts.map(post => post.serialize()));
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong' });
        });
});

router.get('/:id', (req, res) => {
    User
        .findById(req.params.id)
        .then(user => {
            if (user) {
                FeedPost
                    .find({ user: req.params.id })
                    .populate('user')
                    .then(posts => {
                        res.status(201).json(posts.map(post => post.serialize()));
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).json({ error: 'Something went wrong' });
                    });
            } else {
                const message = 'User not found';
                console.error(message);
                return res.status(400).json({error: message});
            };
        })
        .catch(err => {
            console.error(err);
            res.status(400).json({ error: 'Something went wrong' });
        });
});

router.post('/', (req, res) => {
    const requiredFields = ['image'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body) || !(req.body[field])) {
            const message = `Please upload an ${field}`;
            console.error(message);
            return res.status(400).json({error: message});
        }
    };

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    FeedPost
        .findOne({
            user: req.user.id,
            created: { $gte: startOfToday }
        })
        .then(post => {
            if (post) {
                res.status(400).json({ error: 'Already posted today' });
                return
            }
            return FeedPost
                .findOneAndUpdate({ _id: new mongoose.Types.ObjectId() }, {
                    user: req.user.id,
                    image: req.body.image,
                    caption: req.body.caption,
                    created: Date.now()
                }, { upsert: true, new: true })
                .populate('user')
        })
        .then(feedPost => {
            if (feedPost) {
                res.status(201).json(feedPost.serialize())
            }
        })
        .catch(err => {
            console.error(err);
            res.status(400).json({ error: 'Something went wrong' });
        });
});

router.put('/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
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
            res.status(400).json({ error: `Cannot update \'${field}\'` });
        };
    });

    FeedPost
        .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
        .populate('user')
        .then(updatedPost => res.status(201).json(updatedPost.serialize()))
        .catch(err => {
            console.error(err);
            res.status(400).json({ error: 'Something went wrong' });
        });
});

router.delete('/:id', (req, res) => {
    FeedPost
        .findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).json({ message: 'success' })
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went wrong' })
        });
});

module.exports = router;
