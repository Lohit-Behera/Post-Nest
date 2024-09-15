import { createSlice } from "@reduxjs/toolkit";


const modeSlice = createSlice({
    name: 'mode',
    initialState: {
        mode: localStorage.getItem('vite-ui-theme') || 'light',
    },
    reducers: {
        toggleMode: (state, action) => {
            state.mode = action.payload
        }
    }
})

export const { toggleMode } = modeSlice.actions
export default modeSlice.reducer