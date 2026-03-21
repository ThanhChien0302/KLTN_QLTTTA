const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  FullName: String,

  isverify: {
    type: Boolean,
    default: false,
  },

  Numberphone: {
    type: String,
    trim: true
  },

  dateOfBirth: {
    type: Date
  },

  address: {
    type: String,
    trim: true
  },

  isActive: {
    type: Boolean,
    default: true,
  },
  avatar: String,

  hashpassword: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["admin","teacher","student"],
    default: "student"
  },

  otp: {
    type: String, // Mã hóa OTP
  },

  otpExpires: {
    type: Date, // Thời gian hết hạn OTP
  }

}, { timestamps: true });


// HASH PASSWORD
userSchema.pre("save", async function () {

  if (!this.isModified("hashpassword")) return;

  const salt = await bcrypt.genSalt(10);
  this.hashpassword = await bcrypt.hash(this.hashpassword, salt);

});


// compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.hashpassword);
};

// Generate OTP
userSchema.methods.generateOTP = async function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const salt = await bcrypt.genSalt(10);
  this.otp = await bcrypt.hash(otp, salt);
  this.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await this.save();
  return otp; // Return plain OTP to send via email
};

// Verify OTP
userSchema.methods.verifyOTP = async function(candidateOTP) {
  if (!this.otp || !this.otpExpires) return false;
  if (Date.now() > this.otpExpires) {
    this.otp = undefined;
    this.otpExpires = undefined;
    await this.save();
    return false;
  }
  const isValid = await bcrypt.compare(candidateOTP, this.otp);
  if (isValid) {
    this.otp = undefined;
    this.otpExpires = undefined;
    this.isverify = true;
    await this.save();
  }
  return isValid;
};

module.exports = mongoose.model("User", userSchema);