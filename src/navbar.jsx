import {Link} from 'react-router-dom';
import bonLogo from '../images/bon-logo.png';
import sloganNumara from '../images/sloganNumara.png';
import golgelik from '../images/golgelik.png'
import './navbar.css';

export function NavBar(){
    return(
        <>
        <div className='navbar'>
            <nav className='nav'>
            <Link className='link' to="/anasayfa">
                <img className='logo' src={bonLogo}/>
            </Link>
            <img className='snum' src={sloganNumara}/>
            <Link className='link' to="/anasayfa">Ana Sayfa</Link>
            <Link className='link' to="/menu">Menü</Link>
            <Link className='link' to="hakkimizda">Hakkımızda</Link>
            <Link className='link' to="iletisim">Adres & İletişim</Link>
            </nav>
            <img className='golgelik' src={golgelik}/>
        </div>
        </>
    );
}