import { get, set, ref, query, equalTo, orderByChild, update, remove } from 'firebase/database';
import { db } from '../config/firebase-config.js';

export const getUserByHandle = (handle) => {
  return get(ref(db, `users/${handle}`));
};

export const createUserHandle = (handle, uid, email) => {
  return set(ref(db, `users/${handle}`), {
    handle,
    uid,
    email,
    createdOn: new Date().toISOString(),
    //Ani: adding a role property to the user object
    isAdmin: false,
    isBlocked: false
  });
};

export const getUserData = (uid) => {
  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export const updateUserHandle = (handle, updates) => {
  return update(ref(db, `users/${handle}`), updates);
  //return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export const checkAdminStatus = (uid) => {
  return get(ref(db, `users/${uid}/isAdmin`));
};



 export const toggleUserBlockStatus = async (handle, isCurrentlyBlocked) => {
    try {
        await update(ref(db, `users/${handle}`), { isBlocked: !isCurrentlyBlocked });
        console.log('Block status updated successfully:', !isCurrentlyBlocked);
    } catch (error) {
        console.error('Error updating block status:', error);
        throw error; // Rethrow or handle as needed
    }
};

// Function to fetch all users
export const fetchAllUsers = async () => {
    const snapshot = await get(ref(db, 'users'));
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        return {};
    }
};

export const makeAdmin = async (handle) => {
await update(ref(db, `users/${handle}`), { isAdmin: true });
}

export const reauthenticateUser = async (email, currentPassword) => {
    const user = auth.currentUser;
    if (user) {
        const credential = signInWithEmailAndPassword(auth, email, currentPassword);
        return user.reauthenticateWithCredential(await credential);
    }
    throw new Error('User not authenticated');
};

export const updateUserEmail = async (newEmail) => {
    const user = auth.currentUser;
    if (user) {
        await updateEmail(user, newEmail);
        await update(ref(db, `users/${user.uid}`), { email: newEmail });
    } else {
        throw new Error('User not authenticated');
    }
};

export const updateUserPassword = async (newPassword) => {
    const user = auth.currentUser;
    if (user) {
        await updatePassword(user, newPassword);
    } else {
        throw new Error('User not authenticated');
    }
};


