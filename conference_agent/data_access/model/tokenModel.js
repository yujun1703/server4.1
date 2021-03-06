"use strict";
var mongoose = require("mongoose"), Schema = mongoose.Schema, TokenSchema = new Schema({
    user: String,
    role: String,
    room: {type: Schema.Types.ObjectId, ref: "Room"},
    service: {type: Schema.Types.ObjectId, ref: "Service"},
    creationDate: Date,
    origin: {},
    code: String,
    secure: Boolean,
    host: String
});
module.exports = mongoose.model("Token", TokenSchema);