// Seccion1.jsx
import React from 'react';
import './Home.css';
import { isMobile } from 'react-device-detect';

export default function Seccion5() {
    return (
        <div className="container pb-4">
            <div className='row justify-content-center p-md-5'>
                <div className='col-12 ps-5 pe-5 pb-5 pt-md-2 pt-5'>
                    <h5>En este viaje, recibirás el respaldo de guías espirituales, coaches y facilitadores con la experiencia y conocimientos necesarios para contribuir a tu bienestar.</h5>
                </div>
                <div className='col-md-6 pb-5'>
                    <div className="card" style={{ width: '100%', height: '85vh', boxShadow: '0 0 14px rgba(127, 177, 230, 0.8)' }}>
                        <img className="card-img-top" src="/img/junta.webp" alt="Card image cap" />
                        <div className="card-body">
                            <h3>7 Juntas de Psicoterapia Gratuitas</h3>
                            <p className="card-text">
                                Revivirás y reconocerás los momentos de tu vida
                                (infancia, adolescencia y edad adulta) que están en el origen de tu sufrimiento
                                actual. Serás capaz de identificar las heridas en tu alma y comprender sus razones,
                                allanando así el camino para iniciar el proceso de sanación.</p>
                        </div>
                    </div>
                </div>
                <div className='col-md-6 pb-5'>
                    <div className="card" style={{ width: '100%', height: '85vh', boxShadow: '0 0 14px rgba(127, 177, 230, 0.5)' }}>
                        <img className="card-img-top" src="/img/cielo.webp" alt="Card image cap" />
                        <div className="card-body">
                            <h3>Experiencia Espiritual</h3>
                            <p className="card-text">
                                Este evento tiene lugar en una hacienda campestre, un entorno
                                verdaderamente mágico. Durante estos tres días, establecerás conexión con tu fuerza superior
                                (Dios, el Universo o como lo percibas) y contigo mismo. Te sumergirás en un viaje espiritual con el
                                objetivo de aprender a perdonarte a ti mismo y a los demás, liberándote de las cargas que actualmente te están afectando.</p>
                        </div>
                    </div>
                </div>
                <div className='col-12 p-4'>
                    <h2 className='pb-5'>Fraternidad Sendero De Luz México AC, Grupo de Córdoba Local B</h2>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3775.1142497721926!2d-96.92989252533943!3d18.882012058034935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85c4e55a161a87bf%3A0xf97ce1fd4c2165e6!2sFraternidad%20Sendero%20De%20Luz%20M%C3%A9xico%20AC%2C%20Grupo%20de%20C%C3%B3rdoba%20Local%20B!5e0!3m2!1ses-419!2smx!4v1705871949594!5m2!1ses-419!2smx" 
                    width={isMobile ? '100%' : '800'} 
                    height={isMobile ? '300px' : '300px'}
                    allowfullscreen="" 
                    loading="lazy" 
                    referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
            </div>
        </div>
    );
}
