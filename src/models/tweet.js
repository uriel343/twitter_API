"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var tweetSchema = Schema({
  myTweet: String ,
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  likes: [
    {user: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }}
  ],
  comments: [
    {user:{ type: Schema.Types.ObjectId, ref: 'user'},
    comment: String
    }
  ],
  numRetweets: Number,
  numLikes: Number,
  numComments: Number,
  retweet: [
    {
      tweetId: String,
      contentOfTweet: String,
      userOfTweet: String
    }
  ]
  
});

module.exports = mongoose.model("tweets", tweetSchema);
