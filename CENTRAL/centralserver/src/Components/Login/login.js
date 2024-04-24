import React, { useState } from 'react';
import './darkTheme.css'; // Importar el archivo CSS de tema oscuro
import Home from '../Home/Home.js';




const Login = () => {
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loginsuccesfully, setloginsuccessfully]=useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            if (!response.ok) {
                throw new Error('Failed to log in');
            }
            
            const data = await response.json();

            console.log(data.token)
            if(data.token){
                localStorage.setItem('token', data.token)
                setloginsuccessfully(true);
            } else {
                setloginsuccessfully(false);
            }
            
             // Imprimir el token en la consola

        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <>{loginsuccesfully?<Home/>:
            <div className="login-container">
                <form className="login-form">
                    <label htmlFor="username">Username:</label>
                    <input 
                        onChange={(event) => setUsername(event.target.value)}
                        type="text" 
                        id="username" 
                        name="username" 
                    />
                    <label htmlFor="password">Password:</label>
                    <input 
                        onChange={(event) => setPassword(event.target.value)}
                        type="password" 
                        id="password" 
                        name="password" 
                    />
                    <button onClick={handleLogin} type="submit">Login</button>
                </form>
            </div>
        }</>
    );
}

export default Login;
