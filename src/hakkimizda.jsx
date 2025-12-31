import hakkimizda_start from '../images/hakkimizda-start.mp4';

import './hakkimizda.css';

export function Hakkimizda(){
    return(
        <>
            <div
                className='hakkimizda'
            >
                <video
                    className='hakkimizda-start-scene'
                    src={hakkimizda_start}
                    autoPlay
                    style={
                        {zIndex:'0'}
                    }
                />
            </div>
        </>
    );
}