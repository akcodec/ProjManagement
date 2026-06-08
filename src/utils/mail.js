import mailgen from "mailgen";

const emailVerificationMailgenContent= (
    userName,
    verificationUrl
)=>{
    return {
        body: {
            name: userName,
            intro: "Welcome to our project management app! We're excited to have you on board.",
            action: {
                instructions: "Please click the button below to verify your email address:",
                button: {
                    text: "Verify Email",
                    link: verificationUrl,
                    color: "#22BC66" // Optional action button color
                }
            },
            outro: "If you did not create an account, no further action is required on your part."
        }
    }
}

const forgetPasswordMailgenContent= (
    userName,
    verificationUrl
)=>{
    return {
        body: {
            name: userName,
            intro: "we received a request to reset your password. If you made this request, please click the button below to reset your password.",
            action: {
                instructions: "Please click the button below to reset your password:",
                button: {
                    text: "Reset Password",
                    link: verificationUrl,
                    color: "#bc2222" // Optional action button color
                }
            },
            outro: "If you did not create an account, no further action is required on your part."
        }
    }
}

export {emailVerificationMailgenContent, forgetPasswordMailgenContent};