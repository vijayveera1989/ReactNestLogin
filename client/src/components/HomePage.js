// Welcome.js
import React from "react";
import { Container, Typography, Box ,Button} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { clearUserInfo } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import * as CONSTANTS from "../common/constants.js";

const HomePage = () => {

  const { email, name } = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearUserInfo());
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10}>
        <Typography color="blue" variant="h6">
           {CONSTANTS.WELCOME} <b>{name}!</b>
        </Typography>
        <Typography color="black">Email: {email}</Typography>
        <Typography>{CONSTANTS.SUCCESSMSG}</Typography>
        <Button variant="contained" color="primary" onClick={handleLogout}>LogOut</Button>
      </Box>
    </Container>
  );
};

export default HomePage;
