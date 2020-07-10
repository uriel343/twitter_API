"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var followSchema = Schema({
  following: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

module.exports = mongoose.model("follows", followSchema);
