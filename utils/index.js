const { customAlphabet, nanoid } = require("nanoid");

function generateRandomID() {
  const nanoid = customAlphabet(
    "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    10
  );

  return nanoid();
}

module.exports = { generateRandomID };
