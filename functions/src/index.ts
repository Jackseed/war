import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

// Since this code will be running in the Cloud Functions environment
// we call initialize Firestore without any arguments because it
// detects authentication from the environment.
const db = admin.firestore();

// Create a new function which is triggered on changes to /status/{uid}
// Note: This is a Realtime Database trigger, *not* Cloud Firestore.
exports.onUserStatusChanged = functions.database
  .ref("/status/{uid}")
  .onUpdate(async (change, context) => {
    // Get the data written to Realtime Database
    const eventStatus = change.after.val();

    if (eventStatus.status === "offline") {
      const userGamesToDeleteDocs: any[] = [];

      //  Get instant games where user is alone
      db.collection("games")
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            if (
              doc.data().playerIds.includes(context.params.uid) &&
              doc.data().playerIds.length === 1 &&
              doc.data().isInstant
            ) {
              userGamesToDeleteDocs.push(doc);
            }
          });
        })
        .catch(err => {
          console.log("Error getting documents", err);
        });

      console.log(userGamesToDeleteDocs);
      // It is likely that the Realtime Database change that triggered
      // this event has already been overwritten by a fast change in
      // online / offline status, so we'll re-read the current data
      // and compare the timestamps.
      const statusSnapshot = await change.after.ref.once("value");
      const status = statusSnapshot.val();
      console.log(status, eventStatus);
      // If the current timestamp for this data is newer than
      // the data that triggered this event, we exit this function.
      if (status.last_changed > eventStatus.last_changed) {
        return null;
      }

      // delete all games
      let batch = db.batch();

      userGamesToDeleteDocs.forEach(gameDoc => {
        batch.delete(gameDoc.ref);
        // delete also subcollections
        gameDoc.docs.forEach((doc: admin.firestore.DocumentSnapshot) => {
          batch.delete(doc.ref);
        });
      });

      return batch.commit();
    } else {
      return null;
    }
  });
