const mongoose = require('mongoose');

const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;
const product = new schema({
    id: {type: ObjectId},
    name: { type: String },
    price: {type: Number},
    quantity: {type: Number},
    userID: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
})

module.exports = mongoose.models.product || mongoose.model("product",product);