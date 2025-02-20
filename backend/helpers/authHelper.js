const crypto = require('crypto');

const algorithm = 'aes-256-cbc';  // Encryption algorithm
const secretKey = '01234567890123456789012345678901'; // Replace with your actual key

// Encrypt function
const encryptPassword = (password) => {
  const iv = crypto.randomBytes(16); // Generate a random IV
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'utf-8'), iv); // Create cipher instance
  let encrypted = cipher.update(password, 'utf8', 'hex'); // Encrypt password
  encrypted += cipher.final('hex'); // Complete encryption
  return { encryptedPassword: encrypted, iv: iv.toString('hex') }; // Return encrypted password and IV
};

// Decrypt function
const decryptPassword = (encryptedPassword,iv) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey, 'utf-8'),
    Buffer.from(iv, 'hex') // Use the same IV for decryption
  );
  let decrypted = decipher.update(encryptedPassword, 'hex', 'utf8');
  console.log('decrypted ',decrypted)
  decrypted += decipher.final('utf8');
  return decrypted;
};

module.exports = { encryptPassword, decryptPassword };
