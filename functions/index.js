const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

// scheduled to run every Sunday at 23:59 UTC (example)
exports.pickBestOfWeek = functions.pubsub.schedule('0 23 * * 0').timeZone('UTC').onRun(async (context) => {
  const oneWeekAgo = admin.firestore.Timestamp.fromDate(new Date(Date.now() - 7*24*60*60*1000));

  const snaps = await db.collection('screenshots')
    .where('createdAt', '>=', oneWeekAgo)
    .orderBy('createdAt', 'desc')
    .get();

  const arr = [];
  snaps.forEach(doc => arr.push({ id: doc.id, ...doc.data() }));

  // sort by likes desc
  arr.sort((a,b) => (b.likes || 0) - (a.likes || 0));

  const topN = arr.slice(0,5); // top 5
  const ids = topN.map(s=>s.id);

  await db.collection('weeklyWinners').doc('latest').set({
    weekOf: admin.firestore.Timestamp.now(),
    ids,
    generatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  console.log('Picked winners:', ids);
  return null;
});
