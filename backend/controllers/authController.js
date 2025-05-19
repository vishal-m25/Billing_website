const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const otpService = require('../services/otp.service')
const emailService = require('../services/email.service')

exports.register = async (req, res) => {
  try {
    const { fullName, email, password,phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name: fullName, email, password: hashed,phone });
    console.log("completed registering");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ email: username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    console.log("completed loging");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// for existing mails in case of password reset or others
exports.requestOtp = async function (req, res) {
    try {
        const payload = req.body;
        const { status } = await User.findOne({email :payload.email});
        if (!status) throw new Error('email not exists');
        const { otp, _id } = await otpService.genOtp(payload.email, REASON.VERIFY);
        await emailService.sendOtp(payload.email, otp);
        res.status(200).json({
            status: true,
            message: 'otp sent to your email',
            data: {
                id: _id,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message,
        });
    }
};

exports.requestVerifyOtp = async function (req, res) {
    try {
        const payload = req.body;
        const { otp, _id } = await otpService.genOtp(payload.email);
        await emailService.sendOtp(payload.email, otp);
        res.status(200).json({
            success:true,
            status: true,
            message: 'otp sent to your email',
            data: {
                id: _id,
            },
        });
    } catch (error) {
        res.status(400).json({
            success:false,
            status: false,
            message: error.message,
        });
    }
};

exports.verifyOtp = async function (req, res) {
    try {
        const payload = req.body;
        await otpService.compare(payload.email, payload.otp);
        res.status(200).json({
            status: true,
            message: 'otp verification successful',
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message,
        });
    }
};