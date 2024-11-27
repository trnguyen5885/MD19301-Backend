const mongoose = require('mongoose');

const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;
const category = new schema({
    id: {type: ObjectId},
    name: { type: String },
})

module.exports = mongoose.models.category || mongoose.model("category",category);