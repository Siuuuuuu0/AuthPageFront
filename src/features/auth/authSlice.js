import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: { token: null, userOrMail : null },
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
        }
    }
})

export const { setCredentials, logOut, setEmailOrUser } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token