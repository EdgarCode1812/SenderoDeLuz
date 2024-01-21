import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import '../Pedidos.css'
import AgregarPedido from './AgregarPedido';
import VerPedidos from './VerPedidos';
import { LocalStorageService } from '../../../../services/LocalStorageService';
import { getPedidoCliente } from '../../../../services/apiPedidos'
import { isMobile } from 'react-device-detect';


export default function PedidosClientes({ handleBackToMenu }) {
    const [currentSection, setCurrentSection] = useState(0);
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGetPedidosUser();
    }, []);
    const fetchGetPedidosUser = async () => {
        setLoading(false)
        const idUser = LocalStorageService.getId();
        try {
            const facturasData = await getPedidoCliente(idUser);
            setLoading(true)
            setPedidos(facturasData.pedidos);
        } catch (error) {
            console.error(error);
        }
    };

    const optionRender = (value) => {
        if (value == 0) fetchGetPedidosUser();
        setCurrentSection(value);
    }

    const renderSection = (pedidosRender, loadingRender) => {
        switch (currentSection) {
            case 1:
                return <AgregarPedido optionRender={optionRender} pedidosRender={pedidosRender} />
            case 2:
                return <VerPedidos optionRender={optionRender} pedidos={pedidosRender} loading={loadingRender} />
            default:
                return null;
        }
    };

    return (
        <Container className="content-menu-productos">
            {currentSection === 0 ? (
                <>
                    {isMobile && (
                        <>
                            <div className='pe-3'>
                                <img onClick={() => handleBackToMenu()} src='img/icons/flecha-izquierda.png' width={25} alt='' />
                            </div>
                            <div><h3> Regresar</h3></div>
                        </>
                    )}
                    <Row className='pt-5 justify-content-center'>
                        <Col lg={3} xs={12} className="p-2" onClick={() => optionRender(1)}>
                            <div className='card-menu-productos cursor text-center p-3'>
                                <img src='/img/icons/boton-agregar.png' width={50} alt='' />
                                <h1 className='pt-4'>Agregar Pedido</h1>
                            </div>
                        </Col>
                        <Col lg={3} xs={12} className="p-2" onClick={() => optionRender(2)}>
                            <div className='card-menu-productos cursor text-center p-3'>
                                <img src='/img/icons/frecuencia.png' width={50} alt='' />
                                <h1 className='pt-4'>Ver mis Pedidos</h1>
                            </div>
                        </Col>
                    </Row>
                </>
            ) : (
                <Row>
                    {renderSection(pedidos, loading)}
                </Row>
            )}

        </Container>
    )
}
