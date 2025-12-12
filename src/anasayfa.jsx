import { useState } from 'react';
import { Game } from './game';
import dukkan from '../images/dukkan.png'
import playButton from '../images/play-button.png';
import intro from '../images/game-start-scene.mp4';
import './anasayfa.css';

export function AnaSayfa(){
    const [positionChange, setPositionChange] = useState(false);
    const [gameStart, setGameStart] = useState(false);
    const [openButton, setOpenButton] = useState(false);
    const [gameModActive, setGameModActive] = useState(false);

    if(gameModActive){
        return <Game />
    }

    return(
        <div className='dukkan-div'
            style={{
                display: positionChange ? 'justify-content: center' : 
                'justify-content: right',
            }}>
            <div className='play-button-container'>
                <button
                    className='play-button-button'
                    onClick={()=>{
                        setPositionChange(true);
                        setTimeout(()=>{
                            setGameStart(true);
                        }, 1000);
                        setTimeout(()=>{
                            setOpenButton(true);
                        }, 6000)
                    }}
                    style={{
                        display: positionChange ? 'none' : 'flex',
                    }}
                >
                    <img className='play-button' src={playButton}></img>
                </button>
            </div>
            {gameStart?(
                <div className='video-and-buttons'>
                    <video
                        className='game-start-scene'
                        src={intro}
                        autoPlay
                        style={{
                            transform: 'scale(1.2) translateY(20px)',
                            transition: 'transform 0.5s ease-in-out'
                        }}
                    />{openButton?(
                    <>
                    <button 
                        className='start-game'
                        onClick={()=>{
                            setGameModActive(true);
                        }}
                    >
                        &#8883; Oyuna Başla!
                    </button>
                    <button
                        className='exit-game'
                        onClick={()=>{
                            setGameStart(false);
                            setPositionChange(false);
                            setOpenButton(false);
                        }}
                    >
                        &#215; Çık
                    </button></>):(<div/>)}
                </div>
            ):(
            <img 
                className="dukkan" 
                src={dukkan}
                style={{
                    transition: 'transform 0.5s ease-in-out',
                    transform: positionChange ? `scale(1.2) translateY(20px)` : 
                        'translateY(0) scale(1)',
                }}
            />
            )}
        </div>
    );
}