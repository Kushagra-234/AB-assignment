import { configureStore } from '@reduxjs/toolkit'
import state from './slices/state'

export const store = configureStore({
    reducer: {
        state
    },
})