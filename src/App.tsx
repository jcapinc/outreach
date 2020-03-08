import React from 'react';
import './App.css';
import { Provider} from 'react-redux';
import { store } from "./store"
import { App as MainApp} from './components/App';

function App() {
  return (<Provider store={store}><MainApp /></Provider>);
}

export default App;
