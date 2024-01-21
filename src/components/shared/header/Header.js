import React from 'react';
import './Header.css'
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import { LocalStorageService } from '../../../services/LocalStorageService';
import { useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
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
        <Navbar style={{ backgroundColor: '#7FB1E6' }} variant="dark" sticky="top" expand="lg">
            <Container fluid>
                <Navbar.Brand>
                    <Image src="/img/logoSendero.png" width={50} alt="" /> {isMobile ? '' : 'FRATERNIDAD SENDERO DE LUZ'}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                    <Nav>
                        <button className="btn-signOut me-md-4 m-1 pt-1 pb-1 ps-3 pe-3">
                            Nosotros
                        </button>
                        <button className="btn-signOut me-md-4 m-1 pt-1 pb-1 ps-3 pe-3">
                            Psicoterapia gratuita
                        </button>
                        <button className="btn-signOut me-md-4 m-1 pt-1 pb-1 ps-3 pe-3">
                            Noticias
                        </button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
