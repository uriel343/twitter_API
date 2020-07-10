"use strict";
const Follow = require("../models/follow");
const User = require("../models/user");

function follow(req, res) {
  var parametr = req.body.command;
  parametr = parametr.toLowerCase();
  parametr = parametr.trim();
  parametr = parametr.split(" ");
  var accountToFollow = parametr[1];
  var myIdAccount = req.user.sub;
  var follows = new Follow();

  if (accountToFollow) {
    if(accountToFollow === req.user.user) return res.status(403).send({message: 'You cannot follow to yourself'})
    User.findOne({ user: accountToFollow }, (err, userFound) => {
      if (err)
        return res.status(500).send({
          message: "Server error, please try again",
        });
      if (!userFound)
        return res.status(404).send({
          message: "User not found",
        });
      var userToFollow = userFound._id;
      Follow.find(
        { $and: [{ user: myIdAccount }, { following: userToFollow }] },
        (err, documentFound) => {
          if (err)
            return res
              .status(500)
              .send({ message: "Server error, please try again" });
          if (documentFound && documentFound.length >= 1) {
            return res
              .status(400)
              .send({ message: "You already follow this account" });
          } else {
            follows.user = myIdAccount;
            follows.following = userToFollow;

            follows.save((err, followCorrect) => {
              if (err)
                return res
                  .status(500)
                  .send({ message: "Server error, please try again" });
              if (followCorrect) {
                return res
                  .status(200)
                  .send({ message: "success", data: followCorrect });
              } else {
                return res
                  .status(404)
                  .send({ message: "You cannot follow this account" });
              }
            });
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

function unfollow(req, res) {
  var parametr = req.body.command;
  parametr = parametr.toLowerCase();
  parametr = parametr.trim();
  parametr = parametr.split(" ");
  var accountToUnfollow = parametr[1];
  var myIdAccount = req.user.sub;
  
  if (accountToUnfollow) {
    User.findOne({ user: accountToUnfollow }, (err, userFound) => {
        if (err)
          return res.status(500).send({
            message: "Server error, please try again",
          });
        if (!userFound)
          return res.status(404).send({
            message: "User not found",
          });
        var userToUnfollow = userFound._id;
        Follow.findOneAndDelete(
          { $and: [{ user: myIdAccount }, { following: userToUnfollow }] },
          (err, documentFound) => {
            if (err)
              return res
                .status(500)
                .send({ message: "Server error, please try again" });
            if (!documentFound) return res.status(404).send({
                message: 'You do not follow this account'
            })
            return res.status(200).send({
                message: 'Success',
                unfollowedAccount: documentFound
            })
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
  follow,
  unfollow,
};
