import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Grid, Input, DatePicker, notification, Select } from 'antd';
import { CaretRightOutlined } from "@ant-design/icons"
import { useDispatch } from 'react-redux'
import moment from 'moment';

import { STATUS, TAGS } from '../Database';
import { addToTaskList, editTask } from '../library/slices/state';
import { disabledDate, disabledDateTime, tagRender } from '../Validation';

const { Option } = Select;
const { TextArea } = Input;
const { useBreakpoint } = Grid;
const task_blank = {
    title: "",
    desc: "",
    dueDate: null,
    tag: ["default"],
    status: "open"
}

export default ({ task, setTask }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [taskForm, setTaskForm] = useState(task_blank);
    const screens = useBreakpoint();

    const showModal = () => {
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setTask && setTask(null);
    };

    const openNotification = (msg) => {
        const args = {
            message: msg,
            description:
                null,
            duration: 3,
        };
        notification.open(args);
    };

    const onFinish = (_) => {

        if (task) {
            dispatch(editTask({
                task: { ...task, ...taskForm },
                cb: () => {
                    form.resetFields();
                    setTaskForm(task_blank);
                    setIsModalVisible(false);
                    setTask(null);
                    openNotification('Task Successfully Updated!');
                }
            }));
        } else {
            dispatch(addToTaskList({
                form: taskForm,
                cb: () => {
                    form.resetFields();
                    setTaskForm(task_blank);
                    setIsModalVisible(false);
                    openNotification('Task Successfully Added!');
                }
            }));
        }

    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleStatusChange = (value) => {
        formStateHandler("status", value)
    };

    const formStateHandler = (field, text) => {
        setTaskForm({
            ...taskForm,
            [field]: text
        })
    }
    useEffect(() => {
        if (task) {
            setIsModalVisible(true);
            setTaskForm(task);
            form.setFieldsValue({
                title: task.title,
                desc: task.desc,
                dueDate: task?.dueDate ? moment(task.dueDate) : null,
                tag: task?.tag.map(_ => TAGS.indexOf(_)),
                status: task.status
            });
        }
    }, [task])

    return <>
        {!task && <Button
            onClick={showModal}
            style={{
                backgroundColor: "blue",
                width: "80%",
                marginRight:"330px"
                
            }}
            icon={<CaretRightOutlined />}
            type="primary">Add</Button>}
        <Modal
            title={task ? "Edit task" : "Add task"}
            visible={isModalVisible}
            footer={null}
        >
            <Form
                form={form}
                name="basic"
                initialValues={{
                    tag: task?.tag ? task?.tag.map(_ => TAGS.indexOf(_)) : [0],
                    status: taskForm.status
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                {task && <Form.Item
                    label="Task Created at"
                    name="createdAt"
                    initialValue={task?.created}
                >
                    <Input
                        value={task?.created}
                        disabled
                    />
                </Form.Item>}
                <Form.Item
                    label="Task title"
                    name="title"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter title!',
                        },
                        {
                            max: 100,
                            message: 'Max length 100 characters!.'
                        }
                    ]}
                >
                    <Input
                        value={taskForm.title}
                        onChange={e => { formStateHandler("title", e.target.value) }}
                        placeholder='Enter task title.'
                    />
                </Form.Item>
                <Form.Item
                    label="Task description"
                    name="desc"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter description about task!',
                        },
                        {
                            max: 1000,
                            message: 'Max length 1000 characters!.'
                        }
                    ]}
                >
                    <TextArea
                        value={taskForm.desc}
                        onChange={e => { formStateHandler("desc", e.target.value) }}
                        rows={3}
                        placeholder="Type task description..."
                    />
                </Form.Item>
                <Form.Item
                    label="Due date"
                    name="dueDate"
                >
                    <DatePicker
                        value={taskForm.dueDate}
                        onChange={(date, dateString) => {
                            formStateHandler("dueDate", dateString)
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        disabledDate={disabledDate}
                        disabledTime={disabledDateTime}
                        showTime={{
                            defaultValue: moment('00:00:00', 'HH:mm:ss'),
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label="Tags"
                    name="tag"
                >
                    <Select
                        mode="multiple"
                        showArrow
                        tagRender={tagRender}
                        style={{
                            width: '100%'
                        }}
                        onChange={e => {
                            let tempTags = e.map(i => TAGS.at(i));
                            formStateHandler("tag", tempTags.length && tempTags || ['default']);
                        }}
                        options={TAGS.map((tag, i) => ({ label: tag, value: i }))}
                    />
                </Form.Item>
                <Form.Item
                    label="Status"
                    name="status"
                    rules={[
                        {
                            required: true,
                            message: 'Please select task status!',
                        }
                    ]}
                >
                    <Select
                        value={taskForm.status}
                        defaultValue="open"
                        style={{
                            width: "100%",
                        }}
                        onChange={handleStatusChange}
                    >
                        {STATUS.map(_ => <Option value={_}>{_.toLowerCase()}</Option>)}
                    </Select>
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        offset: screens.xs ? 0 : 8,
                        span: screens.xs ? 0 : 16,
                    }}
                >
                    <div style={{
                        display: "flex",
                        gap: "10px",
                        justifyContent: "center",
                        marginTop: "20px"
                    }}>
                        <Button type="primary" htmlType="submit">
                            {task ? "Update" : "Submit"}
                        </Button>

                        <Button onClick={handleCancel} type="default">
                            {task ? "Leave" : "Cancel"}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    </>
};