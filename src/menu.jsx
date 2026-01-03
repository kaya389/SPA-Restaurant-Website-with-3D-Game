import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {Book} from './book.jsx';

import menu_start from '../images/menu-start.mp4';
import white_desk from '../images/white-desk.png';
import naileAplaMouthClosed from '../images/naile-apla/mouth-closed.png';
import naileAplaMouthSemiOpen from '../images/naile-apla/opened-middle.png';
import naileAplaMouthFullOpen from '../images/naile-apla/opened-full.png';
import naileAplaLeftHandBottom from '../images/naile-apla/left-hand-bottom.png';
import naileAplaLeftHandMiddle from '../images/naile-apla/left-hand-middle.png';
import naileAplaLeftHandTop from '../images/naile-apla/left-hand-top.png';
import brochure from '../images/hakkimizda.png';

import './menu.css';

function NaileApla({setIsSemiOpen, setTalk, setI, setNaileApla, setIsLeftHandBottom}){
 
    const mouthFrames = [
        naileAplaMouthClosed,
        naileAplaMouthSemiOpen,
        naileAplaMouthFullOpen,
        naileAplaMouthSemiOpen
    ];

    useEffect(()=>{
        let timeoutId;

        const animate = () => {
                const randIndex = Math.floor(Math.random() * mouthFrames.length);

                if(randIndex !== 1) setIsSemiOpen(true);
                else setIsSemiOpen(false);

                setTalk(mouthFrames[randIndex]);

                const randTime = Math.random() > 0.8 ? 400 : 150;

                timeoutId = setTimeout(animate, randTime);
        }

        animate();


        
        const timer = setInterval(() => {           
            setI(prevI => {
                let nextI = prevI + 1;

                switch(prevI) {
                    case 1:
                        setNaileApla(naileAplaLeftHandBottom);
                        setIsLeftHandBottom(true);
                        break;
                    case 2:
                        setNaileApla(naileAplaLeftHandMiddle);
                        setIsLeftHandBottom(false);
                        break;
                    case 3:
                        setNaileApla(naileAplaLeftHandTop);
                        setIsLeftHandBottom(false);
                        break;
                    case 4:
                        setNaileApla(naileAplaLeftHandTop);
                        setIsLeftHandBottom(false);
                        break;
                    case 5:
                        setNaileApla(naileAplaLeftHandMiddle);
                        setIsLeftHandBottom(false);
                        break;
                    case 6:
                        setNaileApla(naileAplaLeftHandBottom);
                        setIsLeftHandBottom(true);
                        break;                       
                }
                
                return nextI > 6 ? 1 : nextI;
            });
        }, 800);

        return () => {
            clearInterval(timer);
            clearTimeout(timeoutId);
        }


    }, []);
    return (
        <></>
    );
}

export function Menu({setVideoEnded, videoEnded}){
    const [naileApla, setNaileApla] = useState(naileAplaLeftHandBottom);
    const [i, setI] = useState(1);
    const [isLeftHandBottom, setIsLeftHandBottom] = useState(false);
    const [isTalking, setIsTalking] = useState(false);

    const [talk, setTalk] = useState(naileAplaMouthFullOpen);
    const [isSemiOpen, setIsSemiOpen] = useState(false);

    const navigate = useNavigate()
    

    return(
        <>
            <div className='menu'>
                {!videoEnded ? 
                    (
                        <video
                            className='menu-start-scene'
                            src={menu_start}
                            autoPlay
                            onEnded={()=>setVideoEnded(true)}
                            style={
                                {zIndex:'0',}
                            }
                        />
                    )
                    :
                    (   
                        <>
                        <div className='talking'>
                            {isTalking && (
                            <NaileApla 
                                setIsSemiOpen={setIsSemiOpen}
                                setTalk={setTalk}
                                setI={setI}
                                setNaileApla={setNaileApla}
                                setIsLeftHandBottom={setIsLeftHandBottom}
                            />
                            )}
                            <Book 
                                setIsTalking={setIsTalking}
                            />
                            <div className='naile-apla-with-mouth'>
                                <img 
                                    className='naile-apla' 
                                    src={naileApla}
                                    style={
                                        isLeftHandBottom ? 
                                            {
                                                height: '365px',
                                                width: '425px',
                                                paddingRight: '110px',
                                                paddingBottom: '5px'
                                            } 
                                            : 
                                            {
                                                
                                            }
                                    } 
                                />
                                <img 
                                    className='mouth' 
                                    src={talk}
                                    style={
                                        isSemiOpen ?
                                            {
                                                height: '13px',
                                                right: '255px',
                                                width: '37px'
                                            }
                                            :
                                            {
                                                height: '11px',
                                                right: '255px',
                                                width: '37px'
                                            }
                                    }
                                />
                            </div>
                            <div 
                                className='desk-button'
                                style={
                                    isLeftHandBottom ? {
                                        transform: 'translateY(-78px)'
                                    }:{
                                        transform: 'translateY(-45px)'
                                    }
                                }
                            >
                                <img className='white-desk' src={white_desk}/>
                                <button 
                                    className='brochure-button'
                                    style={{
                                        transition: 'border 0.2s ease'
                                    }}
                                    onClick={()=>{
                                        navigate('/hakkimizda');
                                    }}
                                >
                                    <img className='brochure' src={brochure}/>
                                </button>
                            </div>
                        </div>
                        </>
                    )
                }
            </div>
        </>
    );
}