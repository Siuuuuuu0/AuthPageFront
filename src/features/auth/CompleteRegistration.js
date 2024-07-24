import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import useTitle from "../../hooks/useTitle"
import { useCompleteRegisterMutation } from "./authApiSlice"
import { setCredentials } from './authSlice'
import { useDispatch, useSelector } from 'react-redux'
import usePersist from "../../hooks/usePersist"

//TODO : ADD NON_OPTIONAL CLASS FOR EMAIL AND PWD

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const CompleteRegister = () => {
    useTitle('New User')

    const [persist, setPersist] = usePersist()

    const dispatch = useDispatch()
    const email = useSelector((state) => state.auth.userOrMail)
    const googleId = useSelector((state) => state.auth.googleId)

    const [completeRegister, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useCompleteRegisterMutation()

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username)||username==='')
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])
    
    useEffect(() => {
        if (isSuccess) {
            setUsername('')
            setPassword('')
        }
    }, [isSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)

    const canSave = [(validUsername||username===''), validPassword].every(Boolean) && !isLoading

    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            try{
            const {accessToken} = await completeRegister({ email, password, ...(username&&{username}), ...(googleId&&{googleId})} ).unwrap()
            dispatch(setCredentials({ accessToken }))
            setPassword('')
            setUsername('')
            setValidUsername(false)
            setValidPassword(false)
            navigate('/dash')
            }catch(err){
                console.log(err)
            }
        }
    }

    const handleToggle = () => setPersist(prev => !prev)

    const errClass = isError ? "errmsg" : "offscreen"
    const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    const validPwdClass = !validPassword ? 'form__input--incomplete' : ''


    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" onSubmit={onSaveUserClicked}>
                <div className="form__title-row">
                    <h2>New User</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="username">
                    Username: <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={onUsernameChanged}
                />

                <label className="form__label" htmlFor="password">
                    Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
                <input
                    className={`form__input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />
                <label htmlFor="persist" className="form__persist">
                    <input
                        type="checkbox"
                        className="form__checkbox"
                        id="persist"
                        onChange={handleToggle}
                        checked={persist}
                    />
                    Trust This Device
                </label>

            </form>
        </>
    )

    return content
}
export default CompleteRegister