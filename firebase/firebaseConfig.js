const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');
const dotenv = require('dotenv')

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.BUCKET_ID,
});

const bucket = admin.storage().bucket();

module.exports = { bucket };
