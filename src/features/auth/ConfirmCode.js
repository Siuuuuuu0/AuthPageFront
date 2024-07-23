import React, { useState, useRef } from 'react'
import { useConfirmCodeMutation } from './authApiSlice'
import { setCredentials } from './authSlice'
import { PulseLoader } from 'react-spinners'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { setAccount } from '../account/accountSlice'

const ConfirmCode = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const errRef = useRef()

    const [code, setCode] = useState('')
    const [errMsg, setErrMsg] = useState('')

    const [confirm,  { isLoading }] = useConfirmCodeMutation()

    const userOrMail = useSelector((state) => state.auth.userOrMail);

    const handleSubmit = async(e) =>{
        try {
            const { accessToken, account } = await confirm({code, userOrMail}).unwrap()
            dispatch(setCredentials({ accessToken }))
            dispatch(setAccount({account}))
            setCode('')
            navigate('/dash')
        } catch (err) {
            setErrMsg(err.data?.message);
            // errRef.current.focus();
        }
    }

    const handleCodeInput = (e) => setCode(e.target.value)

    const errClass = errMsg ? "errmsg" : "offscreen"

    if (isLoading) return <PulseLoader color={"#FFF"} />

    return (
        <section className="public">
            <header>
                <h1>Confirm Code</h1>
            </header>
            <main className="login">
                <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>

                <form className="form" onSubmit={handleSubmit}>
                    <label htmlFor='Email Code'>
                        <input
                            className="form__input"
                            type="code"
                            id="code"
                            onChange={handleCodeInput}
                            value={code}
                            required
                        />
                        
                    </label>
                    <button className="form__submit-button">Confirm Code</button>
                </form>
            </main>
            <footer>
                <Link to="/">Back to Home</Link>
            </footer>
        </section>
    )
}

export default ConfirmCode