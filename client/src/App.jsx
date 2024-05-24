import React, { useEffect, useState } from 'react';
import './App.css';
import Home from './views/Home.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import AllPosts from './views/AllPosts.jsx';
import CreatePost from './views/CreatePost.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFound from './views/NotFound.jsx';
import SinglePost from './views/SinglePost.jsx';
import Login from './views/Login.jsx';
import AdminView from './views/AdminView.jsx';
import Authenticated from './hoc/Authenticated.jsx';
import { AppContext } from './context/AppContext.jsx';
import Register from './views/Register.jsx';
import { getUserData } from './services/users.service.js';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase-config.js';
import MyPosts from './views/MyPosts.jsx';

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (appState.user !== user) {
      setAppState({ ...appState, user });
    }
  }, [user, appState]);

  useEffect(() => {
    if (!appState.user) return;

    getUserData(appState.user.uid)
      .then(snapshot => {
        const userData = snapshot.val() && Object.values(snapshot.val())[0];
        setAppState(prevState => ({ ...prevState, userData }));
      })
      .catch(error => console.error("Failed to fetch user data:", error));
  }, [appState.user]);

  return (
    <BrowserRouter>
      <AppContext.Provider value={{ ...appState, setAppState }}>
        <div className="app-container">
          <Header />
          <div className="content-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin-dashboard" element={<Authenticated><AdminView /></Authenticated>} />
              <Route path="/posts" element={<Authenticated><AllPosts /></Authenticated>} />
              <Route path="/posts/:id" element={<Authenticated><SinglePost /></Authenticated>} />
              <Route path="/posts-create" element={<Authenticated><CreatePost /></Authenticated>} />
              <Route path="/my-posts" element={<Authenticated><MyPosts /></Authenticated>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App;
