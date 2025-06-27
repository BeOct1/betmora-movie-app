// ...existing code from globalLoadingSlice.js...
import { createSlice } from '@reduxjs/toolkit';

const globalLoadingSlice = createSlice({
    name: 'globalLoading',
    initialState: { loading: false },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { setLoading } = globalLoadingSlice.actions;
export default globalLoadingSlice.reducer;