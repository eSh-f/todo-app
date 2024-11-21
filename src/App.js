import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProjectBorder from './pages/ProjectBorder';
import TaskList from './pages/TaskList';
import Home from './pages/Home';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/projects' element={<ProjectBorder />} />
        <Route path='/projects/:title' element={<TaskList />} />
      </Routes>
    </DndProvider>
  );
}

export default App;
