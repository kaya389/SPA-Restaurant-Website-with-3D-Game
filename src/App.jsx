import { useState, useEffect, Suspense, useRef} from 'react';
import {Routes, Route, useLocation} from 'react-router-dom';

import { NavBar } from './navbar';
import { AnaSayfa } from './anasayfa.jsx';
import {Menu} from './menu.jsx';
import {Game} from './game.jsx'
import {TwoBirds} from './2birds.jsx';
import './App.css';

function App() {
  const [gameModActive, setGameModActive] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const [positionChange, setPositionChange] = useState(false);
  const [openButton, setOpenButton] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const audioRef = useRef(null);

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
      if(location.pathname === '/menu'){
        audioRef.current = new Audio('/cornered.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3;

        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.log("Tarayıcı otomatik oynatmayı engelledi:", error);
              // Burada belki ekrana "Sesi açmak için tıkla" butonu koyabilirsin
            });
        }
      }
      return()=>{
        if(audioRef.current){
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        handleExitGame();
      }
  }, [location.pathname]);
  
  return (
    <>
      <NavBar />
      <TwoBirds route={location.pathname}/>
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
        <Route path="/menu" element={
          <Menu 
            setVideoEnded={setVideoEnded} 
            videoEnded={videoEnded}/>
        }/>
      </Routes>
    </>
  )
}

export default App
