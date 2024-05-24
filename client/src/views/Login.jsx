import { useContext, useEffect, useState } from "react"
import Button from "../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { loginUser } from "../services/auth.service";
import { checkAdminStatus } from "../services/users.service";

export default function Login() {
    const { user, setAppState } = useContext(AppContext);
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user) {
            navigate(location.state?.from.pathname || '/');
        }
    }, [user]);

    const login = async() => {

        try {
        const { user } = await loginUser(form.email, form.password);
         console.log("Logged in user UID:", user.uid);
        //Ani: Checking if the user is an admin
        const isAdmin = await checkAdminStatus(user.uid);
    
        if (isAdmin === true) {
            navigate('/admin-dashboard')
        } else {
            navigate('/');
        }
        setAppState({ user, isAdmin, userData: null });
    } catch (error) {
        console.error('Login failed:', error)
    }
    };

    const updateForm = prop => e => {
        setForm({
          ...form,
          [prop]: e.target.value,
        });
      };

    return (
        <div>
            <h1>Login</h1>
            <label htmlFor="email">Email: </label>
            <input value={form.email} onChange={updateForm('email')} type="text" name="email" id="email" />
            <label htmlFor="password">Password: </label>
            <input value={form.password} onChange={updateForm('password')} type="password" name="password" id="password" /> <br /> <br /><br />
            <Button onClick={login}>Login</Button>
        </div>
    )
}
