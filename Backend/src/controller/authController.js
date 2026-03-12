const userModel = require('../models/User')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExist = await userModel.findOne({ email });
        if (userExist) {
            return res.status(400).json({
                message: 'User already exists'
            })
        }
        const hashPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            name,
            email,
            password: hashPassword,
            role: role || 'student'
        });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });
       res.cookie("token", token)

        res.status(201).json({
            message: 'User is created ',
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });

        }
        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })
        res.cookie("token", token)
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const logoutUser = (req,res)=>{
     res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
    res.status(200).json({ message: 'Logged out successfully' });
}
const getMe = async (req,res)=>{
    try{
        const user = await userModel.findById(req.user.id).select('-password');
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}

module.exports = { registerUser, loginUser, logoutUser, getMe };