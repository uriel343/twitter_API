"use strict";
const User = require("./userController");
const Tweet = require("./tweetController");
const Follow = require("./followController");

function generalOptions(req, res) {
  var parametr = req.body.command;
  parametr = parametr.toLowerCase();
  parametr = parametr.trim();
  parametr = parametr.split(" ");

  var evaluatingCommand =
    parametr[0] != null && parametr.length > 0 ? parametr[0] : "";

  switch (evaluatingCommand) {
    case "register":
        User.createAccount(req,res)
      break;
    case "login":
        User.login(req,res)
      break;
    case "profile":
        User.profile(req,res)
      break;
    case "add_tweet":
        Tweet.createTweet(req,res)
      break;
    case "view_tweets":
        Tweet.viewTweets(req,res)
      break;
    case "edit_tweet":
        Tweet.updateTweet(req,res)
      break;
    case "delete_tweet":
        Tweet.deleteTweet(req,res)
      break;
    case "follow":
        Follow.follow(req,res)
      break;
    case "unfollow":
      Follow.unfollow(req,res)
      break;
    default:
        return res.status(404).send({
            message: 'You have chosen an option that does not exist'
        })
  }
}

module.exports = {
    generalOptions
}
