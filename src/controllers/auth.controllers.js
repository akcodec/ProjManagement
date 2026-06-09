//ab hme user ko authenticate krna h jb wo first time login ya register ya signup jo bhi 
//to hmare pass user ka database,tokens generate krne ke liye methods, email bhejne ke liye
//utility function, async handler jo error ko handle krta h

import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { asynchandler } from "../utils/async-handler.js";
import {ApiError} from "../utils/api-error.js";
import { sendEmail,emailVerificationMailgenContent } from "../utils/mail.js";

//take some data from request body
//validate the data
//check if user already exists in database
//saved the new user (access token and refresh token ,sendmail,)
//user verification ke liye email bhejna hoga
//send response to client

//jb user already exist krta h to generate refresh token ,access token 
const generateAccessAndRefreshTokens = async (userId)=>{
    try{
        const user= await User.findById(userId)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        return {accessToken, refreshToken};
    }catch(error){
        throw new ApiError(500, "Error while generating access and refresh tokens", []);
    }
}

const registerUser = asynchandler(async (req, res) => {
    const { username, email, fullName, password } = req.body;

    console.log("[registerUser] request received", {
        username,
        email,
        fullName,
        hasPassword: Boolean(password)
    });

    if (!username || !email || !fullName || !password) {
        console.log("[registerUser] missing required fields");
        throw new ApiError(400, "username, email, fullName aur password required hain");
    }

    console.log("[registerUser] checking for existing user");
    const existedUser=await User.findOne({
        $or: [{ email }, { username }]
    });

    if(existedUser){
        console.log("[registerUser] user already exists", {
            id: existedUser._id,
            username: existedUser.username,
            email: existedUser.email
        });
        throw new ApiError(400, "User with this email or username already exists",[]);
    }

    console.log("[registerUser] creating new user");
    const user=await User.create({
        username,
        email,
        fullName,
        password,
        isEmailVerified: false
    })

    console.log("[registerUser] user created", {
        id: user._id,
        username: user.username,
        email: user.email
    });

    // verification ke liye token generate karo
    const  {inHashedToken, hashedToken, tokenExpiry} = user.GenerateTemporaryToken();

    console.log("[registerUser] verification token generated", {
        tokenExpiry,
        hashedTokenExists: Boolean(hashedToken),
        unHashedTokenExists: Boolean(inHashedToken)
    });

    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiry = tokenExpiry;
    await user.save({validateBeforeSave: false});

    console.log("[registerUser] user saved with email verification token");

    console.log("[registerUser] sending verification email to", user.email);
    await sendEmail(
        {
            email:user?.email,
            subject:"please verify your email",
            mailgenContent: emailVerificationMailgenContent(
                user.username,
                ` ${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${inHashedToken}`,
            ),
        }
    );

    console.log("[registerUser] verification email sent");

   const createdUser= await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
   );

    console.log("[registerUser] fetched created user for response", {
        id: createdUser?._id,
        hasCreatedUser: Boolean(createdUser)
    });

   if(!createdUser)
   {
    console.log("[registerUser] created user not found after save");
    throw new ApiError(500,"Something went wrong while registering a user")
   }

   return res
   .status(201)
   .json(
    new ApiResponse(
        201,
        "user registered successfully and verification email has been sent on your email",
        { user: createdUser }
    )
   )

    })

    export {registerUser}