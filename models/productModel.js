const mongoose = require('mongoose');

const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;
const product = new schema({
    id: {type: ObjectId},
    name: { type: String },
    price: {type: Number},
    rating: {type: Number},
    category: {type: ObjectId, ref: "category"},
    imgUrl: {type: String},
})

module.exports = mongoose.models.product || mongoose.model("product",product);