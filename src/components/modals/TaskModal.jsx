import React from 'react';
import '../../scss/Modal.scss';
import ReactQuill from 'react-quill';

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

  if (!isModalOpen) return null;
  return (
    <div className='modal-overlay' onClick={closeModal}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <button className='modal-close' onClick={closeModal}>
          X
        </button>
        <h2>{editingTask ? 'Редактировать задачу' : 'Создать задачу'}</h2>

        <div className='inpuut-task'>
          <label>
            {editingTask ? 'Задача:' : 'Название задачи'}
            <input
              type='text'
              value={taskTitle}
              onChange={(e) => {
                setTaskTitle(e.target.value);
              }}
              placeholder='Введите задачу!'
            />
          </label>
        </div>
        <div>
          <label>
            Приоритет:
            <select
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value);
              }}
            >
              <option value='low'>Низкий</option>
              <option value='medium'>Средний</option>
              <option value='high'>Высокий</option>
            </select>
          </label>
        </div>
        <div>
          {editingTask ? `Статус задачи:${priority}` : ''}
          <label>
            <br />
            Описание:
            <ReactQuill
              value={description}
              onChange={setDescription}
              placeholder='Введите описание'
            />
          </label>
        </div>
        <div>
          {editingTask ? (
            <label>
              Дата создания:
              <span>{editingTask ? editingTask.createdAt : ''}</span>
            </label>
          ) : null}
        </div>
        <button onClick={handleSave}>
          {editingTask ? 'Редактировать задачу' : 'Создать задачу'}
        </button>
        <label>
          Крайний срок
          <span>
            <input
              type='date'
              value={deadLineDate}
              onChange={(event) => {
                setDeadLineDate(event.target.value);
              }}
            />
          </span>
        </label>
      </div>
    </div>
  );
};

export default TaskModal;
