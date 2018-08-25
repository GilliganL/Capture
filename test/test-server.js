const chai = require('chai');
const chaiHttp = require('chai-http');

const {app} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('test server.js', function() {
    it('get to / should return status 200 and html', function() {
        return chai.request(app)
            .get('/')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            });
    });

    it('get to /feed should return status 200 and html', function() {
        return chai.request(app)
        .get('/feed')
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.html;
        });
    });

    it('get to /connections should return status 200 and html', function() {
        return chai.request(app)
        .get('/connections')
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.html;
        });
    });
});




