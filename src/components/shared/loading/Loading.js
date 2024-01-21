import React from 'react'
import './Loading.css'

export default function Loading() {
    return (
        <div className='loading'>
            <h1>Cargando tabla...</h1>
            <div id="bars">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>
        </div>
    )
}
