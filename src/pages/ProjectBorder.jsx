import React, { useState } from 'react';
import {
  addTodoProject,
  deleteTodoProject,
} from '../redux/slices/projectListSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DeleteIcon from '@mui/icons-material/Delete';

import {
  IconButton,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  Typography,
  ListItemText,
} from '@mui/material';

const ProjectBorder = () => {
  const [projectTitle, setPtojectTitle] = useState('');
  const [addProjectButton, setAddProjectButton] = useState(false);

  const projects = useSelector((state) => state.projectList.projects);
  const dispatch = useDispatch();

  const onChange = (e) => {
    setPtojectTitle(e.target.value);
  };

  const handlAddProject = () => {
    if (projectTitle.trim() === '') return;
    dispatch(addTodoProject({ title: projectTitle }));
    setPtojectTitle('');
    setAddProjectButton(!addProjectButton);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeigth: '100vh',
        textAlign: 'center',
        marginTop: '10px',
      }}
    >
      <Button
        onClick={() => setAddProjectButton(!addProjectButton)}
        variant='outlined'
        endIcon={<NoteAddIcon />}
      >
        Добавить проект
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'colum', marginTop: '10px' }}>
        {addProjectButton && (
          <>
            <TextField
              id='outlained-basic'
              label='Введите имя проекта!'
              variant='outlined'
              value={projectTitle}
              onChange={onChange}
            />

            <Button onClick={handlAddProject} variant='outlined'>
              Создать проект
            </Button>
          </>
        )}
      </Box>
      {projects.length > 0 ? (
        <Typography variant='h5'>Список проектов</Typography>
      ) : (
        ''
      )}
      <List
        sx={{
          width: '100%',
          maxWidth: '600px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
          padding: '16px',
          margin: '0 auto',
          overflowY: 'auto',
          maxHeight: '400px',
        }}
      >
        {projects.map((project) => {
          return (
            <ListItem
              disableGutters
              key={project.id}
              secondaryAction={
                <IconButton
                  sx={{ margin: 0 }}
                  edge='end'
                  aria-label='delete'
                  onClick={() =>
                    dispatch(deleteTodoProject({ id: project.id }))
                  }
                >
                  <DeleteIcon />
                </IconButton>
              }
              sx={{
                backgroundColor: 'white',
                borderRadius: '4px',
                margin: '8px 0',
                padding: '8px 16px',
                '&:hover': {
                  backgroundColor: '#e0e0e0', // Подсветка при наведении
                },
              }}
            >
              <ListItemText
                primary={
                  <Link
                    to={`/projects/${project.title}`}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    {project.title}
                  </Link>
                }
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default ProjectBorder;
