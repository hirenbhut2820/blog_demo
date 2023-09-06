const mongoose = require("mongoose");
const Users = mongoose.model("User");
const jwt = require('jsonwebtoken');
const JWT_SECRET = "abcdefghijklmno";

const loginHandler = async (req, res) => {
    try {
        const user = await Users.findOne({email: req.body.username, password: req.body.password});

        if(!user){
            return res.status(404).send({err: "user is not found with username."});
        }

        jwt.sign({user}, JWT_SECRET, {expiresIn: '3000s'}, (err, token)=>{
            if(err){
                return res.status(500).send({err: "Something went wrong."});
            }

            res.status(200).send({token: token});
        })
    } catch (err) {
        res.status(500).send({err: "Something went wrong."});
    }
}

const verifyAuthToken = async (req, res, next) => {
    try {
        const bearerHeader = req.headers['authorization'];
        const token = bearerHeader.split(" ")[1];

        if(!token.length){
            return res.status(400).send({err: "Auth token is missing."});
        }

        jwt.verify(token, JWT_SECRET, (err, token) => {
            if(err){
                return res.status(400).send({err: "Invalid Token."});
            }

            next();
        })
    } catch(err){
        res.status(500).send({err: "Token Header is missing."});
    }
}

module.exports = {
    loginHandler,
    verifyAuthToken
}