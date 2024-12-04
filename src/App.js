import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Route, Routes, useLocation, Link } from 'react-router-dom';
import ProjectBorder from './pages/ProjectBorder';
import TaskList from './pages/TaskList';
import Home from './pages/Home';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSelector } from 'react-redux';

import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import Search from './components/Search';

function App() {
  const location = useLocation();
  const projectTitle =
    location.pathname.startsWith('/projects/') &&
    location.pathname !== '/projects'
      ? decodeURIComponent(location.pathname.split('/projects/')[1])
      : 'TODO';

  const tasks = useSelector((state) => state.taskList.tasks || []);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const shouldShowSearch =
    location.pathname === '/projects' ||
    location.pathname.startsWith('/projects');

  const shouldShowList =
    location.pathname.startsWith('/projects') &&
    location.pathname !== '/projects';

  const handleSearch = (query) => {
    const result = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        task.id.toString().includes(query)
    );
    setFilteredTasks(result);
    setIsSearching(true);
  };

  const resetSearch = () => {
    setFilteredTasks([]);
    setIsSearching(false);
    setSearchQuery('');
  };

  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          {shouldShowList && (
            <IconButton
              size='large'
              edge='start'
              color='inherit'
              aria-label='menu'
              sx={{ mr: 2 }}
            >
              <Link to={`/projects/`}>
                <MenuIcon />
              </Link>
            </IconButton>
          )}

          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            {projectTitle}
          </Typography>

          {shouldShowSearch && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Search
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
                resetSearch={resetSearch}
              />
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <DndProvider backend={HTML5Backend}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/projects' element={<ProjectBorder />} />
          <Route
            path='/projects/:title'
            element={
              <TaskList
                searchQuery={searchQuery}
                isSearching={isSearching}
                filteredTasks={filteredTasks}
                resetSearch={resetSearch}
              />
            }
          />
        </Routes>
      </DndProvider>
    </>
  );
}

export default App;
