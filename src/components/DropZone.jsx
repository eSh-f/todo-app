import { useDrop } from 'react-dnd';

const DropZone = ({ status, children, updateTaskStatus, className }) => {
  const [, drop] = useDrop({
    accept: 'TASK',
    drop: (draggedItem) => {
      if (draggedItem.status !== status) {
        updateTaskStatus(draggedItem.id, status);
      }
    },
  });

  return (
    <div ref={drop} className={`task-column ${className}`}>
      {status}
      <ol className='task-list'>{children}</ol>
    </div>
  );
};

export default DropZone;
