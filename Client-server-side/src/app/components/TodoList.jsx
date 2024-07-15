"use client"; 
import React from 'react';
import { Space, Table, Button, message, Checkbox } from 'antd';
import axios from 'axios';

const TodoList = ({ todos, onDelete, onEdit }) => {

  const handleDelete = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/todos/${id}`)
      .then(() => {
        message.success('Task is done');
        onDelete(id);
      })
      .catch(error => {
        console.error('Failed to delete task:', error); 
        message.error('Failed to delete task');
      });
  };

  const columns = [
    {
      title: 'Checklist',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Checkbox onClick={() => handleDelete(record.id)}></Checkbox>
        </Space>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'File',
      dataIndex: 'file_path',
      key: 'file_path',
      render: (file_path) => file_path ? <a href={`http://127.0.0.1:8000/storage/${file_path}`} target="_blank" rel="noopener noreferrer">View File</a> : 'No File',
    },
    {
      title: 'Update',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type='primary' onClick={() => onEdit(record)}>Update</Button>
        </Space>
      ),
    },

   
  ];

  return (
    <>
      <Table className='mt-5' columns={columns} dataSource={todos} rowKey="id" />
    </>
  );
}

export default TodoList;
