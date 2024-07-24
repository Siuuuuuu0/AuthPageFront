import { useState, useEffect } from "react";
import { useUpdateAccountMutation, useDeleteAccountMutation } from "./accountApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const Settings = ({ account }) => {
    
    const [error, setError] = useState('');
    const [isError, setIsError] = useState('');

    const [updateAccount, { isLoading }] = useUpdateAccountMutation();
    const [deleteAccount] = useDeleteAccountMutation();

    const navigate = useNavigate();

    const [username, setUsername] = useState(account.username);
    const [validUsername, setValidUsername] = useState(false);
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [email, setEmail] = useState(account.email);
    const [validEmail, setValidEmail] = useState(false);
    const [isSent, setIsSent] = useState(false)

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
    }, [password]);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    const onUsernameChanged = e => setUsername(e.target.value);
    const onPasswordChanged = e => setPassword(e.target.value);
    const onEmailChanged = e => setEmail(e.target.value);

    const onUpdateUsernameClicked = async () => {
        try {
            await updateAccount({ id: account.id, toUpdate : {username} }).unwrap();
        } catch (err) {
            console.log(err);
            setIsError(true);
            setError(err.data?.message || 'Failed to update username');
        }
    };

    const onUpdatePasswordClicked = async () => {
        try {
            await updateAccount({ id: account.id, toUpdate : {password} }).unwrap();
            setIsSent(true);
        } catch (err) {
            console.log(err);
            setIsError(true);
            setError(err.data?.message || 'Failed to update password');
        }
    };

    const onUpdateEmailClicked = async () => {
        try {
            await updateAccount({ id: account.id, toUpdate : {email} }).unwrap();
            setIsSent(true);
        } catch (err) {
            console.log(err);
            setIsError(true);
            setError(err.data?.message || 'Failed to update email');
        }
    };

    const onDeleteAccountClicked = async () => {
        try {
            await deleteAccount({ id: account.id}).unwrap();
            setEmail('')
            setPassword('')
            setUsername('')
            navigate('/')
        } catch (err) {
            console.log(err);
            setIsError(true);
            setError(err);
        }
    };

    const canSaveUsername = validUsername && !isLoading;
    const canSavePassword = validPassword && !isLoading;
    const canSaveEmail = validEmail && !isLoading;

    const errClass = isError ? "errmsg" : "offscreen";
    const validUserClass = !validUsername ? 'form__input--incomplete' : '';
    const validPwdClass = password && !validPassword ? 'form__input--incomplete' : '';
    const validEmailClass = email && !validEmail ? 'form__input--incomplete' : '';

    const errContent = error?.data?.message ?? '';

    return (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Settings</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Delete Account"
                            onClick={onDeleteAccountClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>
                
                <label className="form__label" htmlFor="username">
                    Username: <span className="nowrap">[3-20 upper and lowercase letters]</span>
                </label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={onUsernameChanged}
                />
                <button
                    className="icon-button"
                    title="Save Username"
                    onClick={onUpdateUsernameClicked}
                    disabled={!canSaveUsername}
                >
                    <FontAwesomeIcon icon={faSave} />
                </button>

                <label className="form__label" htmlFor="password">
                    Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span>
                </label>
                <input
                    className={`form__input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />
                <button
                    className="icon-button"
                    title="Save Password"
                    onClick={onUpdatePasswordClicked}
                    disabled={!canSavePassword}
                >
                    <FontAwesomeIcon icon={faSave} />
                </button>

                <label className="form__label" htmlFor="email">
                    Email: <span className="nowrap">[valid email]</span>
                </label>
                <input
                    className={`form__input ${validEmailClass}`}
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={onEmailChanged}
                />
                <button
                    className="icon-button"
                    title="Save Email"
                    onClick={onUpdateEmailClicked}
                    disabled={!canSaveEmail}
                >
                    <FontAwesomeIcon icon={faSave} />
                </button>
            </form>
            {isSent && (<div>Email sent, please follow the link</div>)}
        </>
    );
};

export default Settings;
