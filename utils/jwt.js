const bcrypt = require("bcrypt");
const { createSigner, createVerifier } = require("fast-jwt");
const secret = process.env.JWT_SECRET;
const sign = createSigner({ key: secret });
const verify = createVerifier({ key: secret });

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

function generateToken(payload) {
  const now = Math.floor(Date.now() / 1000);
  return sign({ ...payload, iat: now, exp: now + 7 * 24 * 60 * 60 });
}

function verifyToken(token) {
  try {
    return verify(token);
  } catch {
    return null;
  }
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
};
