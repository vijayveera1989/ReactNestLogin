import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    userInfo:{},
    userToken:null
  },
  reducers: {
    setUserAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    clearUserAuthenticated: (state) => {
      state.isAuthenticated = false;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    clearUserInfo: (state) => {
      state.userInfo = {};
    },
    setUserToken:(state, action) => {
      state.userToken = action.payload;
    },
    clearUserToken:(state)=>{
      state.userToken = null
    }
  },
});

export const { setUserAuthenticated, clearUserAuthenticated,setUserInfo,clearUserInfo } = authSlice.actions;

export const isAuthenticated = (state) => state.isAuthenticated;
export const getUserInfo = (state) => state.userInfo;

export default authSlice.reducer;
