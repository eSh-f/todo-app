import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className='wrapper'>
      <h1>Todo-List</h1>
      <Link to='/projects'> Project`s</Link>
    </div>
  );
};

export default Home;
