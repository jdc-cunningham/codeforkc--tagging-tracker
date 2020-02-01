import React, { useRef, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './Login.scss';
import taggingTrackerLogo from './../../assets/images/tagging-tracker-logo.PNG';
import axios from 'axios';

const Login = (props) => {
    const usernameInput = useRef(null);
    const passwordInput = useRef(null);
    const loginBtn = useRef(null);
    const history = useHistory();
    const [loginProcessing, setLoginProcessing] = useState(false);

    const login = () => {
        const username = usernameInput.current.value;
        const password = passwordInput.current.value;

        if (!username || !password) {
            alert('Please fill in both username and password to login');
            return;
        }

        setLoginProcessing(true);

        axios.post('/login-user', {
            username,
            password
        })
        .then((res) => {
            if (typeof res.data.token !== "undefined" && res.data.token) {
                props.updateToken(res.data.token);
            }
        })
        .catch((err) => {
            alert('failed to login'); // 401 goes through here too
            setLoginProcessing(false);
        });
    }

    useEffect(() => {
        if (props.token) {
            history.push("/addresses");
        }
    });

    return(
        <div className="tagging-tracker__login">
            <img alt="tagging tracker logo" className="tagging-tracker__login-logo" src={ taggingTrackerLogo } />
            <div className="tagging-tracker__login-fields">
                <input type="text" name="username" placeholder="username" ref={ usernameInput } />
                <input type="password" name="password" placeholder="passwrod" ref={ passwordInput } />
                <button type="button" onClick={ login } ref={ loginBtn } disabled={ loginProcessing ? true : false }>Login</button>
            </div>
        </div>
    )
}

export default Login;