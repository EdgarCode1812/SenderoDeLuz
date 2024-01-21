import React, { useState, useEffect } from 'react';
import { Button, Modal, Row, Col, Container } from 'react-bootstrap';
import Loading from '../../../shared/loading/Loading';
import '../../pedidos/Pedidos.css';
import { getProductos } from '../../../../services/apiPedidos';

export default function ModalAgregarPedidoCliente({ handleClose, handleShow, show,  addProductos}) {
    const [loading, setLoading] = useState(true);
    const [productos, setProductos] = useState([]);
    const [detallesPedidos, setDetallesPedidos] = useState({});

    const incrementarContador = (productId, precio_unitario, clave) => {
        setDetallesPedidos((prevDetalles) => {
            const newDetalles = { ...prevDetalles };

            if (!newDetalles[productId]) {
                newDetalles[productId] = {
                    producto_clave: clave,
                    cantidad: 1,
                    descuento: "0.00",
                    importe: precio_unitario,
                };
            } else {
                newDetalles[productId] = {
                    ...newDetalles[productId],
                    cantidad: newDetalles[productId].cantidad + 1,
                    importe: ((newDetalles[productId].cantidad + 1) * precio_unitario).toFixed(2),
                };
            }

            return newDetalles;
        });
    };


    const decrementarContador = (productId, precio_unitario) => {
        setDetallesPedidos((prevDetalles) => {
            const newDetalles = { ...prevDetalles };

            if (newDetalles[productId] && newDetalles[productId].cantidad > 1) {
                newDetalles[productId] = {
                    ...newDetalles[productId],
                    cantidad: newDetalles[productId].cantidad - 1,
                    importe: ((newDetalles[productId].cantidad - 1) * precio_unitario).toFixed(2),
                };
            } else {
                delete newDetalles[productId];
            }

            return newDetalles;
        });
    };


    useEffect(() => {
        fetchGetAllProductos();
    }, []);

    const fetchGetAllProductos = async () => {
        setLoading(false);
        try {
            const productosData = await getProductos();
            setLoading(true);
            setProductos(productosData.productos);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Productos</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {loading ? (
                        productos.map((item, index) => (
                            <Row key={item.id}>
                                <Col lg={4} className='text-start p-2 ps-4'>
                                    <p className='product-description'>{item.descripcion}</p>
                                </Col>
                                <Col lg={4} className='text-center p-2'>
                                    <p className='product-price'>$ {item.precio_unitario}</p>
                                </Col>
                                <Col lg={4} className='text-center p-2'>
                                    <div className="d-flex justify-content-center">
                                        <div className="p-2">
                                            <img src='/img/icons/menos.png' className='btn-img-menos cursor' width={25} alt='' onClick={() => decrementarContador(item.id, item.precio_unitario, item.clave)} />
                                        </div>
                                        <div className="p-2 pt-2">
                                            <strong>{detallesPedidos[item.id]?.cantidad || 0}</strong>
                                        </div>
                                        <div className="p-2">
                                            <img src='/img/icons/mas.png' className='btn-img-mas cursor' width={22} alt='' onClick={() => incrementarContador(item.id, item.precio_unitario, item.clave)} />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        ))
                    ) : (
                        <Container style={{ height: '100vh' }}>
                            <Loading />
                        </Container>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={() => addProductos(detallesPedidos)}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
