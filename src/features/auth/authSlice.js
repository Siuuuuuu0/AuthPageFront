import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: { token: null, userOrMail : null, googleId : null },
    reducers: {
        setCredentials: (state, action) => {
            const { accessToken } = action.payload
            state.token = accessToken
        },
        logOut: (state, action) => {
            state.token = null
        },
        setEmailOrUser : (state, action) => {
            const { userOrMail } = action.payload
            state.userOrMail = userOrMail
        }, 
        setGoogleId : (state, action) => {
            const {googleId} = action.payload
            state.googleId = googleId
        }
    }
})

export const { setCredentials, logOut, setEmailOrUser, setGoogleId } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token