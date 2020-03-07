import React from 'react';
import './App.css';
import { Login } from './components/Login';
import { Provider } from 'react-redux';
import store from "./store"

function App() {
  return (
    <Provider>
      <Login />
    </Provider>
  );
}

export default App;
