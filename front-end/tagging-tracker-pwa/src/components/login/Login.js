import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import './Login.scss';
import taggingTrackerLogo from './../../assets/images/tagging-tracker-logo.PNG';

const Login = () => {
    const usernameInput = useRef(null);
    const passwordInput = useRef(null);
    const loginBtn = useRef(null);
    const history = useHistory();

    const login = () => {
        history.push("/addresses"); // as if you logged in
    }

    return(
        <div className="tagging-tracker__login">
            <img alt="tagging tracker logo" className="tagging-tracker__login-logo" src={ taggingTrackerLogo } />
            <div className="tagging-tracker__login-fields">
                <input type="text" name="username" placeholder="username" ref={ usernameInput } />
                <input type="password" name="password" placeholder="passwrod" ref={ passwordInput } />
                <button type="button" onClick={ login } ref={ loginBtn }>Login</button>
            </div>
        </div>
    )
}

export default Login;