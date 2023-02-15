import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import shortid from 'shortid';
import moment from 'moment';

import { STORAGE_KEY_NAME } from '../../Database';

const appState = {
    taskList: []
}

export const appStateSlice = createSlice({
    name: 'appState',
    initialState: appState,
    reducers: {
        loadApp: (state, _) => {
            const taskList = window.localStorage.getItem(STORAGE_KEY_NAME);
            if (taskList) {
                state.taskList = JSON.parse(taskList);
            }
        },
        addToTaskList: (state, { payload }) => {
            const { form, cb } = payload;
            const taskList = window.localStorage.getItem(STORAGE_KEY_NAME);
            const formToSave = {
                ...form,
                id: shortid.generate(),
                created: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
            }
            if (taskList) {
                window.localStorage.setItem(STORAGE_KEY_NAME, JSON.stringify([...JSON.parse(taskList), formToSave]));
                state.taskList = [...JSON.parse(taskList), formToSave];
                cb();
            } else {
                window.localStorage.setItem(STORAGE_KEY_NAME, JSON.stringify([formToSave]));
                state.taskList = [formToSave];
                cb();
            }
        },
        removeTask: (state, { payload }) => {
            const { id, cb } = payload;
            const taskList = JSON.parse(window.localStorage.getItem(STORAGE_KEY_NAME));
            const taskListToSave = taskList?.filter(_ => _.id != id);
            window.localStorage.setItem(STORAGE_KEY_NAME, JSON.stringify(taskListToSave));
            state.taskList = taskListToSave;
            cb();
        },
        editTask: (state, { payload }) => {
            const { task, cb } = payload;
            const taskList = JSON.parse(window.localStorage.getItem(STORAGE_KEY_NAME));
            const taskListToSave = taskList?.filter(_ => _.id != task.id);
            window.localStorage.setItem(STORAGE_KEY_NAME, JSON.stringify([...taskListToSave, task]));
            state.taskList = [...taskListToSave, task];
            cb();
        }
    }
})

// Action creators are generated for each case reducer function
export const { addToTaskList, removeTask, editTask, loadApp } = appStateSlice.actions;

export default appStateSlice.reducer;