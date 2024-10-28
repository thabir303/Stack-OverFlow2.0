//controllers/authController.js
const User=require('../models/User');
const bycrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const {email, password} = req.body;
        const hash_password=await bycrypt.hash(password, 10);
        const user=new User({email, password: hash_password});
        await user.save();
        res.status(201).json({success: true, message: "User Registered Successfully"});
    } catch (error) {
        res.status(500).json({error: "Server error"});
    }
};

exports.signin = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user=await User.findOne({email});
        
        if (!user || !(await bycrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
        res.status(200).json({success: true, token: token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};