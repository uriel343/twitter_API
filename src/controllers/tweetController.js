"use strict";
const Tweet = require("../models/tweet");
const User = require("../models/user");

function createTweet(req, res) {
  var parametr = req.body.command;
  parametr = parametr.toLowerCase();
  parametr = parametr.trim();
  parametr = parametr.split(" ");
  parametr.shift();

  var myIdAccount = req.user.sub;
  var tweeting = new Tweet();
  var contentOfTweet = parametr.join(" ").toString();

  if (contentOfTweet) {
    tweeting.myTweet = contentOfTweet;
    tweeting.user = myIdAccount;
    tweeting.numRetweets = 0;
    tweeting.numLikes = 0
    tweeting.numComments = 0

    tweeting.save((err, tweetSaved) => {
      if (err)
        return res.status(500).send({
          message: "Server error, please try again",
        });

      if (!tweetSaved)
        return res.status(404).send({
          message: "Tweet can not created",
        });

      return res.status(200).send({
        message: "Success",
        yourTweet: tweetSaved,
      });
    });
  } else {
    return res.status(400).send({
      message: "Missing data, make sure that you are sending all the data",
    });
  }
}
//mostrar contadores de retweets, likes, comments
function viewTweets(req, res) {
  var parametr = req.body.command;
  parametr = parametr.toLowerCase();
  parametr = parametr.trim();
  parametr = parametr.split(" ");
  var userAccount = parametr[1];
  var myIdAccount = req.user.sub;

  if (userAccount) {
    User.findOne({ user: userAccount }, (err, userFound) => {
      if (err)
        return res.status(500).send({
          message: "Server error, please try again",
        });
      if (!userFound)
        return res.status(404).send({
          message: "User not found",
        });
      var idUser = userFound._id;
      Tweet.find({ user: idUser },{likes: 0, comments: 0}, (err, userTweets) => {
        if (err)
          return res.status(500).send({
            message: "Server error, please try again",
          });
        if (!userTweets)
          return res.status(404).send({
            message: "Tweets not found",
          });

        return res.status(200).send({
          message: "Success",
          userTweets: userTweets,
        });
      });
    });
  } else {
    Tweet.find({ user: myIdAccount }, {likes: 0, comments: 0}, (err, myTweets) => {
      if (err)
        return res.status(500).send({
          message: "Server error, please try again",
        });
      if (!myTweets)
        return res.status(404).send({
          message: "Tweets not found",
        });

      return res.status(200).send({
        message: "Success",
        yourTweets: myTweets,
      });
    });
  }
}

function updateTweet(req, res) {
  var parametr = req.body.command;
  parametr = parametr.toLowerCase();
  parametr = parametr.trim();
  parametr = parametr.split(" ");
  parametr.shift();

  var tweetId = parametr[0];

  if (tweetId) {
    parametr.shift();
    var newContent = parametr.join(" ").toString();
    var myIdAccount = req.user.sub;

    Tweet.findOne({ _id: tweetId }, (err, tweetFound) => {
      if (err)
        return res
          .status(500)
          .send({ message: "Server error, please try again" });
      if (!tweetFound)
        return res.status(404).send({ message: "Tweet not found" });
      var auth = tweetFound.user;
      if (myIdAccount != auth) {
        return res
          .status(403)
          .send({
            message:
              "You don´t have permission to update tweets that aren't yours",
          });
      } else {
        Tweet.findByIdAndUpdate(
          tweetId,
          { myTweet: newContent },
          { new: true },
          (err, tweetEdited) => {
            if (err)
              return res.status(500).send({
                message: "Server error, please try again",
              });
            if (!tweetEdited)
              return res.status(404).send({
                message: "Tweet not found",
              });
            return res.status(200).send({
              message: "Success",
              newTweet: tweetEdited,
            });
          }
        );
      }
    });
  } else {
    return res.status(400).send({
      message: "Missing data, make sure that you are sending all the data",
    });
  }
}

function deleteTweet(req, res) {
  var parametr = req.body.command;
  parametr = parametr.toLowerCase();
  parametr = parametr.trim();
  parametr = parametr.split(" ");
  var tweetId = parametr[1];
  var myIdAccount = req.user.sub;

  if (tweetId) {
    Tweet.findOne({ _id: tweetId }, (err, tweetFound) => {
      if (err)
        return res
          .status(500)
          .send({ message: "Server error, please try again" });
      if (!tweetFound)
        return res.status(404).send({ message: "Tweet not found" });
      var auth = tweetFound.user;
      if (myIdAccount != auth) {
        return res
          .status(403)
          .send({
            message:
              "You don't have permission to delete tweets that aren't yours",
          });
      } else {
        Tweet.findByIdAndDelete(tweetId, (err, tweetDeleted) => {
          if (err)
            return res.status(500).send({
              message: "Server error, please try again",
            });
          if (!tweetDeleted)
            return res.status(404).send({
              message: "Tweet not found",
            });

          return res.status(200).send({
            message: "Success",
            tweetDeleted: tweetDeleted,
          });
        });
      }
    });
  } else {
    return res.status(400).send({
      message: "Missing data, make sure that you are sending all the data",
    });
  }
}

