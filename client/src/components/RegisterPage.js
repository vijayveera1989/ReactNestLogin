// Register.js
import React, { useState } from "react";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import * as CONSTANTS from "../common/constants.js";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate the passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);

    // Calling register API
    try {
      const response = await fetch(CONSTANTS.REGISTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setIsRegistered(true);
      } else {
        // Handle registration errors
        setIsRegistered(false);
        setErrorMessage(data.message);   
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage('An error occurred during registration. Please try again.');
      console.error("Error:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10}> 
      {isRegistered && (
        <Typography variant="h6" color="blue">
          Registered succesfully. Please click
          <Link to="/login"> Login </Link> to enter the application
        </Typography>
      )}
      {!isRegistered && <Typography variant="h4">{CONSTANTS.REGISTER}</Typography>}
      {loading && (
        <Typography variant="h6" color="blue">
         {CONSTANTS.REGISTERING}
        </Typography>
      )}
      {errorMessage && (
              <Typography variant="h6" color="red">
                {errorMessage}
              </Typography>
      )}
      {!isRegistered && (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary">
            {CONSTANTS.REGISTER}
          </Button>
        </form>
      )}
      </Box>
    </Container>
  );
};

export default Register;
