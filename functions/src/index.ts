import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

const db = admin.firestore();

// Create a new function which is triggered on changes to /status/{uid}
exports.onUserStatusChanged = functions.database
  .ref("/status/{uid}")
  .onUpdate(async (change, context) => {
    // Get the data written to Realtime Database
    const eventStatus = change.after.val();

    if (eventStatus.status === "offline") {
      const userGamesToDeleteDocs: any[] = [];

      // TODO: improve query
      //  Get instant games where user is alone
      db.collection("games")
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            console.log("All games scan: ", doc.data().id);
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
      functions.logger.log("Games to delete:", userGamesToDeleteDocs);

      // It is likely that the Realtime Database change that triggered
      // this event has already been overwritten by a fast change in
      // online / offline status, so we'll re-read the current data
      // and compare the timestamps.
      const statusSnapshot = await change.after.ref.once("value");
      const status = statusSnapshot.val();

      // If the current timestamp for this data is newer than
      // the data that triggered this event, we exit this function.
      if (status.last_changed > eventStatus.last_changed) {
        return null;
      }

      const batch = db.batch();
      // delete all games
      userGamesToDeleteDocs.forEach(gameDoc => {
        functions.logger.log("Deleting game doc", gameDoc);
        functions.logger.log("Deleting subcollection player doc", gameDoc.ref.collection("players").doc(context.params.uid));
        batch.delete(gameDoc.ref);
        // delete also subcollections
        batch.delete(gameDoc.ref.collection("players").doc(context.params.uid));
      });

      return batch.commit();
    } else {
      return null;
    }
  });
