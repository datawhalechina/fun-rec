// const CryptoJS = require('crypto-js');  //引用AES源码js
import CryptoJS from 'crypto-js'
// 解析    
const key = CryptoJS.enc.Utf8.parse("1234123412ABCDEF");  //十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412');   //十六位十六进制数作为密钥偏移量

//解密方法
function Decrypt(word) {
    let encryptedHexStr = CryptoJS.enc.Hex.parse(word);  // 16进制
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);  // 解密的密文必须是base64 
    let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });  
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);   // 以utf8方法转换
    return decryptedStr.toString();  
}

//加密方法
function Encrypt(word) {
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }); // 偏移向量 加密模式 填充方式
    return encrypted.ciphertext.toString().toUpperCase(); // 加密后的是对象 需要转到文本
}

export default {
    Decrypt ,
    Encrypt
}
