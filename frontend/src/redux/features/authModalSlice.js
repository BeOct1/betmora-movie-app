// ...existing code from authModalSlice.js...
import { createSlice } from '@reduxjs/toolkit';

const authModalSlice = createSlice({
    name: 'authModal',
    initialState: { open: false },
    reducers: {
        openModal: (state) => { state.open = true; },
        closeModal: (state) => { state.open = false; },
    },
});

export const { openModal, closeModal } = authModalSlice.actions;
export default authModalSlice.reducer;