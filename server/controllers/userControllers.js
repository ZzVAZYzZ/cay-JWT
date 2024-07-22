const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken")
const {workRedis} = require("../configs/redisConnection")

//@desc Register User
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body;
    if(!username||!email||!password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("User already registered!");
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:",hashedPassword);
    const user = await User.create({
        username,
        email,
        password:hashedPassword,
    });
    if(user){
        res.status(201).json({_id: user.id, email: user.email})
    }else{
        res.status(400);
        throw new Error("User data is not valid");
    }
    res.json({ message: "Register the user" });
});

//@desc Login User
//@route POST /api/users/login
//@access private
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const user = await User.findOne({ email });
    //compare password with hashedpassword
    if(user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id,
                },
            }, process.env.ACCESS_TOKEN_SCERET,
            {expiresIn: "15m"}
        );
        // Push data to redis
        const dataRedis = {
            username: user.username,
            email: user.email,
            id: user.id,
            nickname: 'Vazy',
        }
        workRedis(dataRedis);
        res.status(200).json({ accessToken });
    }else{
        res.status(401);
        throw new Error("email or password is not valid")
    }
  res.json({ message: "Login the user" });
});

//@desc Current User
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

//@desc Logout User
//@route POST /api/users/logout
//@access public
const logoutUser = asyncHandler(async (req, res) => {
    const updateToken = await User.updateOne(
        { _id: req.body.userID }, // Filter criteria (find the user by ID)
        { $push: { oldtoken: req.body.token } } // Update operation
    );
    res.status(200).json("Log out successful");
});

module.exports = { registerUser, loginUser, currentUser, logoutUser };
