import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';

const Home = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeigth: '100vh',
        textAlign: 'center',
      }}
    >
      <h1>Todo-List</h1>
      <Button variant='contained'>
        <Link
          to='/projects'
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          Project`s
        </Link>
      </Button>
    </Box>
  );
};

export default Home;
