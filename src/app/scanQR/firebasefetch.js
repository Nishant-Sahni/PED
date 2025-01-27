import { auth } from "../../lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";

/**
 * Gets the current authenticated user and calls the callback with user details.
 * @param {Function} callback - Function to handle the authenticated user or null if no user.
 */
export function getCurrentUser(callback) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            callback({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
            });
        } else {
            // User is signed out
            callback(null);
        }
    });
}
