const { createCipheriv, createDecipheriv, createHash } = require("crypto");

const algorithm = "aes-256-cbc";

// for demo only
const iv = Buffer.alloc(16, 0);

function getCipherKey(password) {
  return createHash("sha256").update(password).digest();
}

function encrypt(buffer, passcode) {
  const key = getCipherKey(passcode);
  const cipher = createCipheriv(algorithm, key, iv);
  return Buffer.concat([cipher.update(buffer), cipher.final()]);
}

function decrypt(buffer, passcode) {
  const key = getCipherKey(passcode);
  const decipher = createDecipheriv(algorithm, key, iv);
  return Buffer.concat([decipher.update(buffer), decipher.final()]);
}

module.exports = {
  encrypt,
  decrypt,
};
