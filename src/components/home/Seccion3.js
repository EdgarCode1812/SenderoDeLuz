// Seccion3.jsx
import React from 'react';
import { isMobile } from 'react-device-detect';
import './Home.css';

export default function Seccion3() {
    return (
        <div className="container">
            <div className='row'>
                <div className='col-12 p-5'>
                    <h2>"En la vida no puedes retroceder, pero siempre tienes la oportunidad de comenzar de nuevo."</h2>
                    <img src="/img/logoSendero.png" width={200} alt="" />
                    <h5>
                        "Somos Fraternidad Guerreros de Luz México, un colectivo de hombres y mujeres que anteriormente
                        llevábamos vidas carentes de significado, plagadas de numerosos desafíos personales y familiares que nos
                        impedían experimentar la felicidad."
                    </h5>

                </div>
                <div className='col-12 p-3'>
                    <h2>Te invitamos a visualizar nuestro cortometraje "Un Sendero de Luz </h2>
                </div>
                <div className='col-12 pt-4 pb-2'>
                    <iframe width={isMobile ? '100%' : '60%'} height={isMobile ? '215px' : '415px'} src="https://www.youtube.com/embed/Av4uJQXwjbw?si=FkozuQklp89GqB0J" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>
                <div className='col-12 pt-4 pb-5'>
                    <button type="button" className="btn btn-success ps-4 pe-4">
                        <img src="/img/icons/whatsappBlanco.png" width="25px" alt="" /> Necesito ayuda
                    </button>
                </div>
            </div>
        </div>
    );
}
