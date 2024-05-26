import { useContext, useState, useEffect } from "react";
//import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
//import { ref, set, getDatabase, get } from "firebase/database";
import { AppContext } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import { createUserHandle, getUserByHandle } from "../services/users.service";
import { registerUser } from "../services/auth.service";

export default function Register() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
    });
    const { user, setAppState } = useContext(AppContext);
    const navigate = useNavigate();
    // const auth = getAuth();
    // const database = getDatabase();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const updateForm = prop => e => {
        setForm(form => ({
            ...form,
            [prop]: e.target.value,
        }));
    };

    // const register = async () => {
    //     if (!form.username || !form.email || !form.password) {
    //         alert("Please fill in all fields.");
    //         return;
    //     }

    //     try {
    //         const usernameRef = ref(database, `users/${form.username}`);
    //         const usernameSnap = await get(usernameRef);
    //         if (usernameSnap.exists()) {
    //             alert('User with this username already exists!');
    //             return;
    //         }

    //         const credential = await createUserWithEmailAndPassword(auth, form.email, form.password);
    //         const userRef = ref(database, `users/${form.username}`);
    //         await set(userRef, {
    //             username: form.username,
    //             uid: credential.user.uid,
    //             email: form.email,
    //             createdOn: new Date().toISOString()
    //         });
    //         setAppState({ user: credential.user, userData: { username: form.username, email: form.email } });
    //         navigate('/');
    //     } catch (error) {
    //         console.error("Registration error:", error.message);
    //         alert(error.message);
    //     }
    // };

    const register = async() => {
    // TODO: validate form data
    try {
      const user = await getUserByHandle(form.username);
      if (user.exists()) {
        return console.log('User with this username already exists!');
      }
      const credential = await registerUser(form.email, form.password);
      await createUserHandle(form.username, credential.user.uid, credential.user.email);
      setAppState({ user: credential.user, userData: null });
      navigate('/');
    } catch (error) {
      if (error.message.includes('auth/email-already-in-use')) {
        console.log('User has already been registered!');
      }
    }
  };

    return (
        <div>
            <h1>Register</h1>
            <label htmlFor="username">Username:</label>
            <input value={form.username} onChange={updateForm('username')} type="text" name="username" id="username" /><br />
            <label htmlFor="email">Email:</label>
            <input value={form.email} onChange={updateForm('email')} type="email" name="email" id="email" /><br />
            <label htmlFor="password">Password:</label>
            <input value={form.password} onChange={updateForm('password')} type="password" name="password" id="password" /><br /><br />
            <button onClick={register}>Register</button>
        </div>
    );
}
