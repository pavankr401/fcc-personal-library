/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const { response } = require("express");
const { ObjectId } = require("mongodb");

module.exports = function (app, myDatabase) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      let books = await myDatabase.find({}).toArray();
      res.send(books);

    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(title == "" || title == undefined) return res.send("missing required field title");

      myDatabase.findOne({title: title}, (err, user) => {
        if(user) return res.send({title: title, _id: user._id});

        myDatabase.insertOne({title: title, comments: [], commentcount: 0}, (err, user) => {
          res.json({title: title, _id: user.insertedId});
        })
      })
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      myDatabase.deleteMany({}, (err, user) => {
        if(user.deletedCount != 0) res.send("complete delete successful");
        else res.send("no books to delete");
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      myDatabase.findOne({_id: new ObjectId(bookid)}, (err, doc) => {
        if(doc != null) return res.send(doc);
        else res.send("no book exists");
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if(!comment) return res.send("missing required field comment");

      let filter = {_id: new ObjectId(bookid)};
      let updateDoc = {
        $push: { comments : comment},
        $inc: {commentcount: 1}
      };
      let options = { returnDocument: 'after' };
      
      myDatabase.findOneAndUpdate(filter, updateDoc, options, (err, book) => {
        if(!book.value) res.send("no book exists");
        else res.json({title: book.value.title,
                       comments: book.value.comments,
                       commentcount: book.value.commentcount,
                      _id: bookid});
        
      });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'

      myDatabase.deleteOne({_id: new ObjectId(bookid)}, (err, book) => {
        if(book.deletedCount != 0) res.send("delete successful");
        else res.send("no book exists");
      })
    });
  
};
