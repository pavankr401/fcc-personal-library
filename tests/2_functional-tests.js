/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {
    let bookid;


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({title: 'kafka on the shore'})
        .end((req, res) => {
          assert.equal(200, res.status);
          assert.equal("application/json", res.type);
          assert.equal('kafka on the shore', res.body.title);

          bookid = res.body._id;
          done();
          
        })  
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .end((req, res) => {
          assert.equal(200, res.status);
          assert.equal("text/html", res.type);
          assert.equal("missing required field title", res.text);

          done();
        })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end((req, res) => {
          assert.equal(200, res.status);
          assert.equal("application/json", res.type);
          assert.notEqual(0, res.body.length);

          done();
        })
        
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/639af763ed636a29090981d5')
        .end((req, res) => {
          assert.equal(200, res.status);
          assert.equal("text/html", res.type);
          assert.equal("no book exists", res.text);

          done();
        })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get(`/api/books/${bookid}`)
        .end((req, res) => {
          assert.equal(200, res.status);
          assert.equal("application/json", res.type);
          assert.equal("kafka on the shore", res.body.title);

          done();
        })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post(`/api/books/${bookid}`)
        .send({ comment: "good to imagination"})
        .end((req, res) => {
          assert.equal(200, res.status);
          assert.equal("application/json", res.type);
          assert.notEqual(0, res.body.commentcount);

          done();
        })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
        .post(`/api/books/${bookid}`)
        .end((req, res) => {
          assert.equal(200, res.status);
          assert.equal("text/html", res.type);
          assert.equal("missing required field comment", res.text);

          done();
        })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
        .post(`/api/books/639af763ed636a29090981d5`)
        .send({ comment: "good to imagination"})
        .end((req, res) => {
          assert.equal(200, res.status);
          assert.equal("text/html", res.type);
          assert.equal("no book exists", res.text);

          done();
        })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
        .delete(`/api/books/${bookid}`)
        .end((req, res) => {
          assert.equal(200, res.status);
          assert.equal("delete successful", res.text);

          done();
        })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
        .delete(`/api/books/639af763ed636a29090981d5`)
        .end((req, res) => {
          assert.equal(200, res.status);
          assert.equal("no book exists", res.text);

          done()
        })
      });

    });

  });

});
