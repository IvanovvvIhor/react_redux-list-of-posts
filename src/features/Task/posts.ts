/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Post } from '../../types/Post';
import { client } from '../../utils/axiosClient';

type PostsTypeState = {
  posts: Post[];
  isLoadingPost: boolean;
  isErrorPost: boolean;
};

const initialState: PostsTypeState = {
  posts: [],
  isLoadingPost: false,
  isErrorPost: false,
};

export const loadingPosts = createAsyncThunk<Post[], number>(
  'posts/axios',
  async (userId: number) => {
    const data = await client.get<Post[]>(`/posts?userId=${userId}`);

    return data;
  },
);

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearPosts: state => {
      state.posts = [];
    },
  },
  extraReducers(builder) {
    builder.addCase(loadingPosts.pending, state => {
      state.isLoadingPost = true;
      state.isErrorPost = false;
    });
    builder.addCase(loadingPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
      state.isLoadingPost = false;
    });
    builder.addCase(loadingPosts.rejected, state => {
      state.isErrorPost = true;
      state.isLoadingPost = false;
    });
  },
});

export default postsSlice.reducer;
export const { clearPosts } = postsSlice.actions;
