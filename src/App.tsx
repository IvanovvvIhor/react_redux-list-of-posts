/* eslint-disable @typescript-eslint/indent */
import React, { useEffect } from 'react';
import classNames from 'classnames';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';
import { UserSelector } from './components/UserSelector';
import { Loader } from './components/Loader';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { loadUsers, setUser } from './features/Task/users';
import { loadingPosts, clearPosts } from './features/Task/posts';
import { setPost } from './features/Task/selectedPost';
import { User } from './types/User';
import { Post } from './types/Post';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();

  const { loadedUsers, activeUser } = useAppSelector(state => state.users);
  const { posts, isLoadingPost, isErrorPost } = useAppSelector(
    state => state.posts,
  );
  const selectedPost = useAppSelector(state => state.selectedPost);

  useEffect(() => {
    dispatch(loadUsers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setPost(null));

    if (activeUser) {
      dispatch(loadingPosts(activeUser.id));
    } else {
      dispatch(clearPosts());
    }
  }, [activeUser, dispatch]);

  const handleUserChange = (user: User) => {
    dispatch(setUser(user));
  };

  const handlePostSelected = (post: Post | null) => {
    dispatch(setPost(post));
  };

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector
                  users={loadedUsers}
                  value={activeUser}
                  onChange={handleUserChange}
                />
              </div>

              <div className="block" data-cy="MainContent">
                {!activeUser && (
                  <p data-cy="NoSelectedUser">No user selected</p>
                )}

                {activeUser && isLoadingPost && <Loader />}

                {activeUser && !isLoadingPost && isErrorPost && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    Something went wrong!
                  </div>
                )}

                {activeUser &&
                  !isLoadingPost &&
                  !isErrorPost &&
                  posts.length === 0 && (
                    <div
                      className="notification is-warning"
                      data-cy="NoPostsYet"
                    >
                      No posts yet
                    </div>
                  )}

                {activeUser &&
                  !isLoadingPost &&
                  !isErrorPost &&
                  posts.length > 0 && (
                    <PostsList
                      posts={posts}
                      selectedPostId={selectedPost?.id}
                      onPostSelected={handlePostSelected}
                    />
                  )}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              { 'Sidebar--open': !!selectedPost },
            )}
          >
            <div className="tile is-child box is-success">
              {selectedPost && <PostDetails post={selectedPost} />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
