/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from '../../types/User';
import { client } from '../../utils/axiosClient';

export type UsersState = {
  loadedUsers: User[];
  activeUser: User | null;
  isLoading: boolean;
  isError: boolean;
};

const initialState: UsersState = {
  loadedUsers: [],
  activeUser: null,
  isLoading: false,
  isError: false,
};

export const loadUsers = createAsyncThunk<User[]>('users/fetch', async () => {
  const data = await client.get<User[]>('/users');

  return data;
});

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.activeUser = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loadUsers.pending, state => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.loadedUsers = action.payload;
        state.isLoading = false;
      })
      .addCase(loadUsers.rejected, state => {
        state.isError = true;
        state.isLoading = false;
      });
  },
});

export default usersSlice.reducer;
export const { setUser } = usersSlice.actions;
