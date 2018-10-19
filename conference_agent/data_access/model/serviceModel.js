"use strict";
var mongoose = require("mongoose"), Schema = mongoose.Schema, ServiceSchema = new Schema({
    name: {type: String, required: !0, unique: !0},
    key: {type: String, required: !0},
    encrypted: {type: Boolean},
    rooms: [{type: Schema.Types.ObjectId, ref: "Room"}]
});
module.exports = mongoose.model("Service", ServiceSchema);