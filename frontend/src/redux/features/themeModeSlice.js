// ...existing code from themeModeSlice.js...
import { createSlice } from '@reduxjs/toolkit';

const themeModeSlice = createSlice({
    name: 'themeMode',
    initialState: { mode: 'light' },
    reducers: {
        setThemeMode: (state, action) => {
            state.mode = action.payload;
        },
    },
});

export const { setThemeMode } = themeModeSlice.actions;
export default themeModeSlice.reducer;