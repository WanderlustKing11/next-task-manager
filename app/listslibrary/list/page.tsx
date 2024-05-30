'use client';

import SelectSort from '@/app/components/SelectSort';
import Task from '@/app/components/Task';
import TaskEditor from '@/app/components/TaskEditor';
import { Pencil2Icon } from '@radix-ui/react-icons';
import { Button, Dialog, IconButton, Select } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchTaskSchema } from '@/app/validationSchemas';
import { z } from 'zod';
import Link from 'next/link';

type TaskData = z.infer<typeof fetchTaskSchema>;

const ListPage = () => {
  // const [isOpen, setIsOpen] = useState(false);

  // const toggleOpen = () => {
  //   setIsOpen(!isOpen);
  // };

  // const handleClose = () => {
  //   if (isOpen) {
  //     setIsOpen(false);
  //   }
  // };
  const [editorOpen, setEditorOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  // const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get('/api/tasks');
    setTasks(response.data);
  };

  const handleAddTask = () => {
    setEditorOpen(true); // open the editor for a new task
    // console.log('Editor is:', editorOpen);
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.log('Failed to delete task:', error);
    }
  };

  const handleToggleCompletion = async (id: number) => {
    try {
      const response = await axios.patch(`/api/tasks/${id}`);
      const updatedTask = response.data;
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, status: updatedTask.status } : task
        )
      );
      console.log(response.data.status);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleCloseEditor = () => {
    setEditorOpen(false); // Close the editor
  };

  return (
    <div
      className='w-full h-full flex flex-col items-center'
      // onClick={handleClose}
    >
      {/* TITLE */}
      <div className='flex flex-row space-x-10 group'>
        <h1 className='text-3xl mb-14 group-hover:opacity-75'>List Title</h1>
        <span className='opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          <IconButton size='1' color='gray' aria-label='Edit list title'>
            <Pencil2Icon width='18' height='18' />
          </IconButton>
        </span>
      </div>

      <SelectSort className='w-full flex justify-start'>
        <Select.Item value='oldest'>oldest</Select.Item>
        <Select.Item value='newest'>newest</Select.Item>
        <Select.Item value='alphabetical'>alphabetical</Select.Item>
        <Select.Item value='due date'>due date</Select.Item>
      </SelectSort>

      {/* TASKS */}
      <Dialog.Root>
        <div className='w-full'>
          <ul>
            {tasks.map((task: TaskData) => (
              <Task
                key={task.id}
                task={task.title}
                dueDate={task.dueDateTime}
                isCompleted={task.status === 'COMPLETE'}
                onCheckClick={() => handleToggleCompletion(task.id)}
                onDelete={() => handleDeleteTask(task.id)}
                // toggleOpen={toggleOpen}
                // isOpen={isOpen}
              />
            ))}
          </ul>
        </div>
        <div className='mt-16 mb-10'>
          <Dialog.Trigger>
            <Button onClick={handleAddTask}>ADD NEW TASK</Button>
          </Dialog.Trigger>

          {/* ALTERNATE TASK EDITOR PAGE */}
          {/* <Button>
            <Link href='/listslibrary/list/new'>New Task</Link>
          </Button> */}
        </div>
        <TaskEditor isOpen={editorOpen} onClose={handleCloseEditor} />
      </Dialog.Root>
    </div>
  );
};

export default ListPage;
