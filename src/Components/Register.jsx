import {useState} from "react";
import {api} from "../api";

export default function Register(){
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await api.signup(form);
            setMessage("Account created!")
        }
        catch (err){
            setMessage(err.message);
        }
    };

    return(
        <div className="auth-container">
            <h2>Create Account</h2>
            {message && <p>{message}</p>}

            <form onSubmit={handleSubmit}>
                <input name="firstName" placeholder="First Name" onChange={handleChange} />
                <input name="lastName" placeholder="Last Name" onChange={handleChange} />
                <input name="email" placeholder="Email" onChange={handleChange} />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}