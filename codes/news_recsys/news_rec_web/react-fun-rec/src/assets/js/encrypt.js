//引用AES源码js
const CryptoJS = require('crypto-js');  
//十六位十六进制数作为密钥    
const key = CryptoJS.enc.Utf8.parse("1234123412ABCDEF"); 
//十六位十六进制数作为密钥偏移量 
const iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412');   

//解密方法
function Decrypt(word) {
    let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}

//加密方法
function Encrypt(word) {
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.ciphertext.toString().toUpperCase();
}

export default {
    Decrypt ,
    Encrypt
}
