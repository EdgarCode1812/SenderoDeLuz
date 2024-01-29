import React from 'react'
import Header from '../components/shared/header/Header'
import Footer from '../components/shared/footer/Footer'
import Noticias from '../components/Noticias/Noticias'



export default function Home() {
    return (
        <div>
            <Header />
                <Noticias />
            <Footer/>
        </div>
    )
}
