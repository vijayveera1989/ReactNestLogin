import React from 'react';
import { Container, Typography } from '@mui/material';
import * as CONSTANTS from "../common/constants.js";

const ErrorPage = () => {
  return (
    <Container maxWidth="md" className='error-page'>
      <Typography variant="h1" component="h2" gutterBottom>        
        {CONSTANTS.CODE}
      </Typography>
      <Typography variant="h5" component="h3" gutterBottom>        
        {CONSTANTS.NOF}
      </Typography>
      <Typography variant="body1">
        {CONSTANTS.SRY}
      </Typography>
    </Container>
  );
};

export default ErrorPage;
