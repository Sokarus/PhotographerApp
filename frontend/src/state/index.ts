import {configureStore} from '@reduxjs/toolkit';
import {pageSlice} from './Page';

const store = configureStore({
  reducer: {
    page: pageSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
