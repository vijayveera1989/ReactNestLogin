import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';
import Login from './components/LoginPage';
import Register from './components/RegisterPage';
import HomePage from './components/HomePage';
import ProtectedRoute from './ProtectedRoute';
import ErrorPage from './components/ErrorPage';

function App() {
  return (
    <Router>
      <Container maxWidth="md" className='app'>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
          </Route>
          <Route path='*' element={<ErrorPage />}/>
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
