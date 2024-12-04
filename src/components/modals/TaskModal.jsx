import React from 'react';
import ReactQuill from 'react-quill';
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  MenuItem,
} from '@mui/material';

const TaskModal = ({
  isModalOpen,
  closeModal,
  taskTitle,
  setTaskTitle,
  description,
  setDescription,
  priority,
  setPriority,
  handleAddOrUpdateTask,
  editingTask,
  deadLineDate,
  setDeadLineDate,
}) => {
  const handleSave = () => {
    handleAddOrUpdateTask();
    closeModal();
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '600px',
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: '12px',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal open={isModalOpen} onClose={closeModal}>
      <Box sx={style}>
        <Typography variant='h5' component='h2' gutterBottom>
          {editingTask ? 'Редактировать задачу' : 'Создать задачу'}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
            {editingTask ? 'Задача:' : 'Название задачи'}
          </Typography>
          <TextField
            fullWidth
            variant='outlined'
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder='Введите задачу'
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontWeght: 'bold', mb: 1 }}>Приоритет:</Typography>
          <TextField
            select
            fullWidth
            variant='outlined'
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <MenuItem value='low'>Низкий</MenuItem>
            <MenuItem value='medium'>Средний</MenuItem>
            <MenuItem value='high'>Высокий</MenuItem>
          </TextField>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Описание:</Typography>
          <Box
            sx={{
              border: '1px solid #ccc',
              borderRadius: '1px',
              overflow: 'hidden',
              p: 2,
            }}
          >
            <ReactQuill
              value={description}
              onChange={setDescription}
              placeholder='Введите описание'
            />
          </Box>
        </Box>
        {editingTask && (
          <Box sx={{ mb: 3 }}>
            <Typography>
              Дата создания: <strong>{editingTask.createdAt}</strong>
            </Typography>
          </Box>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
            Крайний срок:
          </Typography>
          <TextField
            fullWidth
            type='date'
            variant='outlined'
            value={deadLineDate}
            onChange={(e) => setDeadLineDate(e.target.value)}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button
            onClick={closeModal}
            variant='outlined'
            color='error'
            fullWidth
          >
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            variant='contained'
            color='primary'
            fullWidth
          >
            {editingTask ? 'Сохранить изменения' : 'Создать задачу'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TaskModal;
