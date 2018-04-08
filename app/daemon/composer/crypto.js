import crypto from 'crypto';

// Nodejs support openssl algorithm
const CIPHER_ALGORITHM = 'aes256'; // aes256 is aes256-cbc

export const createCipher = (password) => crypto.createCipher(CIPHER_ALGORITHM, password);

export const createDecipher = (password) => crypto.createDecipher(CIPHER_ALGORITHM, password);
