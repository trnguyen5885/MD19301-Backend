const mongoose = require('mongoose');

const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;
const customer = new schema({
    id: {type: ObjectId},
    customerName: {type: String},
    email: {type: String},
    phone: {type: String},
    address: {type: String},
    username: { type: String },
    password: {type: String},
})

module.exports = mongoose.models.customer || mongoose.model("customer",customer);