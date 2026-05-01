/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/indent */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { client } from '../../utils/axiosClient';
import { Comment, CommentData } from '../../types/Comment';

type CommentsTypeState = {
  isLoading: boolean;
  isError: boolean;
  comments: Comment[];
};

const initialState: CommentsTypeState = {
  isLoading: false,
  isError: false,
  comments: [],
};

export const loadingComments = createAsyncThunk<Comment[], number>(
  'comments/axios',
  async (postId: number) => {
    const data = await client.get<Comment[]>(`/comments?postId=${postId}`);

    return data;
  },
);

export const createComment = createAsyncThunk<
  Comment,
  CommentData & { postId: number }
>('comments/create', async commentData => {
  const data = await client.post<Comment>('/comments', commentData);

  return data;
});

export const deleteComment = createAsyncThunk<number, number>(
  'comments/delete',
  async (commentId: number) => {
    await client.delete(`/comments/${commentId}`);

    return commentId;
  },
);

export const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loadingComments.pending, state => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(loadingComments.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.isLoading = false;
      })
      .addCase(loadingComments.rejected, state => {
        state.isError = true;
        state.isLoading = false;
      })

      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(createComment.rejected, state => {
        state.isError = true;
      })
      .addCase(
        deleteComment.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.comments = state.comments.filter(c => c.id !== action.payload);
        },
      );
  },
});

export default commentsSlice.reducer;
