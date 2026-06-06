import dotenv from 'dotenv';
dotenv.config({
    path:"./.env"
});
console.log('Hello, World!');
let email = process.env.email;
console.log(email);