const mongoose = require('mongoose');

const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;
const user = new schema({
    id: {type: ObjectId},
    username: { type: String },
    password: {type: String},
    old: {type: Number}
})

module.exports = mongoose.models.user || mongoose.model("user",user);