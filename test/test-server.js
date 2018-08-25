'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const { app, runServer, closeServer } = require('../server');
const { FeedPost } = require('../feed/models');
const { User } = require('../users/models');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

//setup test User database
function SeedUserData() {
    console.info('seeding User data');
    const seedData = [];

    for(let i=0; i<=10; i++){
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
        email: faker.internet.email()
    };
}

//setup test FeedPost database
function seedFeedPostData() {
    console.info('seeding FeedPost data');
    const seedData = [];

    for(let i=0; i<=10; i++){
        seedData.push(generateFeedPostData());
    }
    return FeedPost.insertMany(seedData);
}

function generateFeedPostData() {
    return {
        user: {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            username: faker.internet.username(),
            city: faker.address.city(),
            state: faker.address.stateAbbr(),
            email: faker.internet.email()
        },
        image: faker.image.image(),
        caption: faker.lorem.sentences(),
        created: faker.date.recent()
    };
}

//Test Static Assets
describe('Static assets', function() {
    it('GET to / should return status 200 and html', function() {
        return chai.request(app)
            .get('/')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            });
    });

    it('GET to /feed should return status 200 and html', function() {
        return chai.request(app)
        .get('/feed')
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.html;
        });
    });

    it('GET to /people should return status 200 and html', function() {
        return chai.request(app)
        .get('/people')
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.html;
        });
    });
});

//Test User API
describe('User API resource', function() {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        return SeedUserData();
    });

    afterEach(function() {
        return tearDownDb();
    });

    after(function() {
        return closeServer();
    });

    describe('GET endpoint', function() {
        it('should return all existing users', function() {
            let res;
            return chai.request(app)
                .get('/api/users')
                .then(function(_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.lengthOf.at.least(1);
                    return User.count();
                })
                .then(function(count) {
                    expect(res.body).to.have.lengthOf(count);
                });
        });

        it('should return users with the correct fields', function() {
            let resUser;
            return chai.request(app)
                .get('/api/users')
                .then(function(res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('array');
                    expect(res.body).to.have.lengthOf.at.least(1);

                    res.body.forEach(function(user) {
                        expect(user).to.be.a('object');
                        expect(user).to.include.keys(
                            'id', 'fullName', 'username', 'location');
                    });
                    resUser = res.body[0];
                    return User.findById(resUser.id);
                })
                .then(function(user) {
                    user = user.serialize();
                    //why does it console as [object object]
                    console.log('user is ' + user);
                    console.log('resUser is ' + resUser);
                    expect(resUser.id).to.equal(user.id.toString());
                    expect(resUser.fullName).to.equal(user.fullName);
                    expect(resUser.username).to.equal(user.username);
                    expect(resUser.location).to.equal(user.location);
                });
        });

        it('should return user with matching id', function() {
            let idUser;
            let resUser;

            return User
                .findOne()
                .then(function(user) {
                    idUser = user.id;
                    return chai.request(app)
                        .get(`/api/users/${idUser}`)
                })
                .then(function(res) {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('object');
                    expect(res.body.id).to.equal(idUser);
                    resUser = res.body;

                    return User.findById(resUser.id);
                })
                .then(function(user) {
                    user = user.serialize();
                   
                    expect(resUser.id).to.equal(user.id.toString());
                    expect(resUser.fullName).to.equal(user.fullName);
                    expect(resUser.location).to.equal(user.location);
                    expect(resUser.username).to.equal(user.username);
                });
        });
    });

    describe('POST endpoint', function() {
        it('should add a new user', function() {
            const newUser = generateUserData();

            return chai.request(app)
                .post('/api/users')
                .send(newUser)
                .then(function(res) {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.include.keys(
                        'id', 'fullName', 'username', 'location');
                    expect(res.body.fullName).to.equal(`${newUser.firstName} ${newUser.lastName}`);
                    expect(res.body.username).to.equal(newUser.username.toLowerCase());
                    expect(res.body.location).to.equal(`${newUser.city}, ${newUser.state}`);
                    return User.findById(res.body.id);
                })
                .then(function(user) {
                    console.log(user);
                    expect(user.firstName).to.equal(newUser.firstName);
                    expect(user.lastName).to.equal(newUser.lastName);
                    expect(user.username).to.equal(newUser.username.toLowerCase());
                    expect(user.city).to.equal(newUser.city);
                    expect(user.state).to.equal(newUser.state);
                    expect(user.email).to.equal(newUser.email);
                });
        });
    });

    describe('PUT endpoint', function() {
        it('should update fields sent over', function() {
            it('should update fields sent over', function() {
                const updateData = {
                    firstName: 'Charlie',
                    lastName: 'Kelly',
                    city: 'Philadelphia',
                    state: 'PA',
                    email: 'charlie@paddyspub.com'
                };

                return User 
                    .findOne()
                    .then(function(user) {
                        updateData.id = user.id;
                        return chai.request(app)
                            .put(`/api/users/${user.id}`)
                            .send(updateData);
                    })
                    .then(function(res) {
                        expect(res).to.have.status(201);
                        return User.findById(updateData.id);
                    })
                    .then(function(user) {
                        expect(updateData.firstName).to.equal(user.firstName);
                        expect(updateData.lastName).to.equal(user.lastName);
                        expect(updateData.city).to.equal(user.city);
                        expect(updateData.state).to.equal(user.state);
                        expect(updateData.email).to.equal(user.email);
                    });
            });
        });
    });

    describe('DELETE endpoint', function() {
        it('should delete a post by id', function() {
            let delUser;

            return User
                .findOne()
                .then(function(user) {
                    delUser = user;
                    return chai.request(app)
                        .delete(`/api/users/${delUser.id}`);
                })
                .then(function(res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    return User.findById(delUser.id);
                })
                .then(function(res) {
                    expect(res).to.be.null;
                });
        });
    });
});






