import React, {useState, useEffect, useRef, useCallback} from 'react';

import {menu} from './whats-in-menu.jsx';

import './book.css';
import { time } from 'three/tsl';

const TypewriterText = React.memo(({text, speed=30, onTypingStart, onTypingEnd}) => {
    const [displayedText, setDisplayedText] = useState('');
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    const audioRef = useRef(new Audio('/typewriter.mp3'));

    const hasStartedRef = useRef(false);

    useEffect(()=>{
        const observer = new IntersectionObserver(
            ([entry])=>{
                setIsVisible(entry.isIntersecting);
            },
            {threshold: 0.5}
        );

        if(containerRef.current){
            observer.observe(containerRef.current);
        }

        return () => {
            if(containerRef.current) observer.unobserve(containerRef.current);
        };
    }, []);

    useEffect(()=>{
        let intervalId;
        let timeoutId;

        const playSound = ()=>{
            if(audioRef.current){
                audioRef.current.time = 0;

                const playPromise = audioRef.current.play();

                if (playPromise !== undefined) {
                    playPromise.catch((error) => {
                    console.log("Tarayıcı otomatik oynatmayı engelledi:", error);
                    // Burada belki ekrana "Sesi açmak için tıkla" butonu koyabilirsin
                    });
                }
            }
        };
        const stopSound = ()=>{
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            if(audioRef.current){
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            if (onTypingEnd && hasStartedRef.current) {
                 onTypingEnd(); 
            }
        }

        if(isVisible){
            if(hasStartedRef.current) return;

            hasStartedRef.current = true;
            
            timeoutId = setTimeout(()=>{
                setDisplayedText('');

                if(onTypingStart){
                    onTypingStart();
                }
                

                let i = 0;
                intervalId = setInterval(()=>{
                    if(i<text.length){
                        setDisplayedText((prev)=>text.substring(0, i + 1));
                        i++;
                        playSound();
                    }else{
                        clearInterval(intervalId);
                        if(onTypingEnd){
                            onTypingEnd();
                            stopSound();
                        }
                    }
                }, speed);
            }, 0);
        }else{
            setDisplayedText('');
            hasStartedRef.current = false;
        }

        return ()=>{
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        }
    }, [isVisible, text, speed]);

    return (
        <span ref={containerRef} style={{ display: 'inline-block', minHeight: '1.5em', minWidth: '10px' }}>
            {displayedText}
        </span>
    );
});

export function Book({setIsTalking}){
    const carouselRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);


    const handleTypingStart = useCallback(()=>{
        setIsTalking(true);
    }, [setIsTalking]);

    const handleTypingEnd = useCallback(() => {
        setIsTalking(false);
    }, [setIsTalking]);

    const scrollToPage = (index) => {
        if(carouselRef.current){
            const width = carouselRef.current.clientWidth;
            carouselRef.current.scrollTo({
                left: width * index,
                behavior: 'smooth'
            });
        }
    };

    const handleScroll = () => {
        if(carouselRef.current){
            const scrollLeft = carouselRef.current.scrollLeft;
            const width = carouselRef.current.clientWidth;
            const newIndex = Math.round(scrollLeft/width);
            setActiveIndex(newIndex);
        }
    }

    const handleNextClick = () => {

        if(carouselRef.current){
            const width = carouselRef.current.clientWidth;
            carouselRef.current.scrollBy({left: width/2, behavior: 'smooth'});
        }
    };

    const handlePrevClick = () => {

        if(carouselRef.current){
            const width = carouselRef.current.clientWidth;
            carouselRef.current.scrollBy({left: -(width/2), behavior: 'smooth'});
        }
    };

    return(
        <div className="container">
            <div className="sprite-wrapper">
                <div className="book">
                    <button className="left-button" onClick={handlePrevClick}>
                        <img src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiB2aWV3Qm94PSIwIDAgMjMyLjAwMDAwMCAyNTYuMDAwMDAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBtZWV0IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdHJhbnNmb3JtPSJtYXRyaXgoLTEsMCwwLDEsMCwwKSI+Cgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwyNTYuMDAwMDAwKSBzY2FsZSgwLjEwMDAwMCwtMC4xMDAwMDApIiBmaWxsPSIjZmZmIiBzdHJva2U9Im5vbmUiPgo8cGF0aCBkPSJNMTE4MCAyMTEwIGwwIC0xODAgLTU0MCAwIC01NDAgMCAwIC03MjUgMCAtNzI1IDU0MCAwIDU0MCAwIDAgLTE4MCAwIC0xODAgMTIwIDAgMTIwIDAgMCA2MCAwIDYwIDYwIDAgNjAgMCAwIDYwIDAgNjAgNjAgMCA2MCAwIDAgNjAgMCA2MCA2MCAwIDYwIDAgMCA2MCAwIDYwIDYwIDAgNjAgMCAwIDYwIDAgNjAgNjAgMCA2MCAwIDAgNjAgMCA2MCA2MCAwIDYwIDAgMCA1MyBjMCAyOSA1IDU4IDEyIDY1IDcgNyAzNCAxMiA2MCAxMiBsNDggMCAwIDIzNSAwIDIzNSAtNjAgMCAtNjAgMCAwIDY1IDAgNjUgLTQ3IDAgYy02OCAwIC03NSAtNyAtNzEgLTcxIGwzIC01NCA1OCAtMyA1NyAtMyAwIC0xMTkgMCAtMTIwIC01NSAwIC01NCAwIC0zIC01NyAtMyAtNTggLTYwIC01IC02MCAtNSAtMyAtNTcgLTMgLTU3IC01NyAtMyAtNTcgLTMgLTMgLTU3IC0zIC01NyAtNTcgLTMgLTU3IC0zIC0zIC01NyAtMyAtNTcgLTU3IC0zIC01NyAtMyAtMyAtNTcgLTMgLTU3IC01NyAtMyAtNTcgLTMgLTMgLTU4IC0zIC01OCAtNTcgMyAtNTcgMyAtMyAxNzggLTIgMTc3IC01NDAgMCAtNTQwIDAgMiA0ODMgMyA0ODIgNTM3IDMgNTM2IDIgNyAzMiBjNCAxNyA2IDk3IDQgMTc3IGwtNCAxNDYgNTggMyA1NyAzIDAgLTYxIDAgLTYwIDYwIDAgNjAgMCAwIC02MCAwIC02MCA2MCAwIDYwIDAgMCAtNjAgMCAtNjAgNjAgMCA2MCAwIDAgLTYwIDAgLTYwIDYwIDAgNjAgMCAwIC02MCAwIC02MCA2MCAwIDYwIDAgMCA2MCAwIDYwIC02MCAwIC02MCAwIDAgNjAgMCA2MCAtNjAgMCAtNjAgMCAwIDYwIDAgNjAgLTYwIDAgLTYwIDAgMCA2MCAwIDYwIC02MCAwIC02MCAwIDAgNjAgMCA2MCAtNjAgMCAtNjAgMCAwIDYwIDAgNjAgLTEyMCAwIC0xMjAgMCAwIC0xODB6Ij48L3BhdGg+CjwvZz4KPC9zdmc+'/>
                    </button>
                    <button className="right-button" onClick={handleNextClick}>
                        <img src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiB2aWV3Qm94PSIwIDAgMjMyLjAwMDAwMCAyNTYuMDAwMDAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBtZWV0Ij4KCjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLDI1Ni4wMDAwMDApIHNjYWxlKDAuMTAwMDAwLC0wLjEwMDAwMCkiIGZpbGw9IiNmZmYiIHN0cm9rZT0ibm9uZSI+CjxwYXRoIGQ9Ik0xMTgwIDIxMTAgbDAgLTE4MCAtNTQwIDAgLTU0MCAwIDAgLTcyNSAwIC03MjUgNTQwIDAgNTQwIDAgMCAtMTgwIDAgLTE4MCAxMjAgMCAxMjAgMCAwIDYwIDAgNjAgNjAgMCA2MCAwIDAgNjAgMCA2MCA2MCAwIDYwIDAgMCA2MCAwIDYwIDYwIDAgNjAgMCAwIDYwIDAgNjAgNjAgMCA2MCAwIDAgNjAgMCA2MCA2MCAwIDYwIDAgMCA2MCAwIDYwIDYwIDAgNjAgMCAwIDUzIGMwIDI5IDUgNTggMTIgNjUgNyA3IDM0IDEyIDYwIDEyIGw0OCAwIDAgMjM1IDAgMjM1IC02MCAwIC02MCAwIDAgNjUgMCA2NSAtNDcgMCBjLTY4IDAgLTc1IC03IC03MSAtNzEgbDMgLTU0IDU4IC0zIDU3IC0zIDAgLTExOSAwIC0xMjAgLTU1IDAgLTU0IDAgLTMgLTU3IC0zIC01OCAtNjAgLTUgLTYwIC01IC0zIC01NyAtMyAtNTcgLTU3IC0zIC01NyAtMyAtMyAtNTcgLTMgLTU3IC01NyAtMyAtNTcgLTMgLTMgLTU3IC0zIC01NyAtNTcgLTMgLTU3IC0zIC0zIC01NyAtMyAtNTcgLTU3IC0zIC01NyAtMyAtMyAtNTggLTMgLTU4IC01NyAzIC01NyAzIC0zIDE3OCAtMiAxNzcgLTU0MCAwIC01NDAgMCAyIDQ4MyAzIDQ4MiA1MzcgMyA1MzYgMiA3IDMyIGM0IDE3IDYgOTcgNCAxNzcgbC00IDE0NiA1OCAzIDU3IDMgMCAtNjEgMCAtNjAgNjAgMCA2MCAwIDAgLTYwIDAgLTYwIDYwIDAgNjAgMCAwIC02MCAwIC02MCA2MCAwIDYwIDAgMCAtNjAgMCAtNjAgNjAgMCA2MCAwIDAgLTYwIDAgLTYwIDYwIDAgNjAgMCAwIDYwIDAgNjAgLTYwIDAgLTYwIDAgMCA2MCAwIDYwIC02MCAwIC02MCAwIDAgNjAgMCA2MCAtNjAgMCAtNjAgMCAwIDYwIDAgNjAgLTYwIDAgLTYwIDAgMCA2MCAwIDYwIC02MCAwIC02MCAwIDAgNjAgMCA2MCAtMTIwIDAgLTEyMCAwIDAgLTE4MHoiLz4KPC9nPgo8L3N2Zz4='/>
                    </button>
                    {/*  Carousel container */}
                    <div 
                        className="carousel" 
                        style={{'--slides': menu.length}}
                        ref={carouselRef}
                        onScroll={handleScroll}
                    >
                        {/*  Bg sprite */}
                        <div className="sprite">
                        </div>
                        {/*  Carousel items */}
                        {
                            menu.map((element, index)=>{
                                return(
                                    <div className="carousel-item" key={index}>
                                        <div className="page-container">
                                            <div className="page left-page">
                                                <div>
                                                    <p 
                                                        style={{
                                                            margin: 0, 
                                                            textIndent: '1rem',
                                                        }}
                                                    >
                                                    <img 
                                                        src={element.src}
                                                        className='food'
                                                    />
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="page right-page">
                                                <div>
                                                    <p 
                                                        style={{
                                                            margin: 0, 
                                                            textIndent: '1rem'
                                                        }}
                                                        className='urun-aciklama'
                                                    >
                                                    <TypewriterText 
                                                        text={element.text}
                                                        speed={50}
                                                        onTypingStart={handleTypingStart}
                                                        onTypingEnd={handleTypingEnd}
                                                    />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className='progress-bar'>
                        {menu.map((_, index)=>(
                            <div
                                key = {index}
                                className = {`progress ${index<=activeIndex ? 'active': ''}`}
                                onClick={()=>scrollToPage(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}