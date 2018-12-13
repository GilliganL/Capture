'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

const { app } = require('../server');


chai.use(chaiHttp);

//Test Static Assets
describe('Static assets', function () {
    it('GET to / should return status 200 and html', function () {
        return chai.request(app)
            .get('/')
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            });
    });

    it('GET to /feed should return status 200 and html', function () {
        return chai.request(app)
            .get('/feed')
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            });
    });

    it('GET to /people should return status 200 and html', function () {
        return chai.request(app)
            .get('/people')
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            });
    });
});