function likedTweet(req, res) {
  var parametr = req.body.command;
  parametr = parametr.toLowerCase();
  parametr = parametr.trim();
  parametr = parametr.split(" ");
  var tweetId = parametr[1];
  var myIdAccount = req.user.sub;

  if (tweetId) {
    Tweet.findOne(
      { $and: [{ _id: tweetId }, { "likes.user": myIdAccount }] },
      (err, likeExist) => {
        if (err)
          return res
            .status(500)
            .send({ message: "Server error, please try again" });
        if (likeExist) {
          Tweet.findByIdAndUpdate(
            tweetId,
            { $pull: { likes: { user: myIdAccount } } , $inc:{numLikes: -1}},
            { new: true },
            (err, dislike) => {
              if (err)
                return res
                  .status(500)
                  .send({ message: "Server error, please try again" });
              return res.status(200).send({ message: "Dislike", dislike });
            }
          );
        } else {
          Tweet.findOneAndUpdate(
            {_id: tweetId},
            { $push: { likes: { user: myIdAccount } }, $inc: {numLikes: 1} },
            { new: true },
            (err, liked) => {
              if (err)
                return res
                  .status(500)
                  .send({ message: "Server error, please try again" });
              if (!liked)
                return res
                  .status(400)
                  .send({ message: "It wasn't possible to like this tweet" });
              return res.status(200).send({ message: "Success", liked });
            }
          );
        }
      }
    );
  } else {
    return res.status(400).send({
      message: "Missing data, make sure that you are sending all the data",
    });
  }
}

function commentTweet(req, res) {
  var parametr = req.body.command;
  parametr = parametr.toLowerCase();
  parametr = parametr.trim();
  parametr = parametr.split(" ");
  parametr.shift();

  var tweetId = parametr[0];

  if (tweetId) {
    parametr.shift();
    var comment = parametr.join(" ").toString();
    var myIdAccount = req.user.sub;

    Tweet.findByIdAndUpdate(
      tweetId,
      { $push: { comments: { comment: comment, user: myIdAccount } }, $inc:{numComments: 1} },
      { new: true },
      (err, commented) => {
        if (err)
          return res.status.send({ message: "Server error, please try again" });
        if (!commented)
          return res.status(404).send({ message: "Comment cannot created" });
        return res.status(200).send({ message: "Success", commented });
      }
    );
  } else {
    return res.status(400).send({
      message: "Missing data, make sure that you are sending all the data",
    });
  }
}

function retweet(req, res) {
  var parametr = req.body.command;
  parametr = parametr.toLowerCase();
  parametr = parametr.trim();
  parametr = parametr.split(" ");
  parametr.shift();

  
  var tweetId = parametr[0];
  if (tweetId) {
    parametr.shift();
    var comment = parametr.join(" ").toString();
    var myIdAccount = req.user.sub;
    var retweet = new Tweet();
    Tweet.findById(tweetId, (err, tweetFound) => {
      if (err)
        return res
          .status(500)
          .send({ message: "Server error, please try again" });
      if (!tweetFound)
        return res
          .status(404)
          .send({ message: "Tweet not found, please try again" });
      var tweetId = tweetFound._id;
      var contentOfTweet = tweetFound.myTweet;
      var userOfTweet = tweetFound.user
      Tweet.findOne(
        {
          $and: [
            { "retweet.tweetId": tweetId },
            { "retweet.contentOfTweet": contentOfTweet },
          ],
        },
        (err, tweetExist) => {
          if (tweetExist) {
            Tweet.findByIdAndUpdate(
              tweetId,
              { $inc: { numRetweets: -1 } },
              {new: true},
              (err) => {
                if (err)
                  return res
                    .status(500)
                    .send({ message: "Server error, please try again" });
                Tweet.findOneAndDelete(
                  {
                    $and: [
                      { "retweet.tweetId": tweetId },
                      { "retweet.contentOfTweet": contentOfTweet },
                    ],
                  },
                  (err, retweetDeleted) => {
                    return res
                      .status(200)
                      .send({ message: "Success", retweetDeleted });
                  }
                );
              }
            );
          } else {
            Tweet.findByIdAndUpdate(
              tweetId,
              { $inc: { numRetweets: 1 } },
              {new: true},
              (err) => {
                if(err) return res.status(500).send({message: 'Server error, please try again'})
                retweet.user = myIdAccount;
                retweet.retweet = {
                  tweetId: tweetId,
                  contentOfTweet: contentOfTweet,
                  userOfTweet: userOfTweet
                };
                retweet.myTweet = comment;
                retweet.numComments = 0
                retweet.numLikes = 0
                retweet.numRetweets = 0
                retweet.save((err, retweetSuccess) => {
                  if (err)
                    return res
                      .status(500)
                      .send({ message: "Server error, please try again" });
                  if (!retweetSuccess)
                    return res
                      .status(400)
                      .send({ message: "Tweet cannot retweet" });
                  return res
                    .status(200)
                    .send({ message: "Success", retweetSuccess });
                });
              }
            );
          }
        }
      );
    });
  } else {
    return res.status(400).send({
      message: "Missing data, make sure that you are sending all the data",
    });
  }
}

module.exports = {
  createTweet,
  viewTweets,
  updateTweet,
  deleteTweet,
  likedTweet,
  commentTweet,
  retweet,
};
