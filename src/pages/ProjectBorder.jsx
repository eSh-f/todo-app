import React, { useState } from 'react';
import '../scss/projects.scss';
import {
  addTodoProject,
  deleteTodoProject,
} from '../redux/slices/projectListSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

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
    <div className='wrapper'>
      <h1>Список проектов</h1>
      <button
        className='add-button'
        onClick={() => setAddProjectButton(!addProjectButton)}
      >
        Добавить проект
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke-width='1.5'
          stroke='currentColor'
          style={{
            heigth: '16px',
            width: '16px',
            paddingLeft: '5px',
            marginRight: '-5px',
            marginBottom: '-3',
          }}
        >
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            d='M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
          />
        </svg>
      </button>
      <div>
        {addProjectButton && (
          <>
            <input
              className='input-project'
              type='text'
              value={projectTitle}
              onChange={onChange}
              placeholder='Введите имя проекта!'
            />
            <button onClick={handlAddProject}> Создать проект</button>
          </>
        )}
      </div>
      <ol className='project-list'>
        {projects.map((project) => {
          return (
            <li key={project.id} draggable={true}>
              <Link to={`/projects/${project.title}`}> {project.title}</Link>
              <button
                onClick={() => {
                  dispatch(deleteTodoProject({ id: project.id }));
                }}
              >
                🗑
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default ProjectBorder;
