const { v4: uuidv4 } = require('uuid');
const mongoose = require("mongoose");
const { schemaOption } = require("../utils/schemaOption")

const schema = new mongoose.Schema({
    id: {
        type: String,
        default: () => {
            return uuidv4();
        },
        required: true,
        index: true
    },
    conversationId: { type: String, required: true },
    sender: { type: String, required: true },
    text: { type: String, required: true },


}, schemaOption);

const model = mongoose.model("message", schema);
module.exports = model;