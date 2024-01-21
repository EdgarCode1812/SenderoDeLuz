import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import { getAllPedidos } from '../../../../services/apiPedidos'
import Loading from '../../../shared/loading/Loading';
import '../Pedidos.css'
import ModalDetallesPedidoAdmin from './ModalDetallesPedidosAdmin';
import { isMobile } from 'react-device-detect';


export default function PedidosAdmin({ handleBackToMenu }) {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [detalles, setDetalles] = useState([]);
    const [fecha, setFecha] = useState("");
    const [idPedido, setIdPedido] = useState();
    const [estadoInicial, setEstadoInicial] = useState();

    const closeModalDetalles = () => {
        setDetalles([])
        setShowModal(false);
        setFecha("");
    }
    const openModalDetalles = (idPedidoModal, fecha, estado) => {
        setShowModal(true);
        setIdPedido(idPedidoModal);
        setFecha(fecha);
        setEstadoInicial(estado);
    }


    useEffect(() => {
        fetchGetPedidosUser();
    }, []);
    const fetchGetPedidosUser = async () => {
        setLoading(false)
        try {
            const facturasData = await getAllPedidos();
            setLoading(true)
            setPedidos(facturasData.gelatinas);
        } catch (error) {
            console.error(error);
        }
    };
    return (

        <Container className="content-menu-productos">
            {loading ? (
                <>
                    {/* <Row className='add-user pt-4'>
                        <div className='d-flex'>
                            <div className='p-2'><img src='/../img/icons/flecha-izquierda.png' className='cursor' alt='' onClick={() => optionRender(0)} /></div>
                            <div className='p-2'><h1>Mis pedidos</h1></div>
                        </div>
                    </Row> */}
                    {isMobile && (
                        <>
                            <div className='pe-3'>
                                <img onClick={() => handleBackToMenu()} src='img/icons/flecha-izquierda.png' width={25} alt='' />
                            </div>
                            <div><h3> Regresar</h3></div>
                        </>
                    )}
                    <div className='table-position mt-4 pe-1 ps-1'>
                        <table className="tabla text-center">
                            <thead>
                                <tr>
                                    <th className='p-2' scope="col">Correo</th>
                                    <th className='p-2'>Dirección</th>
                                    <th className='p-2'>Fecha y Hora</th>
                                    <th className='p-2'>Hora de entrega</th>
                                    <th className='p-2'>Estado</th>
                                    <th className='p-2'>Detalles</th>

                                </tr>
                            </thead>
                            <tbody>
                                {pedidos !== undefined && loading ? (
                                    pedidos.map((item, index) => (
                                        <tr key={index}>
                                            <td >{item.email}</td>
                                            <td className='p-2'>{item.direccion}</td>
                                            <td>
                                                <div>
                                                    {format(new Date(item.fecha), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                                                </div>
                                                <div>
                                                    {format(new Date(item.fecha), "HH:mm:ss", { locale: es })}
                                                </div>
                                            </td>
                                            <td className='p-2'>{item.horaentrega}</td>

                                            <td className={`p-2 ${item.estado === 'pendiente' ? 'bg-pendiente' : item.estado === 'cancelado' ? 'bg-cancelado' : item.estado === 'entregado' ? 'bg-entregado' : ''}`}>
                                                {item.estado}
                                            </td>
                                            <td className='p-2'>
                                                <button type="button" className="btn btn-outline-primary" onClick={() => openModalDetalles(item.id, item.fecha, item.estado)}>Ver detalles</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td>
                                            <h1 className='no-items'>No cuentas con ningun pedido</h1>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <Container style={{ height: '100vh' }}>
                    <Loading />
                </Container>
            )
            }
            <ModalDetallesPedidoAdmin showModal={showModal} closeModalDetalles={closeModalDetalles} fetchGetPedidosUser={fetchGetPedidosUser} detalles={detalles} fecha={fecha} idPedido={idPedido} estadoInicial={estadoInicial} />

        </Container >
    )
}
