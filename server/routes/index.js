var express = require('express');
var router = express.Router();
const { login, register, verifyOTP, resendOTP, forgotPassword, verifyPasswordResetOTP, resetPassword } = require('../controllers/authController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ message: 'API Server is running' });
});

/* POST login */
router.post('/login', login);

/* POST register */
router.post('/register', register);

/* POST verify OTP */
router.post('/verify-otp', verifyOTP);

/* POST resend OTP */
router.post('/resend-otp', resendOTP);

/* POST forgot password */
router.post('/forgot-password', forgotPassword);

/* POST verify password reset OTP */
router.post('/verify-password-reset-otp', verifyPasswordResetOTP);

/* POST reset password */
router.post('/reset-password', resetPassword);

module.exports = router;
