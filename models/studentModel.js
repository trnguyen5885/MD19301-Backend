const mongoose = require('mongoose');

const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;
const student = new schema({
    id: {type: ObjectId},
    code: {type: String},
    fullname: { type: String },
    score: {type: Number},
    subject: {type: String},
    age: {type: Number}
})

module.exports = mongoose.models.student || mongoose.model("student",student);