const mongoose = require("mongoose");
const Blogs = mongoose.model("Blog");
const path = require('path');
const fs = require('fs');

const getBlogs = async (req, res) => {
    try {
        let blogList = await Blogs.find({});
        res.status(200).send({data: blogList});
    } catch (err) {
        res.status(500).send({err: "Something went wrong."});
    }
}

const addBlog = async (req, res) => {
    let requiredBlogKeys = ["blogName", "blogDescription", "blogSlug"];

    let notFoundKeys = [];
    requiredBlogKeys.forEach(function(blogParamItem){
        if(Object.keys(req.body).indexOf(blogParamItem) == -1){
            notFoundKeys.push(blogParamItem);
        }
    })

    if(notFoundKeys.length){
        return res.status(400).send({err: "Missing required body parameters."})
    }

    // Validating blog slug with the regex pattern
    if(!(/^(\d|\w|-)+$/.test(req.body.blogSlug))){
        return res.status(400).send({err: "Invalid blog slug name."})
    }

    // Save Image to path
    var tmp_path = req.file.path;
    var target_path = path.join(__dirname, '../public/images/'+req.file.originalname);

    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);

    src.pipe(dest);
    src.on('end', function() {});
    src.on('error', function(err){
        return res.status(400).send({err: "Invalid file type"});
    })

    let imagePath = "images/" + req.file.originalname;

    try {
        await Blogs.create({
            blogName: req.body.blogName,
            blogSlug: req.body.blogSlug,
            blogDescription: req.body.blogDescription,
            blogImage: imagePath
        })
    } catch (err) {
        return res.status(500).send({err: "Something went wrong."})
    }

    res.status(200).send({msg: "Blog Added"});
}

const updateBlog = async (req, res) => {
    try {
        let blog = await Blogs.findOne({_id: req.params.blogId});
        if(!blog){
            return res.status(400).send({err: "Requested blog is not found."});
        }

        blog.blogName = req.body.blogName;
        blog.blogSlug = req.body.blogSlug;
        blog.blogDescription = req.body.blogDescription;

        await blog.save();
    } catch (err) {
        return res.status(500).send({err: "Something went wrong."});
    }

    res.status(200).send({msg: "blog successfully updated."});
}

const deleteBlog = async (req, res) => {
    try {
        await Blogs.deleteOne({_id: req.params.blogId});
    } catch (err) {
        res.status(500).send({err: "Something went wrong."});
    }

    res.status(200).send({msg: "Blog Deleted"});
}

module.exports = {
    getBlogs,
    addBlog,
    updateBlog,
    deleteBlog
}