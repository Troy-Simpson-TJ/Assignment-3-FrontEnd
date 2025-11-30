import {useState} from "react";
import {api} from "../api";
import {useAuth} from "../context/authContext";
import { useNavigate } from "react-router-dom";

export default function Login(){
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const {login} = useAuth();
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const data = await api.login(form);
            login(data.user, data.token);
            navigate("/projects");
        }
        catch (err){
            setMessage(err.message);
        }
    };

    return(
        <div className="page">
            <div className="auth-container">
                <h2>Login</h2>
                {message && <p>{message}</p>}

                <form onSubmit={handleSubmit}>
                <input name="email" placeholder="Email" onChange={handleChange} />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} />
                <button type="submit">Sign In</button>
                </form>
            </div>
        </div>
    );
}