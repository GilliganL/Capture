'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const expect = chai.expect;

const { app, runServer, closeServer } = require('../server');
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
        password: 'Password123!'
    };
}

const username = 'exampleUser';
const password = 'examplePass';
const firstName = 'Example';
const lastName = 'User';
const email = 'test@test.com';
const state = 'CO';
const city = 'Denver';
let userId;

let token; 

describe('User API resource', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        return SeedUserData()
        .then(() => User.hashPassword(password))
        .then(password =>
            User.create({
                username,
                password,
                firstName,
                lastName,
                email,
                city,
                state
        
            })
        )
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
        });
    });

    afterEach(function () {
        return tearDownDb()
    });


    after(function () {
        return closeServer();
    });

    describe('GET endpoint', function () {
        it('should return all existing users', function () {
            let res;
            return chai.request(app)
                .get('/api/users')
                .set('authorization', `Bearer ${token}`)
                .then(function (_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.lengthOf.at.least(1);
                    return User.count();
                })
                .then(function (count) {
                    expect(res.body).to.have.lengthOf(count-1);
                });
        });

        it('should return users with the correct fields', function () {
            let resUser;
            return chai.request(app)
                .get('/api/users')
                .set('authorization', `Bearer ${token}`)
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('array');
                    expect(res.body).to.have.lengthOf.at.least(1);

                    res.body.forEach(function (user) {
                        expect(user).to.be.a('object');
                        expect(user).to.include.keys(
                            'id', 'fullName', 'username', 'location');
                    });
                    resUser = res.body[0];
                    return User.findById(resUser.id);
                })
                .then(function (user) {
                    user = user.serialize();
                    expect(resUser.id).to.equal(user.id.toString());
                    expect(resUser.fullName).to.equal(user.fullName);
                    expect(resUser.username).to.equal(user.username);
                    expect(resUser.location).to.equal(user.location);
                });
        });

        it('should return user with matching id', function () {
            let resUser;
            return chai.request(app)
                .get(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .then(function (res) {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('object');
                    expect(res.body.id).to.equal(userId.toString());
                    resUser = res.body;
                    return User.findById(resUser.id);
                })
                .then(function (user) {
                    user = user.serialize();
                    expect(resUser.id).to.equal(user.id.toString());
                    expect(resUser.fullName).to.equal(user.fullName);
                    expect(resUser.location).to.equal(user.location);
                    expect(resUser.username).to.equal(user.username);
                });
    
            });
    });

    describe('POST endpoint', function () {
        it('should add a new user', function () {
            const newUser = generateUserData();
            return chai.request(app)
                .post('/api/users')
                .set('Authorization', `Bearer ${token}`)
                .send(newUser)
                .then(function (res) {
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
                .then(function (user) {
                
                    expect(user.firstName).to.equal(newUser.firstName);
                    expect(user.lastName).to.equal(newUser.lastName);
                    expect(user.username).to.equal(newUser.username.toLowerCase());
                    expect(user.city).to.equal(newUser.city);
                    expect(user.state).to.equal(newUser.state);
                    expect(user.email).to.equal(newUser.email);
                });
        });
    });

    describe('PUT endpoint', function () {
        it('should update fields sent over', function () {
                const updateData = {
                    firstName: 'Charlie',
                    lastName: 'Kelly',
                    city: 'Philadelphia',
                    state: 'PA',
                    email: 'charlie@paddyspub.com',
                    image: '/images/preview-avatar.png'
                };

                return chai.request(app)
                    .put(`/api/users/${userId}`)
                    .set('authorization', `Bearer ${token}`)
                    .send(updateData)
                    .then(function (res) {
                        expect(res).to.have.status(201);
                        return User.findById(userId);
                    })
                    .then(function (user) {
                        expect(updateData.firstName).to.equal(user.firstName);
                        expect(updateData.lastName).to.equal(user.lastName);
                        expect(updateData.city).to.equal(user.city);
                        expect(updateData.state).to.equal(user.state);
                        expect(updateData.email).to.equal(user.email);
                    });
            });
        });
   

    describe('DELETE endpoint', function () {
        it('should delete a user by id', function () {
            return chai.request(app)
                .delete(`/api/users/${userId}`)
                .set('authorization', `Bearer ${token}`)
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    return User.findById(userId);
                })
                .then(function (res) {
                    expect(res).to.be.null;
                });
        });
    });
});
