import React, { useState,useEffect } from 'react';
import {useAppContext} from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';


import './LoginPage.css';

function LoginPage() {
    const [ incorrect, setIncorrect] = useState("");  
    const navigate = useNavigate();
    const bearerToken = sessionStorage.getItem('auth-token');
    const { setIsLoggedIn } = useAppContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    if(bearerToken ){
        navigate('/app');
    }
    const handleLogin = async (e) => {
       
        const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });
        const json = await response.json();
        if (json.authtoken) {
            sessionStorage.setItem('auth-token', json.authtoken);
            sessionStorage.setItem('name', json.firstName);
            sessionStorage.setItem('email', json.email);
            setIsLoggedIn(true);
            navigate('/app');
        } else {
            document.getElementById("email").value="";
            document.getElementById("password").value="";
            setIncorrect("Wrong email or password. Try again.");
        //Below is optional, but recommended - Clear out error message after 2 seconds
            setTimeout(() => {
              setIncorrect("");
            }, 2000);
          }

        



}


    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Login</h2>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="text"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                           <span style={{color:'red',height:'.5cm',display:'block',fontStyle:'italic',fontSize:'12px'}}>{incorrect}</span>
                        </div>
                        {/* Include appropriate error message if login is incorrect*/}
                        <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>Login</button>
                        <p className="mt-4 text-center">
                            New here? <a href="/app/register" className="text-primary">Register Here</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;