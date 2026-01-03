import React, {useRef, useState} from 'react';
import emailjs from '@emailjs/browser';

const IletisimFormu = () => {
    const form = useRef();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const sendEmail = (e) => {
        e.preventDefault();
        setLoading(true);

        emailjs
            .sendForm(
                'service_6urdcuh',
                'template_eu2zl2l',
                form.current,
                {
                    publicKey: 'WS6nlbMhuss-ASRAj',
                }
            )
            .then(
                ()=>{
                    setStatus('success');
                    setLoading(false);
                    form.current.reset();

                    setTimeout(()=>setStatus(''), 3000);
                },
                (error)=>{
                    setStatus('error');
                    setLoading(false);
                },
            );
    };

    return(
        <>
            <form ref={form} onSubmit={sendEmail}>
                <label>İsim</label>
                <p/>
                <input type='text' name='user_name' required/>
                <p/>
                <label>İstek, Görüş ya da Öneriniz:</label>
                <p/>
                <textarea name='message' required/>
                <p/>
                <button
                    type = 'submit'
                    disabled={loading}
                >
                    {loading ? 'Gönderiliyor...' : 'Gönder'}
                </button>

                {status === 'success' && <p>Mesajınız Ulaştı!</p>}
            </form>
        </>
    );
}

import './AdresIletisim.css';

export function AdresIletisim(){
    return (
        <>
        <div className='adres-iletisim'
            style={{
                position: 'absolute',
                zIndex: 12,
                width: '384px',
                height: '40vh',
                top: '100px',
                left: '50%',
                transform: 'translateX(-50%)'
                
            }}
        >
            <div class="corner top left"/>
            <div class="corner top right"/>
            <div class="corner bottom left"/>
            <div class="corner bottom right"/>

            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3186.2861371330464!2d35.32093267565499!3d37.002969572190054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15288f78327b6899%3A0xd98d808b73862d78!2sBon%20Fried%20Chiken!5e0!3m2!1str!2str!4v1766753257850!5m2!1str!2str" 
                width="350px" 
                height="350px" 
                style={{border: 0, pointerEvents: 'auto', zIndex: 15}}
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
            />
        </div>
            <div
                className='adres-form'
            >
                <div>
                <p>
                    📍istanbulluoğlu apt, Cemalpaşa, Ethem Ekin Sk. D:29F, 01120 Seyhan/Adana
                </p>
                <p>
                    ⏳️Açılış: 11.00
                </p>
                <p>
                    ❗Kapanış : Ürün bitimi
                </p>
                <p>
                    BİZE ULAŞIN
                </p>
                ☎️+90 530 337 74 24
                
                </div>
                <IletisimFormu/>
            </div>
        </>
    );
}