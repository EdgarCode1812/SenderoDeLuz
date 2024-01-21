import React, { useState, useEffect } from 'react';
import { Nav, NavItem, NavLink, Container, Row, Col } from 'react-bootstrap';
import { isMobile } from 'react-device-detect';
import './Dashboar.css'
import Curriculums from './Curriculums/Curriculums';
import UsuariosMenu from './usuarios/UsuariosMenu';
import MenuProductos from './productos/MenuProductos';
import { LocalStorageService } from '../../services/LocalStorageService';
import Clientes from './clientes/Clientes';
import Proveedores from './proveedores/Proveedores';
import FacturasClientesEmail from './facturas/FacturasClientesEmail';
import PedidosAdmin from './pedidos/pedidosAdmin/PedidosAdmin';
import PedidosClientes from './pedidos/pedidosClientes/PedidosClientes';
import VerComprobantes from './comprobantes/comprobantesAdmin/VerComprobantes'
import VerComprobanteProveedor from './comprobantes/comprobantesProveedor/VerComprobanteProveedor'
import Empleados from './empleados/Empleados';

export default function Dashboar() {

    const [currentSection, setCurrentSection] = useState(0);
    const [showMenu, setShowMenu] = useState(true);
    const [userEmail, setUseEmail] = useState(false);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {

        const role = LocalStorageService.getRole();
        setUserRole(role)
        if (role === 'Proveedor') {
            setCurrentSection(8)
        } else {
            setCurrentSection(1)
        }

    }, []);

    const handleNext = (value) => {
        setCurrentSection(value);
        if (isMobile) {
            setShowMenu(false);
        }
    }

    const handleBackToMenu = () => {
        setShowMenu(true); // Mostrar el menú cuando se hace clic en "Regresar"
    }

    const renderSection = () => {
        switch (currentSection) {
            case 1:
                if (userRole === 'Admin') {
                    return <PedidosAdmin handleBackToMenu={handleBackToMenu} />
                } else if (userRole === 'Cliente') {
                    return <PedidosClientes handleBackToMenu={handleBackToMenu} />
                }

            case 2:
                return <Clientes handleBackToMenu={handleBackToMenu} />
            case 3:
                return <FacturasClientesEmail handleBackToMenu={handleBackToMenu} />
            case 4:
                return <MenuProductos handleBackToMenu={handleBackToMenu} />
            case 5:
                return <UsuariosMenu handleBackToMenu={handleBackToMenu} />
            case 6:
                return <Curriculums handleBackToMenu={handleBackToMenu} />
            case 7:
                return <Proveedores handleBackToMenu={handleBackToMenu} />
            case 8:
                if (userRole === 'Admin') {
                    return <VerComprobantes handleBackToMenu={handleBackToMenu} />
                } else if (userRole === 'Proveedor') {
                    return <VerComprobanteProveedor handleBackToMenu={handleBackToMenu} />
                }
            case 9:
                return <Empleados handleBackToMenu={handleBackToMenu} />
            default:
                return null;
        }
    };

    return (
        <Container fluid className='container-dash'>

            <Row className={`${isMobile ? 'w-edit-110' : 'w-edit-90'}`}>
                {showMenu && (
                    // Container opciones
                    <Col md={isMobile ? 12 : 3} className='bg-options'>
                        <Nav className='flex-column proprety'>
                            {(userRole === 'Admin' || userRole === 'Cliente') && (
                                <NavItem className='pt-1'>
                                    <NavLink
                                        className={` ${currentSection === 1 ? 'active' : 'noActive'
                                            } d-flex cursor-pointer`}
                                        onClick={() => handleNext(1)}
                                    >
                                        <span className='pe-2'><img src='/img/icons/pedidos.png' alt='' /></span> Pedidos <span className='ms-auto'><img src='/img/icons/fle.png' alt='' /></span>
                                    </NavLink>
                                </NavItem>
                            )}
                            {(userRole === 'Admin') && (
                                <NavItem className='pt-3'>
                                    <NavLink
                                        className={`${!userEmail ? currentSection === 2 ? 'active cursor-pointer' : 'noActive cursor-pointer' : 'noSocialProvider'
                                            } d-flex`}
                                        onClick={() => handleNext(2)}
                                    >
                                        <span className='pe-2'><img src='/img/icons/clientes.png' alt='' /></span> Clientes <span className='ms-auto'><img src='/img/icons/fle.png' alt='' /></span>
                                    </NavLink>
                                </NavItem>
                            )}

                            {(userRole === 'Cliente') && (
                                <NavItem className='pt-3'>
                                    <NavLink
                                        className={` ${currentSection === 3 ? 'active' : 'noActive'
                                            } d-flex cursor-pointer`}
                                        onClick={() => handleNext(3)}
                                    >
                                        <span className='pe-2'><img src='/img/icons/facturas.png' alt='' /></span>Complementos de Pago<span className='ms-auto'><img src='/img/icons/fle.png' alt='' /></span>

                                    </NavLink>
                                </NavItem>
                            )}
                            {(userRole === 'Admin') && (
                                <NavItem className='pt-3'>
                                    <NavLink
                                        className={` ${currentSection === 4 ? 'active' : 'noActive'
                                            } d-flex cursor-pointer`}
                                        onClick={() => handleNext(4)}
                                    >
                                        <span className='pe-2'><img src='/img/icons/gelatinas.png' alt='' /></span> Producto <span className='ms-auto'><img src='/img/icons/fle.png' alt='' /></span>

                                    </NavLink>
                                </NavItem>
                            )}
                            {(userRole === 'Admin') && (
                                <NavItem className='pt-3'>
                                    <NavLink
                                        className={` ${currentSection === 5 ? 'active' : 'noActive'
                                            } d-flex cursor-pointer`}
                                        onClick={() => handleNext(5)}
                                    >
                                        <span className='pe-2'><img src='/img/icons/usuarios.png' alt='' /></span> Usuarios <span className='ms-auto'><img src='/img/icons/fle.png' alt='' /></span>

                                    </NavLink>
                                </NavItem>
                            )}
                            {(userRole === 'Admin') && (
                                <NavItem className='pt-3'>
                                    <NavLink
                                        className={` ${currentSection === 6 ? 'active' : 'noActive'
                                            } d-flex cursor-pointer`}
                                        onClick={() => handleNext(6)}
                                    >
                                        <span className='pe-2'><img src='/img/icons/cv.png' alt='' /></span> Curriculums <span className='ms-auto'><img src='/img/icons/fle.png' alt='' /></span>

                                    </NavLink>
                                </NavItem>
                            )}
                            {(userRole === 'Admin') && (
                                <NavItem className='pt-3'>
                                    <NavLink
                                        className={` ${currentSection === 7 ? 'active' : 'noActive'
                                            } d-flex cursor-pointer`}
                                        onClick={() => handleNext(7)}
                                    >
                                        <span className='pe-2'><img src='/img/icons/suministrar.png' alt='' /></span> Proveedores <span className='ms-auto'><img src='/img/icons/fle.png' alt='' /></span>

                                    </NavLink>
                                </NavItem>
                            )}
                            {(userRole === 'Admin' || userRole === 'Proveedor') && (
                                <NavItem className='pt-3'>
                                    <NavLink
                                        className={` ${currentSection === 8 ? 'active' : 'noActive'
                                            } d-flex cursor-pointer`}
                                        onClick={() => handleNext(8)}
                                    >
                                        <span className='pe-2'><img src='/img/icons/comprobado.png' alt='' /></span>Complementos de Pago<span className='ms-auto'><img src='/img/icons/fle.png' alt='' /></span>

                                    </NavLink>
                                </NavItem>
                            )}
                            {(userRole === 'Admin') && (
                                <NavItem className='pt-3'>
                                    <NavLink
                                        className={`${!userEmail ? currentSection === 9 ? 'active cursor-pointer' : 'noActive cursor-pointer' : 'noSocialProvider'
                                            } d-flex`}
                                        onClick={() => handleNext(9)}
                                    >
                                        <span className='pe-2'><img src='/img/icons/clientes.png' alt='' /></span> Empleados <span className='ms-auto'><img src='/img/icons/fle.png' alt='' /></span>
                                    </NavLink>
                                </NavItem>
                            )}

                        </Nav>
                    </Col>
                )}
                {((!isMobile && showMenu) || (isMobile && !showMenu)) && (
                    // Container acciones
                    <Col md={isMobile ? 12 : 9} className='bg-actions'>
                        {renderSection()}
                    </Col>
                )}
            </Row>
        </Container>
    )
}
