import { useState } from 'react';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Select, Grid, ConfigProvider, Modal, notification } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { ProTable } from '@ant-design/pro-components';
import enUS from 'antd/lib/locale/en_US';
import moment from 'moment';

import TaskFormCompo from './task-form';
import { removeTask } from '../library/slices/state';

const { Option, OptGroup } = Select;
const { useBreakpoint } = Grid;



export default () => {

    const dispatch = useDispatch();
    const { taskList } = useSelector(e => e.state);
    const [sortingTagProp, setSortingTagProp] = useState(null);
    const [sortingStatusProp, setSortingStatusProp] = useState(null);
    const [taskToEdit, setIsTaskToEdit] = useState(null);
    const screens = useBreakpoint();

    const deleteTask = (id) => {
        dispatch(removeTask({
            id,
            cb: () => {
                openNotification("Task Successfully Removed!")
            }
        }));
    }
    const openNotification = (msg) => {
        const args = {
            message: msg,
            description:
                null,
            duration: 3,
        };
        notification.open(args);
    };
    const confirm = (id, title) => {
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: `Want to remove "${title}" task`,
            okText: 'Remove',
            cancelText: 'Leave',
            onOk: () => {
                deleteTask(id);
            },

        })
    };


    const columns = [
        {
            title: 'Created At',
            key: "task created at",
            dataIndex: 'created',
            valueType: 'date',
            width: screens.xs ? 80 : 120,
            sorter: (a, b) => moment(a).unix() - moment(b).unix()
        }, {
            title: 'Title',
            dataIndex: 'title',
            key: "task title",
            fixed: null,
            width: screens.xs ? 130 : 120,
            sorter: (a, b) => a.title.localeCompare(b.title)
        }, {
            title: 'Description',
            key: "task description",
            width: screens.xs ? 130 : 120,
            sorter: (a, b) => a.desc.localeCompare(b.desc),
            dataIndex: 'desc'
        }, {
            title: 'Due Date',
            key: "task due date",
            width: screens.xs ? 80 : 120,
            dataIndex: 'dueDate',
            valueType: 'date',
            //sorter: (a, b) => moment(a).unix() - moment(b).unix()
            sorter: (dateA, dateB) => moment(dateA).diff(moment(dateB))
        }, {
            title: () => <>
                <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                    <p style={{ margin: "0px" }}>Tag : </p>
                    <Select
                        defaultValue="Default"
                        style={{
                            minWidth: "120px"
                        }}
                        onChange={(e) => {
                            if (e == "default") {
                                setSortingTagProp(null);
                            } else {
                                setSortingStatusProp(null)
                                setSortingTagProp(e);
                            }
                        }}
                    >
                        <Option value="default" default selected>Default</Option>
                        <OptGroup label="Select tag">
                            <Option value="urgent">Urgent</Option>
                            <Option value="important">Important</Option>
                            <Option value="for later">For later</Option>
                        </OptGroup>
                    </Select>
                </div>
            </>,
            width: screens.xs ? 120 : 130,
            key: "task tags",
            dataIndex: "tag",
            render: (_) => _.map(item => <a className="tables-tag"> {item}</a>)
        }, {
            title: () => <>
                <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                    <p style={{ margin: "0px" }}>Status : </p>
                    <Select
                        defaultValue="Default"
                        style={{
                            minWidth: "120px"
                        }}
                        onChange={(e) => {
                            if (e == "default") {
                                setSortingStatusProp(null);
                            } else {
                                setSortingTagProp(null)
                                setSortingStatusProp(e);
                            }
                        }}
                    >
                        <Option value="default" default selected>Default</Option>
                        <OptGroup label="Select status">
                            <Option value="open">Open</Option>
                            <Option value="working">Working</Option>
                            <Option value="done">Done</Option>
                            <Option value="overdue">Overdue</Option>
                        </OptGroup>
                    </Select>
                </div>
            </>,
            dataIndex: 'status',
            width: screens.xs ? 120 : 130,
            ellipsis: false,
            initialValue: "open",
            valueEnum: {
                open: { text: 'Open', status: "Success" },
                working: { text: 'Working', status: "Processing" },
                done: { text: 'Done', status: "Default" },
                overdue: { text: 'Overdue', status: "Error" }
            },
        }, {
            title: "Option's",
            key: 'option',
            width: screens.xs ? 80 : 100,
            valueType: 'option',
            render: ({ props }) => [
                <Button onClick={() => setIsTaskToEdit(props.record)}>
                    <EditOutlined backgroundColor="blue"/>
                </Button>,
                <Button onClick={() => confirm(props.record.id, props.record.title)}>
                    <DeleteOutlined />
                </Button>
            ],
        },
    ];
    return (<>
        {taskToEdit &&
            <TaskFormCompo
                key={taskToEdit.id}
                task={taskToEdit}
                setTask={() => { setIsTaskToEdit(null); }}
            />}

        <ConfigProvider
            locale={enUS}>
            <ProTable
                dataSource={
                    sortingTagProp && taskList.filter(e => e.tag.find(_ => _ == sortingTagProp)) ||
                    sortingStatusProp && taskList.filter(_ => _.status == sortingStatusProp) || taskList
                }
                rowKey="key"
                scroll={{ x: 1300 }}
                columns={columns}
                dateFormatter="string"
                toolBarRender={false}
                search={false}
                pagination={{ defaultPageSize: 6 }}
            />
        </ConfigProvider>
    </>);
};