import { useState, useEffect, useRef } from 'react';

import menu_start from '../images/menu-start.mp4';
import white_desk from '../images/white-desk.png';
import desk_bottom from '../images/desk-bottom.png';
import desk_behind from '../images/desk-behind.png';
import old_book from '../images/menu-.png';
import naileAplaMouthClosed from '../images/naile-apla/mouth-closed.png';
import naileAplaMouthSemiOpen from '../images/naile-apla/opened-middle.png';
import naileAplaMouthFullOpen from '../images/naile-apla/opened-full.png';
import naileAplaLeftHandBottom from '../images/naile-apla/left-hand-bottom.png';
import naileAplaLeftHandMiddle from '../images/naile-apla/left-hand-middle.png';
import naileAplaLeftHandTop from '../images/naile-apla/left-hand-top.png';
import naileAplaRightHandBottom from '../images/naile-apla/right-hand-bottom.png';
import naileAplaRightHandMiddle from '../images/naile-apla/right-hand-middle.png';
import naileAplaRightHandTop from '../images/naile-apla/right-hand-top.png';
import naileAplaMouthClosed_ from '../images/naile-apla/mouth-closed-.png';

import './menu.css';

export function Menu({setVideoEnded, videoEnded}){

    const [naileApla, setNaileApla] = useState(naileAplaLeftHandBottom);
    const [i, setI] = useState(1);
    const [isLeftHandBottom, setIsLeftHandBottom] = useState(false);

    const actionRef = useRef('talking');
    const [talk, setTalk] = useState(naileAplaMouthFullOpen);
    const [isSemiOpen, setIsSemiOpen] = useState(false);
 
    const mouthFrames = [
        naileAplaMouthClosed,
        naileAplaMouthSemiOpen,
        naileAplaMouthFullOpen,
        naileAplaMouthSemiOpen
    ];
    const leftHandSequence = [
        naileAplaLeftHandBottom,
        naileAplaLeftHandMiddle,
        naileAplaLeftHandTop,
        naileAplaLeftHandTop,
        naileAplaLeftHandMiddle,
        naileAplaLeftHandBottom
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
                        setNaileApla(naileAplaMouthClosed_);
                        setIsLeftHandBottom(false);
                        break;
                    case 5:
                        setNaileApla(naileAplaRightHandBottom);
                        setIsLeftHandBottom(false);
                        break;
                    case 6:
                        setNaileApla(naileAplaRightHandMiddle);
                        setIsLeftHandBottom(false);
                        break;
                    case 7:
                        setNaileApla(naileAplaRightHandTop);
                        setIsLeftHandBottom(false);
                        break;                        
                }
                
                return nextI > 7 ? 1 : nextI;
            });
        }, 400);

        return () => {
            clearInterval(timer);
            clearTimeout(timeoutId);
        }


    }, []);

    return(
        <>
            <div className='menu'>
                <video
                    className='menu-start-scene'
                    src={menu_start}
                    autoPlay
                    onEnded={()=>setVideoEnded(true)}
                    zIndex='0'
                />
                {videoEnded &&(
                    <>
                    <img className='white-desk' src={white_desk}/>
                    <img className='desk-bottom' src={desk_bottom}/>
                    <img className='desk-behind' src={desk_behind}/>
                    <img className='menu-' src={old_book}/>
                    <img 
                        className='mouth' 
                        src={talk}
                        style={
                            isSemiOpen ?
                                {
                                    height: '13px',
                                    right: '255px',
                                    width: '30px'
                                }
                                :
                                {
                                    height: '11px',
                                    right: '255px',
                                    width: '30px'
                                }
                        }
                    />
                    <img 
                        className='naile-apla' 
                        src={naileApla}
                        style={
                            isLeftHandBottom ? 
                                {
                                    height: '360px',
                                    width: '312px',
                                    right: '165px',
                                    top: '126px'
                                } 
                                : 
                                {
                                    
                                }
                        } 
                    />
                    </>
                )}
            </div>
        </>
    );
}