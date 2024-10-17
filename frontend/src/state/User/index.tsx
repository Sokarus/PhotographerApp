import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { Role } from '@type/user';

interface IInitialState {
  login: string;
  roles: Role[];
}

const InitialState: IInitialState = {
  login: '',
  roles: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState: InitialState,
  reducers: {
    setLogin: (state, action: PayloadAction<string>) => {
      state.login = action.payload;
    },
    setRoles: (state, action: PayloadAction<Role[]>) => {
      state.roles = action.payload;
    },
  },
});

export const {setLogin, setRoles} = userSlice.actions;

export {userSlice};
