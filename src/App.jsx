import {Routes, Route} from 'react-router-dom';
import { NavBar } from './navbar';
import { AnaSayfa } from './anasayfa.jsx';
import {Menu} from './menu.jsx';
import './App.css';

function App() {

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<AnaSayfa/>}/>
        <Route path="/anasayfa" element={<AnaSayfa/>}/>
        <Route path="/menu" element={<Menu/>}/>
      </Routes>
    </>
  )
}

export default App
