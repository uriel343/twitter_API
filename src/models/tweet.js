"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var tweetSchema = Schema({
  myTweet: String ,
  numRetweets: Number,
  numLikes: Number,
  numComments: Number,
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
  retweet: [
    {
      tweetId: String,
      contentOfTweet: String
    }
  ],
  
});

module.exports = mongoose.model("tweets", tweetSchema);
