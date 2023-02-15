import React, { useState } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Col, Row, AutoComplete, Grid, Modal } from 'antd';
import { useSelector, useDispatch } from 'react-redux';


import { removeTask } from '../library/slices/state';
import TaskFormCompo from './task-form';

const { useBreakpoint } = Grid;



export default () => {

    const dispatch = useDispatch();
    const { taskList } = useSelector(e => e.state);
    const [options, setOptions] = useState([]);
    const [taskToEdit, setIsTaskToEdit] = useState(null);
    const screens = useBreakpoint();


    const handleSearch = (value) => {
        setOptions(value ? searchResult(value) : []);
    };

    const onSelect = (value) => {
        console.log('onSelect', value);
    };

    const deleteTask = (id) => {
        dispatch(removeTask({
            id,
            cb: () => {
                console.log(" Deleted");
            }
        }));
    }

    const confirm = (id, title) => {
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: `Want to remove "${title}" task`,
            okText: 'Remove',
            cancelText: 'Exit',
            onOk: () => {
                deleteTask(id);
            }
        })
    };

    const searchResult = (query) => {
        return taskList
            .filter(_ => {
                let lowerCaseString = _.title.concat(" " + _.desc).toLocaleLowerCase();   // making task "title" and "description" both searchable
                return lowerCaseString.includes(query.toLocaleLowerCase());
            }).map(task => {
                return {
                    value: task.title,
                    label: <Row justify='space-between' >
                        <Col>
                            <span style={{ textTransform: "capitalize" }}>
                                {task.title}
                            </span>
                        </Col>
                        <Col>
                            <div className='search-options'>
                                <p onClick={() => { setIsTaskToEdit(task); }}>
                                    Edit
                                </p>
                                <p onClick={() => confirm(task.id, task.title)}>
                                    Delete
                                </p>
                            </div>
                        </Col>
                    </Row>
                }
            })
    }
 
    return <div style={{ marginBottom: "30px" }}>

        <Row>
            <Col span={screens.xs ? 16 : 20}>
                <AutoComplete
                    dropdownMatchSelectWidth={"100%"}
                    style={{
                        width: "100%"
                        
                    }}
                    options={options}
                    onSelect={onSelect}
                    onSearch={handleSearch}
                    placeholder="Search"
                />
            </Col>
            <Col span={screens.xs ? 8 : 4}>
                <TaskFormCompo task={taskToEdit || null} setTask={() => { setIsTaskToEdit(null); }} />
            </Col>
        </Row>

    </div>
}
