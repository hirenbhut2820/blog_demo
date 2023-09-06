const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    blogName: String,
    blogSlug: String,
    blogDescription: String,
    blogImage: String
});

module.exports = mongoose.model("Blog", blogSchema);