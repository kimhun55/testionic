const admin = require('firebase-admin');

// Initialize with service account
const path = require('path');
const serviceAccount = require(path.join(__dirname, 'ionic-bffbd-firebase-adminsdk-fbsvc-018c8adc94.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


// Load tokens from Firestore and send notification to all
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

async function sendToAllWebTokens() {
  const snapshot = await db.collection('mobile_push_tokens').get();
  if (snapshot.empty) {
    console.log('No tokens found in Firestore.');
    return;
  }
  const tokens = snapshot.docs.map(doc => doc.data().token);
  console.log('Loaded tokens:', tokens);

  const message = {
    notification: {
      image: 'https://ca.slack-edge.com/T02974L40-U05F6M1RAKB-e6453707e056-512',
      title: 'Test app นี้เป็นอันตรายต่อเครื่อง ionic',
      body: 'test send node cli',
    },
  };

  for (const token of tokens) {
    try {
      const response = await admin.messaging().send({ ...message, token });
      console.log('Successfully sent message to', token, response);
    } catch (error) {
      console.log('Error sending message to', token, error);
    }
  }
}

sendToAllWebTokens();