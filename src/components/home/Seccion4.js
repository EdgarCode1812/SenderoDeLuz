// Seccion1.jsx
import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './Home.css';

export default function Seccion4() {
    return (
        <div className="seccion4-container">
            {/* Carrusel */}
            <Carousel className="carrusel-seccion4">
                <Carousel.Item>
                    <div className="carousel-content-seccion4 text-center">
                        <h3 className='pb-4' style={{fontSize:'60px'}}>¡Ya no estas solo!</h3>
                        <button type="button" className="btn btn-success ps-4 pe-4">
                             Pedir Ayuda
                        </button>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div className="carousel-content-seccion4 text-center">
                        <h3>Programa Gratuito de Psicoterapia / Vive una experiencia espiritual transformadora</h3>
                    </div>
                </Carousel.Item>
            </Carousel>
        </div>
    );
}
