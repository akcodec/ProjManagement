import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import crypto from "crypto";

// User schema definition - database structure
const userSchema = new Schema({
    avatar: {
        type: String,
        required: false
        ,default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
    },
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    password: { 
        type: String,
        required: [true, "Password is required"],
    },
    isEmailVerified: {
        type: Boolean,
        default: false  
    },
    refreshToken: {
        type: String,
    },
    forgetPasswordToken: {
        type: String,
    },
    forgetPasswordTokenExpiry: {
        type: Date,
    },
    emailVerificationToken: {
        type: String
    }
},{timestamps: true});

// Pre-hook: Password ko hash karne se pehle (jab save ho raha ho)
// Agar password modify nahi ho to hash mat karo (sirf new/updated password ko hash karo)
userSchema.pre('save', async function(next) {
    // Check if password field is modified
    if(!this.isModified('password')) {
        return next();
    }
    // Password ko 10 rounds ke saath bcrypt se hash karo
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Custom method: Entered password ko database password ke saath match karo
// Login ke time use hota hai
userSchema.methods.isPasswordCorrect = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// Custom method: Access token generate karo
// Yeh token short-lived hota hai (15 min typically)
// Client ko login response mein bhejte ho
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRATION
        }
    )
}

// Custom method: Refresh token generate karo
// Yeh token long-lived hota hai (7 days typically)
// Database mein store karte ho aur refresh ke time use karte ho
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email
        },
        process.env.REFRESH_TOKEN_SECRET,
        {   
            expiresIn: process.env.REFRESH_TOKEN_EXPIRATION
        }
    )
}


// Custom method: Temporary token generate karo (password reset ke liye)
// Unhashed token user ko email mein bhejte ho, hashed token database mein store karte ho
userSchema.methods.GenerateTemporaryToken = function() {
    const inHashedToken = crypto.randomBytes(20).toString("hex");

    // Token ko hash karo sha256 se
    const hashedToken = crypto
    .createHash("sha256")
    .update(inHashedToken)
    .digest("hex");

    // Token expiry 10 minutes baad
    const tokenExpiry = Date.now() + 10 * 60 * 1000;

    return { inHashedToken, hashedToken, tokenExpiry };
}

// Model banao aur export karo
export const User = mongoose.model('User', userSchema);