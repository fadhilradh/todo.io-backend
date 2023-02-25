const { customAlphabet, nanoid } = require("nanoid");
const crypto = require("crypto");
const { promisify } = require("util");

function generateRandomID() {
  const nanoid = customAlphabet(
    "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    10
  );

  return nanoid();
}

function generateRandomBytes() {
  return promisify(crypto.randomBytes);
}

module.exports = { generateRandomID, generateRandomBytes };
