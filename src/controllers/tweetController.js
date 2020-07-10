"use strict";
const Tweet = require("../models/tweet");

function createTweet(req,res) {
  var parametr = req.body.command;
  parametr = parametr.toLowerCase();
  parametr = parametr.trim();
  parametr = parametr.split(" ");
  parametr.shift()
  
  

  var myIdAccount = req.user.sub
  var tweeting = new Tweet()
  var contentOfTweet = parametr.join(" ").toString()

  if(contentOfTweet){
    tweeting.myTweet = contentOfTweet
    tweeting.user = myIdAccount

    tweeting.save((err, tweetSaved)=>{
      if(err) return res.status(500).send({
        message: "Server error, please try again",
      });

      if(!tweetSaved) return res.status(404).send({
        message: 'Tweet can not created'
      })

      return res.status(200).send({
        message: 'Success',
        yourTweet: tweetSaved
      })
    })

  }else{
    return res.status(400).send({
      message: "Missing data, make sure that you are sending all the data",
    });
  }
  
  
}

function viewTweets(req,res){
  var parametr = req.body.command;
  parametr = parametr.toLowerCase();
  parametr = parametr.trim();
  parametr = parametr.split(" ");
  var userAccount = parametr[1]
  var myIdAccount = req.user.sub

  if(userAccount){
    Tweet.find({user: userAccount},{_id: 0},(err, userTweets)=>{
      if(err) return res.status(500).send({
        message: "Server error, please try again",
      });
      if(!userTweets) return res.status(404).send({
        message: 'Tweets not found'
      })

      return res.status(200).send({
        message: 'Success',
        userTweets: userTweets
      })
    })
  }else{
    Tweet.findById(myIdAccount,{_id: 0},(err,myTweets)=>{
      if(err) return res.status(500).send({
        message: "Server error, please try again",
      });
      if(!myTweets) return res.status(404).send({
        message: 'Tweets not found'
      })

      return res.status(200).send({
        message: 'Success',
        yourTweets: myTweets
      })
    })
  }
}

function updateTweet(req,res) {
  var parametr = req.body.command;
  parametr = parametr.toLowerCase();
  parametr = parametr.trim();
  parametr = parametr.split(" ");
  var tweetId = parametr[1]
  var myIdAccount = req.user.sub

  if(!myIdAccount){
    return res.status(403).send({
      message: 'You cannot edit tweets that are not yours'
    })
  }
  if(tweetId){
    Tweet.findByIdAndUpdate(tweetId,{new: true}, (err,tweetEdited)=>{
      if(err) return res.status(500).send({
        message: "Server error, please try again",
      });
      if(!tweetEdited) return res.status(404).send({
        message: 'Tweet not found'
      })
      return res.status(200).send({
        message: 'Success',
        newTweet: tweetEdited
      })
    })
  }else{
    return res.status(400).send({
      message: "Missing data, make sure that you are sending all the data",
    });
  }
}

function deleteTweet(req,res) {
  var parametr = req.body.command;
  parametr = parametr.toLowerCase();
  parametr = parametr.trim();
  parametr = parametr.split(" ");
  var tweetId = parametr[1]
  var myIdAccount = req.user.sub

  if(!myIdAccount){
    return res.status(403).send({
      message: 'You cannot edit tweets that are not yours'
    })
  }

  if(tweetId){
    Tweet.findByIdAndDelete(tweetId, (err, tweetDeleted)=>{
      if(err) return res.status(500).send({
        message: "Server error, please try again",
      });
      if(!tweetDeleted) return res.status(404).send({
        message: 'Tweet not found'
      })
      
      return res.status(200).send({
        message: 'Success',
        tweetDeleted: tweetDeleted
      })
    })
  }else{
    return res.status(400).send({
      message: "Missing data, make sure that you are sending all the data",
    });
  }

}

module.exports = {
    createTweet,
    viewTweets,
    updateTweet,
    deleteTweet
}