import {Routes, Route, useLocation} from 'react-router-dom';
import { NavBar } from './navbar';
import { AnaSayfa } from './anasayfa.jsx';
import {Menu} from './menu.jsx';
import {Game} from './game.jsx'
import {TwoBirds} from './2birds.jsx';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [gameModActive, setGameModActive] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const [positionChange, setPositionChange] = useState(false);
  const [openButton, setOpenButton] = useState(false);
  const location = useLocation();

  const handleExitGame = () => {
    setGameModActive(false);
            setTimeout(()=>{
                setGameModActive(false);
                setGameStart(false);
                setPositionChange(false);
                setOpenButton(false);
            }, 50);
  }

  useEffect(()=>{
    return()=>{
      handleExitGame();
    }
  }, [location.pathname]);
  
  return (
    <>
      <NavBar />
      <TwoBirds />
      <Game 
        isActive={gameModActive} 
        handleExitGame={handleExitGame}
      />
      <Routes>
        <Route path="/" element={
          <AnaSayfa
            gameModActive={gameModActive}
            setGameModActive = {setGameModActive}
            handleExitGame = {handleExitGame}
            gStart = {gameStart}
            pChange = {positionChange}
            oButton = {openButton}
          />}
        />
        <Route path="/anasayfa" element={
          <AnaSayfa
            gameModActive={gameModActive}
            setGameModActive = {setGameModActive}
            handleExitGame = {handleExitGame}
            gStart = {gameStart}
            pChange = {positionChange}
            oButton = {openButton}
          />}/>
        <Route path="/menu" element={<Menu/>}/>
      </Routes>
    </>
  )
}

export default App
