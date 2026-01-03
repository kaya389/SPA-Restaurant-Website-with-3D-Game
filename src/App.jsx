import { useState, useEffect, Suspense, useRef} from 'react';
import {Routes, Route, useLocation} from 'react-router-dom';

import { NavBar } from './navbar';
import { AnaSayfa } from './anasayfa.jsx';
import {Menu} from './menu.jsx';
import {Game} from './game.jsx'
import {TwoBirds} from './2birds.jsx';
import { Hakkimizda } from './hakkimizda.jsx';
import { AdresIletisim } from './AdresIletisim.jsx';
import './App.css';

function App() {
  const baseUrl = import.meta.env.BASE_URL;
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
    const preventDefault = (e) => e.preventDefault();

    const preventZoom = (e) => {
      if(e.touches.length>1){
        e.preventDefault();
      }
    }

    document.addEventListener('touchmove', preventDefault, { passive: false });
    document.addEventListener('gesturestart', preventDefault); // Safari özel zoom
    document.addEventListener('gesturechange', preventDefault);
    document.addEventListener('gestureend', preventDefault);
    document.addEventListener('touchstart', preventZoom, { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventDefault);
      document.removeEventListener('gesturestart', preventDefault);
      document.removeEventListener('gesturechange', preventDefault);
      document.removeEventListener('gestureend', preventDefault);
      document.removeEventListener('touchstart', preventZoom);
    }
  })
  
  useEffect(()=>{
      if (location.pathname !== '/menu') {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        return; 
      }
      if(!audioRef.current){
        audioRef.current = new Audio(`${baseUrl}cornered.mp3`);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3;
      }

      const playMusic = () => {
        if(audioRef.current && audioRef.current.paused){
          audioRef.current.play()
            .then(()=>{
              window.removeEventListener('click', playMusic);
              window.removeEventListener('keydown', playMusic);
              window.removeEventListener('touchstart', playMusic);
            });
        }
      };

      playMusic();

      window.addEventListener('keydown', playMusic);
      window.addEventListener('click', playMusic);
      window.addEventListener('touchstart', playMusic);

      
      return()=>{
        if(audioRef.current){
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        window.removeEventListener('keydown', playMusic);
        window.removeEventListener('click', playMusic);
        window.removeEventListener('touchstart', playMusic);
      }
  }, [location.pathname]);

  useEffect(()=>{
    if(!gameModActive) return;
    return()=>{
      handleExitGame();
    }
  }, [location.pathname, gameModActive]);
  
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
        <Route path="/hakkimizda" element={
          <Hakkimizda
          />
        }/>
        <Route path="/iletisim" element={
          <AdresIletisim
          />
        }/>
      </Routes>
    </>
  )
}

export default App
