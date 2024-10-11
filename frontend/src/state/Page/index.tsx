import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {State} from '@enum/Page';

interface IInitialState {
  state: State;
}

const InitialState: IInitialState = {
  state: State.home,
};

const pageSlice = createSlice({
  name: 'page',
  initialState: InitialState,
  reducers: {
    setState: (state, action: PayloadAction<State>) => {
      state.state = action.payload;
    },
  },
});

export const {setState} = pageSlice.actions;

export {pageSlice};
