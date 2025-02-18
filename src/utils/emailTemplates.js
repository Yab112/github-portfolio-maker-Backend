import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the template file
const loadTemplate = (fileName) => {
    const filePath = `${__dirname}/templates/${fileName}`;
    const html = fs.readFileSync(filePath, "utf-8");
    return handlebars.compile(html);
};

// OTP Email Template
const otpTemplate = (otp) => {
    const template = loadTemplate("otp-email.html");
    const data = { otp };  // Pass OTP data to the template
    return template(data);
};

const sendPasswordReset = (token) =>{
    const template = loadTemplate("resetemail.html");
    const data = {token}
    return template(data)
}

const sendcredintial = (email,password)=>{
    const template = loadTemplate("newusergihubauth.html");
    const data = {email,password}
    return template(data)
}


export default {
    otpTemplate,
    sendPasswordReset,
    sendcredintial
};
