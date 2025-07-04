import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
setUser: (state, action) => {
      state.user = JSON.parse(JSON.stringify(action.payload))
      state.isAuthenticated = !!action.payload
    },
    clearUser: (state) => {
      state.user = null
      state.isAuthenticated = false
},
  },
})

// Selector to check if current user is admin
export const selectIsAdmin = (state) => {
  return state.user?.user?.role === 'admin' || 
         state.user?.user?.userType === 'admin' ||
         state.user?.user?.isAdmin === true ||
         false
}

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer