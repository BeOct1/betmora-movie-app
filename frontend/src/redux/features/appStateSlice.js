// ...existing code from appStateSlice.js...
import { createSlice } from '@reduxjs/toolkit';

const appStateSlice = createSlice({
    name: 'appState',
    initialState: { value: null },
    reducers: {
        setValue: (state, action) => {
            state.value = action.payload;
        },
    },
});

export const { setValue } = appStateSlice.actions;
export default appStateSlice.reducer;