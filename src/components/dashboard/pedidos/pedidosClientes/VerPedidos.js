import React, { useState } from 'react'
import { Container, Row } from 'react-bootstrap';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import Loading from '../../../shared/loading/Loading';
import ModalDetallesPedidoCliente from './ModalDetallesPedidoCliente';
import '../Pedidos.css'

export default function VerPedidos({ optionRender, pedidos, loading }) {

    const [showModal, setShowModal] = useState(false);
    const [detalles, setDetalles] = useState([]);
    const [fecha, setFecha] = useState("");

    const closeModalDetalles = () => {
        setDetalles([])
        setShowModal(false);
        setFecha("");
    }
    const openModalDetalles = (detallesPedido, fechaPedido) => {
        setShowModal(true);
        setDetalles(detallesPedido);
        setFecha(fechaPedido);
    }
    return (

        <Container className="content-menu-productos">
            {loading ? (
                <>
                    <Row className='add-user pt-4'>
                        <div className='d-flex'>
                            <div className='p-2'><img src='/../img/icons/flecha-izquierda.png' className='cursor' alt='' onClick={() => optionRender(0)} /></div>
                            <div className='p-2'><h1>Mis pedidos</h1></div>
                        </div>
                    </Row>
                    <div className='table-position mt-4 pe-1 ps-1'>
                        <table className="tabla text-center">
                            <thead>
                                <tr>
                                    <th className='p-2' scope="col">Número</th>
                                    <th className='p-2'>Nombre</th>
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
                                            <th scope="row">{index + 1}</th>
                                            <td className='p-2'>{item.nombre_cliente}</td>
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
                                                <button type="button" className="btn btn-outline-primary" onClick={() => openModalDetalles(item.detalles, item.fecha)}>Ver detalles</button>
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
            <ModalDetallesPedidoCliente showModal={showModal} closeModalDetalles={closeModalDetalles} detalles={detalles} fecha = {fecha}/>
        </Container >
    )
}
