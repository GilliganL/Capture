'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const expect = chai.expect;

const { app, runServer, closeServer } = require('../server');
const { FeedPost } = require('../feed/models');
const { User } = require('../users/models');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../config');

chai.use(chaiHttp);

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

//setup test User database
function SeedUserData() {
    console.info('seeding User data');
    const seedData = [];

    for (let i = 0; i <= 10; i++) {
        seedData.push(generateUserData());
    }
    return User.insertMany(seedData);
}

function generateUserData() {
    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        username: faker.name.lastName(),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        email: faker.internet.email(),
        password: faker.internet.password()
    };
}

//setup test FeedPost database
function seedFeedPostData() {
    console.info('seeding FeedPost data');
    const seedData = [];
    for (let i = 0; i <= 10; i++) {
        seedData.push(generateFeedPostData());
    }
    return FeedPost.insertMany(seedData);
}

function generateFeedPostData() {
    return {
        user: userId,
        image: '/images/preview-avatar.png',
        caption: faker.lorem.sentences(),
        created: faker.date.past()
    };
};

const username = 'exampleUser';
const password = 'examplePass';
const firstName = 'Example';
const lastName = 'User';
const email = 'test@test.com';
const state = 'CO';
const city = 'Denver';
let userId;

let token;

describe('Feed Post API resource', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        return SeedUserData()
            .then(() => {
                return User.hashPassword(password)
            })
            .then(password => {
                return User.create({
                    username,
                    password,
                    firstName,
                    lastName,
                    email,
                    city,
                    state
                })
            })
            .then((user) => {
                userId = user._id;
                token = jwt.sign({
                    user: {
                        username,
                        firstName,
                        lastName,
                        id: user._id
                    }
                },
                    JWT_SECRET,
                    {
                        algorithm: 'HS256',
                        subject: username,
                        expiresIn: '7d'
                    })
            })
            .then(() => {
                return seedFeedPostData()
            })
    });

    afterEach(function () {
        return tearDownDb()
    });


    after(function () {
        return closeServer()
    });

    describe('GET endpoint', function () {
        it('should return all existing feed posts', function () {
            let res;
            return chai.request(app)
                .get('/api/feed')
                .set('authorization', `Bearer ${token}`)
                .then(function (_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.lengthOf.at.least(1);
                    return FeedPost.count();
                })
                .then(function (count) {
                    expect(res.body).to.have.lengthOf(count);
                });
        });

    });

    it('should return posts with the correct fields', function () {
        let resPost;
        return chai.request(app)
            .get('/api/feed')
            .set('authorization', `Bearer ${token}`)
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.lengthOf.at.least(1);

                res.body.forEach(function (post) {
                    expect(post).to.be.a('object');
                    expect(post).to.include.keys(
                        'id', 'user', 'userId', 'image', 'caption', 'created');
                });
                resPost = res.body[0];
                return FeedPost.findById(resPost.id).populate('user');
            })
            .then(function (post) {
                post = post.serialize();
                expect(resPost.id).to.equal(post.id.toString());
                expect(resPost.user).to.equal(post.user);
                expect(resPost.userId).to.equal(post.userId.toString());
                expect(resPost.image).to.equal(post.image);
                expect(resPost.caption).to.equal(post.caption);
            });
    });

    it('should return posts with matching ids', function () {
        let resPost;
        return chai.request(app)
            .get(`/api/feed/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .then(function (res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                resPost = res.body[0];
                return FeedPost.findById(resPost.id).populate('user');
            })
            .then(function (post) {
                post = post.serialize();
                expect(resPost.id).to.equal(post.id.toString());
                expect(resPost.user).to.equal(post.user);
                expect(resPost.userId).to.equal(post.userId.toString());
                expect(resPost.image).to.equal(post.image);
                expect(resPost.caption).to.equal(post.caption);
            });

    });

    describe('POST endpoint', function () {
        it('should add a new post', function () {

            let newPost = generateFeedPostData()
            newPost.created = Date.now();
            return chai.request(app)
                .post('/api/feed')
                .set('Authorization', `Bearer ${token}`)
                .send(newPost)
                .then(function (res) {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.include.keys(
                        'id', 'user', 'userId', 'caption', 'created');
                    expect(res.body.userId).to.equal(newPost.user.toString());
                    expect(res.body.caption).to.equal(newPost.caption);
                    expect(res.body.image).to.equal(newPost.image);
                    newPost = res.body;
                    return FeedPost.findById(res.body.id).populate('user');
                })
                .then(function (post) {
                    post = post.serialize();
                    expect(post.id.toString()).to.equal(newPost.id);
                    expect(post.user).to.equal(newPost.user);
                    expect(post.userId.toString()).to.equal(newPost.userId.toString());
                    expect(post.caption).to.equal(newPost.caption);
                    expect(post.image).to.equal(newPost.image);
                });
        });
    });

    describe('PUT endpoint', function () {
        it('should update feed post fields sent over', function () {
            let updateData = {
                caption: 'A test caption'
            };

            return FeedPost
                .findOne()
                .then(function (post) {
                    updateData.id = post.id;
                    return chai.request(app)
                        .put(`/api/feed/${updateData.id}`)
                        .set('authorization', `Bearer ${token}`)
                        .send(updateData);
                })
                .then(function (res) {
                    expect(res).to.have.status(201);
                    updateData = res.body;
                    return FeedPost.findById(updateData.id).populate('user');
                })
                .then(function (post) {
                    post = post.serialize();
                    expect(updateData.id).to.equal(post.id.toString());
                    expect(updateData.user).to.equal(post.user);
                    expect(updateData.caption).to.equal(post.caption);
                    expect(updateData.image).to.equal(post.image);
                });
        });
    });


    describe('DELETE endpoint', function () {
        it('should delete a post by id', function () {
            let delPost
            return FeedPost
                .findOne()
                .then(function(post) {
                    delPost = post
                    return chai.request(app)
                    .delete(`/api/feed/${delPost.id}`)
                    .set('authorization', `Bearer ${token}`)
                })
                .then(function (res) {
                    expect(res).to.have.status(204);
                    expect(res.body).to.be.a('object');
                    return FeedPost.findById(userId);
                })
                .then(function (res) {
                    expect(res).to.be.null;
                });
        });
    });


    describe('S3 endpoint', function() {
        it('should return an image URL', function() {
            let s3Data = {
                fileName: 'test.png',
                fileType: 'image/png'
            }

            return chai.request(app)
                .get(`/api/feed/sign-s3?file-name=${s3Data.fileName}&file-type=${s3Data.fileType}`)
                .set('Authorization', `Bearer ${token}`)
                .then(function(res) {
                   let response = JSON.parse(res.text);
                    expect(res).to.have.status(200);
                    expect(response).to.be.a('object');
                    expect(response).to.include.keys(
                        'signedRequest', 'url');
                })
                .done()
        });
    });
});



