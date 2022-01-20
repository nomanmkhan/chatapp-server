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
    members: {
        type: Array,
        required: true
    }

}, schemaOption);

const model = mongoose.model("conversation", schema);
module.exports = model;