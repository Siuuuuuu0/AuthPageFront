import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useConfirmResetPasswordMutation } from './authApiSlice';
import PulseLoader from 'react-spinners/PulseLoader';

const ConfirmReset = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = new URLSearchParams(location.search).get('token');
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [isSent, setIsSent] = useState(false);

    const [confirmResetPassword, { isLoading }] = useConfirmResetPasswordMutation();

    const errRef = useRef();

    useEffect(() => {
        setErrMsg('');
    }, [password, confirmPassword]);

    const handlePasswordInput = (e) => setPassword(e.target.value);
    const handleConfirmPasswordInput = (e) => setConfirmPassword(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrMsg('Passwords do not match');
            return;
        }
        try {
            await confirmResetPassword({ token, password }).unwrap();
            setIsSent(true);
            setPassword('');
            setConfirmPassword('');
            navigate('/login');
        } catch (err) {
            setErrMsg(err.data?.message || 'An error occurred');
        }
    };

    const errClass = errMsg ? "errmsg" : "offscreen";

    if (isLoading) return <PulseLoader color={"#FFF"} />;

    return (
        <section className="public">
            <header>
                <h1>Reset Password</h1>
            </header>
            <main className="login">
                <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>

                <form className="form" onSubmit={handleSubmit}>
                    <label htmlFor="password">New Password:</label>
                    <input
                        className="form__input"
                        type="password"
                        id="password"
                        onChange={handlePasswordInput}
                        value={password}
                        required
                    />

                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        className="form__input"
                        type="password"
                        id="confirmPassword"
                        onChange={handleConfirmPasswordInput}
                        value={confirmPassword}
                        required
                    />
                    <button className="form__submit-button">Reset Password</button>
                </form>
            </main>
        </section>
    );
};

export default ConfirmReset;
