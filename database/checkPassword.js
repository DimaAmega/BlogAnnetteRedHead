var crypto = require('crypto');
function check(password,hashPassword){
    return crypto.createHash('md5').update(password).digest("hex") == hashPassword
};
module.exports = check;
