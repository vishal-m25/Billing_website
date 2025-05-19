const OtpModel = require('../models/otp.model');

class OtpService {
    async genOtp(email) {
        const otp = (Math.random() * 100000000).toString().slice(0, 6);
        await OtpModel.deleteMany({email:email});
        const otpObj = await OtpModel.create({
            email: email,
            otp: otp,
        });
        return {
            otp: otp,
            _id: otpObj._id,
        };
    }
    async compare(id, otp) {
        const otpObj = await OtpModel.findOne({email:id});
        if (!otpObj) {
            throw new Error('otp not yet generated for email');
        }
        // if (otpObj.isVerified) {
        //     throw new Error('otp already verified');
        // }
        if (new Date() > otpObj.expiresIn) {
            throw new Error('otp expired');
        }
        
        if (otpObj.otp != otp) {
            console.log(otpObj.otp, otp);
            throw new Error('OTP does not match');
        }
        otpObj.isVerified = true;
        await otpObj.save();
    }
}

const otpService = new OtpService();
module.exports = otpService;
