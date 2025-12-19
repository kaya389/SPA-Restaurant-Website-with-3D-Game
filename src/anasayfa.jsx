import { useEffect, useState } from 'react';
import { Game } from './game';
import dukkan from '../images/dukkan.png'
import kaldirim from '../images/kaldırım-back.png'
import playButton from '../images/play-button.png';
import intro from '../images/game-start-scene.mp4';
import lamba from '../images/lamba.png'
import e_poster1 from '../images/e_poster.png';
import e_poster2 from '../images/e_poster2.png';
import e_poster3 from '../images/e_poster3.png';
import e_poster4 from '../images/e_poster4.png';
import e_poster5 from '../images/e_poster2.png';
import koltuk from '../images/koltuk.png';
import qr_platform from '../images/qr-platform.png';
import beni_oku from '../images/beni-oku.png';
import './anasayfa.css';
import { assetPool } from './game/asset-pool';

export function AnaSayfa({gameModActive, setGameModActive,
    gStart, pChange, oButton}){
    const [positionChange, setPositionChange] = useState(false);
    const [gameStart, setGameStart] = useState(false);
    const [openButton, setOpenButton] = useState(false);
    const [beniOku, setBeniOku] = useState(false);

    useEffect(()=>{
            if(!gameModActive){
                const timer = setTimeout(()=>{
                    assetPool.dispose();
                }, 100);

                return () => clearTimeout(timer);
            }
    }, [gameModActive, gStart]);

    const [ePoster, setEPoster] = useState(e_poster5);
    const [i, setI] = useState(1);
    

    useEffect(() => {

        const timer = setInterval(() => {
            
            setI(prevI => {
                let nextI = prevI + 1;

                switch(prevI) {
                    case 1:
                        setEPoster(e_poster1);
                        break;
                    case 2:
                        setEPoster(e_poster2);
                        break;
                    case 3:
                        setEPoster(e_poster3);
                        break;
                    case 4:
                        setEPoster(e_poster4);
                        break;
                    case 5:
                        setEPoster(e_poster5);
                        break;
                }
                
                return nextI > 5 ? 1 : nextI;
            });
        }, 10000);

        return () => clearInterval(timer);
    }, []);

    

    return(
        <>
        {!gameModActive && (
        <div className='anasayfa'>
            <div className='welcome-dukkan'>
                <div className='welcome'>
                    <img className='e-poster' src={ePoster}/>
                    <img className='lamba' src={lamba}/>
                </div>
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
                                pointerEvents: 'auto'
                            }}
                        >
                            <img
                                className='play-button' 
                                src={playButton}
                                style={{pointerEvents: 'none'}}
                                >
                            </img>
                        </button>
                    </div>
                    {gameStart?(
                        <div className='video-and-buttons'>
                            <video
                                className='game-start-scene'
                                src={intro}
                                autoPlay
                                
                            />{openButton?(
                            <>
                            <button 
                                className='start-game'
                                onClick = {()=>{
                                    setGameModActive(true)
                                }}
                            >
                                &#8883; Oyuna Başla!
                            </button>
                            <button
                                className='exit-game'
                                onClick={()=>{
                                    setGameStart(gStart);
                                    setPositionChange(pChange);
                                    setOpenButton(oButton);
                                    setGameStart(false);
                                }}
                            >
                                &#215; Çık
                            </button></>):(<div/>)}
                        </div>
                    ):(
                    <img 
                        className="dukkan" 
                        src={dukkan}
                    />
                    )}
                </div>
            </div>
            <div className='tanitim'>
                <img className='kaldirim' src={kaldirim}/>
                <img className='koltuk' src={koltuk}/>
                <button
                    className='qr-button'
                    onClick={()=>{
                        if(beniOku)return;
                        setBeniOku(true);
                    }}
                >
                    <img className='qr-platform' src={qr_platform}/>
                </button>
                {beniOku &&(
                    <>
                    <button className='cik'
                        onClick={()=>{
                            setBeniOku(false);
                            console.log('a');
                        }}
                    >
                        ❌
                    </button>
                    <img className='beni-oku' src={beni_oku}/>
                    </>
                )}
            </div>
        </div>
        )}
        </>
    );
}