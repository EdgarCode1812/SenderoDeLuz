// Seccion1.jsx
import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './Home.css';

export default function Seccion1() {
  return (
    <div className="seccion1-container">
      {/* Carrusel */}
      <Carousel className="carrusel">
        <Carousel.Item>
          <div className="carousel-content text-center">
            <h3>¿Sientes Depresión y Soledad?</h3>
            <p>Te ayudamos</p>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="carousel-content text-center">
            <h3>¿Problemas de Alcohol y Drogas?</h3>
            <p>Te ayudamos</p>
          </div>
        </Carousel.Item>
        {/* Agrega más elementos según sea necesario */}
      </Carousel>
    </div>
  );
}
