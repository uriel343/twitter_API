"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var tweetSchema = Schema({
  tweets: [
    {
      contentOfTweet: String,
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ],
});

module.exports = mongoose.model("tweet", tweetSchema);
