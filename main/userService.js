const crypto = require('crypto')
const SHA256 = require("crypto-js/sha256");
module.exports = {hashPassword, getSalt};

function hashPassword(password){
    const hash = SHA256(password).toString()
    return hash;
}

function getSalt(){
    return crypto.randomBytes(Math.ceil(16 / 2)).toString('hex').slice(0, 16);
}