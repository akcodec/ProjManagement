import mailgen from "mailgen";
import nodemailer from "nodemailer";
const sendEmail = async (options) => {
    console.log("[sendEmail] preparing email", {
        to: options.email,
        subject: options.subject,
        hasMailgenContent: Boolean(options.mailgenContent)
    });

    // mailgen se ek email template banate hain
    // yeh HTML aur plain text dono create karega
    const mailGenerator = new mailgen({
        theme: "default",
        product: {
            name: "Task Manager",
            link: "https://google.com"
        }
    })

    // Mail ka plain text version generate karo
    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
    // Mail ka HTML version generate karo
    const emailHTML = mailGenerator.generate(options.mailgenContent);

    // Nodemailer transporter banate hain
    // Yeh SMTP server details leta hai environment variables se
    const smtpHost = process.env.MAILTRAP_SMTP_HOST || process.env.EMAIL_HOST;
    const smtpPort = Number(process.env.MAILTRAP_SMTP_PORT || process.env.EMAIL_PORT || 587);
    console.log("[sendEmail] smtp config", {
        host: smtpHost,
        port: smtpPort,
        userSet: Boolean(process.env.MAILTRAP_SMTP_USER || process.env.EMAIL_USER),
        passSet: Boolean(process.env.MAILTRAP_SMTP_PASS || process.env.EMAIL_PASSWORD)
    });

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER || process.env.EMAIL_USER,
            pass: process.env.MAILTRAP_SMTP_PASS || process.env.EMAIL_PASSWORD
        }
    })

    // Mail ka object jo sendMail ko pass hoga
    const mail = {
        from: "mail.taskmanager@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHTML
    }

    try {
        // Email send karne ki actual call
        console.log("[sendEmail] calling transporter.sendMail");
        await transporter.sendMail(mail);
        console.log("[sendEmail] email sent successfully");
    } catch (error) {
        // Agar koi problem aaye to console pe error show karo aur upar throw karo
        console.error("Error sending email:", error);
        throw error;
    }
}

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

export {emailVerificationMailgenContent, forgetPasswordMailgenContent, sendEmail}; 