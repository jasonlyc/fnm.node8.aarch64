var needle  = require('../'),
    sinon   = require('sinon'),
    should  = require('should'),
    http    = require('http'),
    helpers = require('./helpers');

describe('urls', function() {

  var server, url;

  function send_request(cb) {
    return needle.get(url, cb);
  }

  before(function(done){
    server = helpers.server({ port: 3333 }, done);
  })

  after(function(done) {
    server.close(done);
  })

  describe('null URL', function(){

    it('throws', function(){
      (function() {
      send_request()
      }).should.throw();
    })

  })


  describe('invalid protocol', function(){

    before(function() {
      url = 'foo://google.com/what'
    })

    it('fails', function(done) {
      send_request(function(err){
        err.should.be.an.Error;
        err.code.should.eql('ENOTFOUND');
        done();
      })
    })

  })

  describe('invalid host', function(){

    before(function() {
      url = 'http://s1\\\2.com/'
    })

    it('fails', function(done) {
      send_request(function(err){
        err.should.be.an.Error;
        err.code.should.eql('ENOTFOUND');
        done();
      })
    })

  })

/*
  describe('invalid path', function(){

    before(function() {
      url = 'http://www.google.com\\\/x\\\   %^&*() /x2.com/'
    })

    it('fails', function(done) {
      send_request(function(err) {
        err.should.be.an.Error;
        done();
      })
    })

  })
*/

  describe('valid protocol and path', function() {

    before(function() {
      url = 'http://localhost:3333/foo';
    })

    it('works', function(done) {
      send_request(function(err){
        should.not.exist(err);
        done();
      })
    })

  })

  describe('no protocol but with slashes and valid path', function() {

    before(function() {
      url = '//localhost:3333/foo';
    })

    it('works', function(done) {
      send_request(function(err){
        should.not.exist(err);
        done();
      })
    })

  })

  describe('no protocol nor slashes and valid path', function() {

    before(function() {
      url = 'localhost:3333/foo';
    })

    it('works', function(done) {
      send_request(function(err){
        should.not.exist(err);
        done();
      })
    })

  })

  describe('double encoding', function() {

    var path = '/foo?email=' + encodeURIComponent('what-ever@Example.Com');

    before(function() {
      url = 'localhost:3333' + path
    });

    it('should not occur', function(done) {
      send_request(function(err, res) {
        should.not.exist(err);
        should(res.req.path).be.exactly(path);
        done();
      });

    });

  })

})
