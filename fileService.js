const fs = require("fs");
const path = require("path");
const { encrypt, decrypt } = require("./cryptoService");

function saveEncryptedFile(buffer, filePath, passcode) {
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }
  fs.writeFileSync(filePath, encrypt(buffer, passcode));
}

function getDecryptedFile(filePath, passcode) {
  const encrypted = fs.readFileSync(filePath);
  return decrypt(encrypted, passcode);
}

module.exports = {
  saveEncryptedFile,
  getDecryptedFile,
};
