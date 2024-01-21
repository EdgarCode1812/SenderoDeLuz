import React from 'react';
import './Header.css'
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import { LocalStorageService } from '../../../services/LocalStorageService';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();
    const loggedUser = LocalStorageService.getToken();
    const handleLogout = async () => {
        try {
            await LocalStorageService.signOut();
            navigate('/Login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };
    return (
        <Navbar style={{ backgroundColor: '#7FB1E6' }} variant="dark" sticky="top">
            <Container fluid>
                <div className='navbar-title'>
                    <Image src="/img/logoSendero.png" width={50} alt="" /> FRATERNIDAD SENDERO DE LUZ
                </div>
                <div className='ms-auto'>
                    <button onClick={handleLogout} className="btn-signOut  me-4 pt-1 pb-1 ps-3 pe-3">
                        Nosotros
                    </button>
                    <button onClick={handleLogout} className="btn-signOut  me-4 pt-1 pb-1 ps-3 pe-3">
                        Psicoterapia gratuita
                    </button>
                </div>
            </Container>
        </Navbar>
    );
}
