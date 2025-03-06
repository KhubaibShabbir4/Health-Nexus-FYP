import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.SECRET_KEY || "your-32-character-secret-key"; // Store in .env

// Encrypt Data
export function encryptData(data) {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

// Decrypt Data
export function decryptData(encryptedData) {
    if (!encryptedData) return "";
    return CryptoJS.AES.decrypt(encryptedData, SECRET_KEY).toString(CryptoJS.enc.Utf8);
}
