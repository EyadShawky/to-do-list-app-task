"use client"; 

import React, { useState, useEffect } from "react";
import { Upload, Form, Input, Modal, Button, message } from 'antd';
import { UploadOutlined } from "@ant-design/icons";
import axios from 'axios';

const AddTask = ({ onTaskAdded, editingTask, setEditingTask }) => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (editingTask) {
            form.setFieldsValue(editingTask);
            if (editingTask.file_path) {
                setFileList([{ name: editingTask.file_path.split('/').pop(), url: editingTask.file_path }]);
            }
            setIsModalOpen(true);
        }
    }, [editingTask, form]);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                const formData = new FormData();
                formData.append('title', values.title);
                formData.append('description', values.description || '');
    
                if (fileList.length > 0) {
                    formData.append('file', fileList[0].originFileObj || fileList[0]); 
                }
    
                const request = editingTask
                    ? axios.put(`http://127.0.0.1:8000/api/todos/${editingTask.id}`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                      })
                    : axios.post('http://127.0.0.1:8000/api/todos', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                      });
    
                request
                    .then(response => {
                        message.success(`Task ${editingTask ? 'updated' : 'added'} successfully`);
                        setIsModalOpen(false);
                        form.resetFields();
                        setFileList([]);
                        onTaskAdded(response.data);
                    })
                    .catch(error => {
                        console.error('Error:', error.response ? error.response.data : error.message);
                        if (error.response) {
                            console.log('Error details:', error.response.data);
                        }
                        if (error.response && error.response.data.errors) {
                            form.setFields([
                                { name: 'title', errors: error.response.data.errors.title || [] },
                                { name: 'description', errors: error.response.data.errors.description || [] }
                            ]);
                        }
                        message.error(`Failed to ${editingTask ? 'update' : 'add'} task`);
                    });
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };
    
    
    

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingTask(null);
        form.resetFields();
    };

    const uploadProps = {
        onRemove: (file) => {
            setFileList([]);
        },
        beforeUpload: (file) => {
            setFileList([file]);
            return false; 
        },
        fileList,
    };
    
    

    return (
        <div>
            <Modal title={editingTask ? "Edit Task" : "New Task"} visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical">
                    <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input the title!' }]}>
                        <Input placeholder="Title of your task." />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input placeholder="Describe the task..." />
                    </Form.Item>
                    <Form.Item label="Upload File" name="file">
                        <Upload {...uploadProps}>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>

            <button className="btn btn-primary w-full" onClick={showModal}>
               Add a task
            </button>
        </div>
    );
}

export default AddTask;
