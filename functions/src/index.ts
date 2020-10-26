import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

const db = admin.firestore();

// Create a new function which is triggered on changes to /status/{uid}
exports.onUserStatusChanged = functions.database
  .ref("/status/{uid}")
  .onUpdate(async (change, context) => {
    try {
      const eventStatus = change.after.val();

      if (eventStatus.status === "offline") {
        const batch = db.batch();
        // look for user instant games
        const snapshot = await db
          .collection("games")
          .where("playerIds", "array-contains", context.params.uid)
          .where("isInstant", "==", true)
          .get();
        // select the games where the player is alone
        snapshot.forEach(doc => {
          if (doc.data().playerIds.length === 1) {
            // delete games & subcollections
            batch.delete(doc.ref);
            batch.delete(doc.ref.collection("players").doc(context.params.uid));
            return null;
          } else {
            return null;
          }
        });

        return batch
          .commit()
          .then(_ => console.log("all good"))
          .catch(error => console.log(error));
      }
      return null;
    } catch (error) {
      console.log("Error ", error);
    }
  });


exports.notifyUser = functions.firestore
.document('messages/{messageId}')
.onCreate(event => {

const message = event.data();
const userId = message.recipientId;

// Message details for end user
const payload = {
    notification: {
        title: 'New message!',
        body: `${message.senderId} sent you a new message`,
        icon: 'https://goo.gl/Fz9nrQ'
      }
};

// ref to the parent document
const userRef = db.collection('users').doc(userId);


// get users tokens and send notifications
return userRef.get()
    .then(snapshot => snapshot.data() )
    .then(user => {
      if(user) {

        const tokens = user.fcmTokens ? Object.keys(user.fcmTokens) : [];

        if (!tokens.length) {
           throw new Error('User does not have any tokens!');
        }

        return admin.messaging().sendToDevice(tokens, payload);
    } else {
      return null;
    }})
    .catch(err => console.log(err) )
});
