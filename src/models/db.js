const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URL);

require('./users.model');
require('./blogs.model');

const Users = mongoose.model("User");

const addDefaultUser = async () => {
    const user = await Users.findOne({email:"admin@1.com"})
    
    if(!user){
    
        await Users.create({
            email: "admin@1.com",
            password: "Password@1234"
        })
    }
}

addDefaultUser();