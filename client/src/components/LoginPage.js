// Login.js
import React, { useState } from 'react';
import { Button, TextField, Container, Typography ,Box} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {fetchUserDetails} from "../services/userService.js";
import {LOGIN_URL} from "../common/constants.js";
import {setUserAuthenticated,setUserInfo} from "../store/authSlice.js";
import * as CONSTANTS from "../common/constants.js";

const Login = () => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getUserInfo = async () => {
    try {
      const userDetails = await fetchUserDetails();
      if (userDetails) {
        dispatch(setUserInfo(userDetails));
        dispatch(setUserAuthenticated(true));
        // Redirect to home page
        navigate("/home");
      } else {
        dispatch(setUserAuthenticated(false));
        setErrorMessage("Login Failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Login Failed");
    }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);    
      try {
        const response = await fetch(LOGIN_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
    
        const data = await response.json();    
        if (response.ok) {
          localStorage.setItem("token", data.token); // Store token in local storage
          getUserInfo();
        } else {
          console.error('Error:', data.message);
          setErrorMessage("Login Failed");
        }
      } catch (error) {
        console.error('Error:', error);
        setErrorMessage("Login Failed");
      } finally {
        setLoading(false);
      }
    };
  
  return (
    <Container maxWidth="sm">
      <Box mt={10}>
        <Typography variant="h4">{CONSTANTS.LOGIN}</Typography>
        {loading && (
          <Typography variant="h7" color="blue">
           {CONSTANTS.PLEASE_WAIT}
          </Typography>
        )}
        {errorMessage && (
          <Typography variant="h6" color="red">
            {errorMessage}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary">
          {CONSTANTS.LOGIN}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
