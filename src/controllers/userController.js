"use strict";
const User = require("../models/user");
const Tweet = require("../models/tweet");
const Follow = require("../models/follow");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");


function createAccount(req, res) {
  var parametr = req.body.command;
  parametr = parametr.toLowerCase();
  parametr = parametr.trim();
  parametr = parametr.split(" ");
  var user = parametr[1];
  var password = parametr[2];

  var account = new User();
  if (user && password) {
    account.user = user;
    account.password = password;

    User.find({ user: account.user }).exec((err, userExisting) => {
      if (err) {
        return res.status(500).send({
          message: "Server error, please try again",
        });
      }
      if (userExisting && userExisting.length >= 1) {
        return res.status(400).send({
          message: "This user already exists",
        });
      } else {
        bcrypt.hash(account.password, null, null, (err, hash) => {
          account.password = hash;
          account.save((err, userSaved) => {
            if (err)
              return res
                .status(500)
                .send({ message: "Server error, please try again" });

            if (userSaved) {
              res.status(200).send({
                user: userSaved,
              });
            } else {
              res.status(404).send({
                message: "The user cannot register",
              });
            }
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

function login(req, res) {
  var parametr = req.body.command;
  parametr = parametr.toLowerCase();
  parametr = parametr.trim();
  parametr = parametr.split(" ");
  var account = parametr[1];
  var key = parametr[2];

  if (account && key) {
    var userCompare = account;
    var password = key;

    User.findOne({ user: userCompare }, (err, userFound) => {
      if (err)
        return res
          .status(500)
          .send({ message: "Server error, please try again" });
      if (userFound) {
        bcrypt.compare(password, userFound.password, (err, checked) => {
          if (err)
            return res
              .status(500)
              .send({ message: "Server error, please try again" });

          if (checked) {
            return res.status(200).send({
              message: "User logged",
              token: jwt.createToken(userFound),
            });
          } else {
            return res.status(404).send({ message: "User not logged" });
          }
        });
      } else {
        return res.status(404).send({ message: "User not found" });
      }
    });
  } else {
    return res.status(400).send({
      message: "Missing data, make sure that you are sending all the data",
    });
  }
}

function profile(req, res) {
  var parametr = req.body.command;
  parametr = parametr.toLowerCase();
  parametr = parametr.trim();
  parametr = parametr.split(" ");
  var user = parametr[1];
  var myIdAccount = req.user.sub;

  if (user) {
    User.findOne({ user: user }, { password: 0 }, (err, userFound) => {
      if (err)
        return res
          .status(500)
          .send({ message: "Server error, please try again" });
      if (!userFound)
        return res.status(404).send({ message: "This user doesn't exist" });
      var userId = userFound._id;
      Tweet.countDocuments({ user: userId }, (err, numberOfTweets) => {
        if (err)
          return res
            .status(500)
            .send({ message: "Server error, please try again" });
        var tweetsCount = numberOfTweets;
        Follow.countDocuments({ user: userId }, (err, numberOfFollows) => {
          if (err)
            return res
              .status(500)
              .send({ message: "Server error, please try again" });
          var followCount = numberOfFollows;
          if (!numberOfTweets) {
            return res.status(200).send({
              user: userFound,
              following: followCount,
              tweets: 0,
            });
          } else if (!numberOfFollows) {
            return res.status(200).send({
              user: userFound,
              following: 0,
              tweets: tweetsCount,
            });
          } else if (!numberOfTweets && !numberOfFollows) {
            return res.status(200).send({
              user: userFound,
              following: 0,
              tweets: 0,
            });
          } else if (numberOfFollows && numberOfTweets) {
            return res.status(200).send({
              user: userFound,
              following: followCount,
              tweets: tweetsCount,
            });
          }
        });
      });
    });
  } else {
    User.findById(myIdAccount, { password: 0 }, (err, userFound) => {
      if (err)
        return res
          .status(500)
          .send({ message: "Server error, please try again" });
      Tweet.countDocuments({ user: myIdAccount }, (err, numberOfTweets) => {
        if (err)
          return res
            .status(500)
            .send({ message: "Server error, please try again" });
        var tweetsCount = numberOfTweets;
        Follow.countDocuments({ user: myIdAccount }, (err, numberOfFollows) => {
          if (err)
            return res
              .status(500)
              .send({ message: "Server error, please try again" });
          var followCount = numberOfFollows;
          if (!numberOfTweets) {
            return res.status(200).send({
              user: userFound,
              following: followCount,
              tweets: 0,
            });
          } else if (!numberOfFollows) {
            return res.status(200).send({
              user: userFound,
              following: 0,
              tweets: tweetsCount,
            });
          } else if (!numberOfTweets && !numberOfFollows) {
            return res.status(200).send({
              user: userFound,
              following: 0,
              tweets: 0,
            });
          } else if (numberOfFollows && numberOfTweets) {
            return res.status(200).send({
              user: userFound,
              following: followCount,
              tweets: tweetsCount,
            });
          }
        });
      });
    });
  }
}

module.exports = {
  createAccount,
  login,
  profile,
};
