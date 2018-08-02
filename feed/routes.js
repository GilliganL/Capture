const express = require('express');
const router = express.Router();


const { FeedPost } = require('./models');


router.get('/', (req, res) => {
    console.log('reached get');
    FeedPost
        .find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            console.error(error);
        })
});

router.post('/', (req, res) => {
    FeedPost
    //data
        .create(req.body)
        .then(post => res.status(201).json(post))
        .catch(error => {
            console.error(error);
        })
});

router.put('/:id', (req, res) => {

});

router.delete('/:id', (req, res) => {

});

module.exports = router;
