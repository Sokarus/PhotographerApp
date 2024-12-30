import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Role} from '@type/user';

interface IInitialState {
  login: string;
  roles: Role[];
  lang: string;
}

const InitialState: IInitialState = {
  login: '',
  roles: [],
  lang: localStorage.getItem('lang') || 'ru',
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
    setLang: (state, action: PayloadAction<string>) => {
      state.lang = action.payload;
    },
  },
});

export const {setLogin, setRoles, setLang} = userSlice.actions;

export {userSlice};
