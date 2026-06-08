import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

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

userSchema.pre('save', async function(next) {
    //agr modified nahi hua password to next() kar do
    if(!this.isModified('password')) {
        return next();
    }
 this.password=await bcrypt.hash(this.password, 10).next();
});

export const User= mongoose.model('User', userSchema);