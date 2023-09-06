const express = require("express");
const router = express.Router();
const auth = require('../controllers/auth');
const blog = require('../controllers/blog');

const multer = require('multer');
const upload = multer({dest: "./src/public/images"});

router.post('/login', auth.loginHandler);

router.get('/blog', auth.verifyAuthToken, blog.getBlogs);
router.post('/blog', auth.verifyAuthToken, upload.single('blogImage'), blog.addBlog);
router.patch('/blog/:blogId', auth.verifyAuthToken, blog.updateBlog);
router.delete('/blog/:blogId', auth.verifyAuthToken, blog.deleteBlog);

router.get('/ping', auth.verifyAuthToken, (req, res)=>{
    res.status(200).send({msg: "Valid token"});
})

module.exports = router;