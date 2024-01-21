import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Button, Container, Col, Row } from 'react-bootstrap';
import '../Pedidos.css'

export default function ModalDetallesPedidoCliente({ showModal, closeModalDetalles, detalles, fecha }) {
    const [subTotal, setsubTotal] = useState(0);
    const [iva, setIva] = useState(0);
    const [total, setTotal] = useState(0);
    const [descuento, setDescuento] = useState(0);
    const [textNum, settextNum] = useState('');
    const [fechaFormateada, setFechaFormateada] = useState('');

    const numeroALetras = useCallback(
        (numero) => {
            if (numero > 999999) {
                return 'Número demasiado grande';
            }

            const unidades = ['', 'UN ', 'DOS ', 'TRES ', 'CUATRO ', 'CINCO ', 'SEIS ', 'SIETE ', 'OCHO ', 'NUEVE '];
            const especiales = ['', 'ONCE ', 'DOCE ', 'TRECE ', 'CATORCE ', 'QUINCE ', 'DIECISEIS ', 'DIECISIETE ', 'DIECIOCHO ', 'DIECINUEVE '];
            const decenas = ['', 'DIEZ ', 'VEINTE ', 'TREINTA ', 'CUARENTA ', 'CINCUENTA ', 'SESENTA ', 'SETENTA ', 'OCHENTA ', 'NOVENTA '];
            const centenas = ['', 'CIENTO ', 'DOSCIENTOS ', 'TRESCIENTOS ', 'CUATROCIENTOS ', 'QUINIENTOS ', 'SEISCIENTOS ', 'SETECIENTOS ', 'OCHOCIENTOS ', 'NOVECIENTOS '];

            let letras = '';

            if (numero === 0) {
                letras = 'CERO';
            } else {
                if (numero >= 10000 && numero <= 19999) {
                    letras += 'DIEZ MIL ';
                    numero %= 10000;
                } else if (numero >= 1000) {
                    letras += numeroALetras(Math.floor(numero / 1000)) + 'MIL ';
                    numero %= 1000;
                }

                if (numero >= 100) {
                    if (numero === 100) {
                        letras += 'CIEN ';
                    } else {
                        letras += centenas[Math.floor(numero / 100)];
                    }
                    numero %= 100;
                }

                if (numero >= 10 && numero <= 19) {
                    if (numero === 10) {
                        letras += 'DIEZ ';
                    } else {
                        letras += especiales[numero - 10];
                    }
                } else {
                    if (numero >= 20) {
                        letras += decenas[Math.floor(numero / 10)];
                        numero %= 10;
                    }

                    if (numero > 0) {
                        letras += unidades[numero];
                    }
                }
            }

            return letras.trim();
        },
        []
    );
    useEffect(() => {
        const fechaRecibida = fecha;
        const fechaObjeto = new Date(fechaRecibida);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const fechaFormateadaString = fechaObjeto.toLocaleDateString('es-ES', options);
        setFechaFormateada(fechaFormateadaString);
        let sumaImportes = 0;
        let sumaDescuentos = 0;
        detalles.forEach(item => {
            sumaImportes += parseFloat(item.importe);
            sumaDescuentos += parseFloat(item.descuento);
        });
        const porcentajeDescuento = 0;
        const descuentoCalculado = (porcentajeDescuento / 100) * sumaImportes;
        const totalCalculado = sumaImportes - sumaDescuentos - descuentoCalculado;

        setsubTotal(sumaImportes);
        setIva(descuentoCalculado);
        setDescuento(sumaDescuentos);
        setTotal(totalCalculado)
        settextNum(numeroALetras(totalCalculado));
    }, [detalles, numeroALetras, fecha]);

    const fetchImage = async (imageUrl) => {
        try {
            const response = await fetch(imageUrl, {
                mode: "cors"
            });
            const blob = await response.blob();

            return new Promise((resolve, reject) => {
                // Convierte el blob a base64
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64data = reader.result;
                    resolve(base64data);
                };
                reader.onerror = (error) => {
                    console.error('Error al cargar la imagen:', error);
                    reject(error);
                };
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Error al cargar la imagen:', error);
            throw error;
        }
    };

    const generatePDF = async () => {
   
    };

    return (
        <Modal show={showModal} onHide={closeModalDetalles} dialogClassName="modal-xl">
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <Container>
                    <Row className='justify-content-center pb-2'>
                        <Col lg={3} className='text-center'>
                            <img src='/img/logo.png' width={180} alt='' />
                        </Col>
                        <Col lg={8} className='text-center pt-1'>
                            <h1>Gelatinas Corona</h1>
                            <h4>!Más Corona Que Nunca!</h4>
                            <strong>R.F.C.: </strong><span> VACM820529LS4</span><br />
                            <span><strong>Calle:</strong> ORIENTE 27 No. 573, Col. SAN CARLOS, <strong>CP:</strong> 94320, ORIZABA, VERACRUZ, MEXICO</span><br />
                            <span> <strong>Fecha Pedido: </strong> {fechaFormateada} </span>
                        </Col>
                    </Row>

                    <div className='pb-5 mt-5 pe-1 ps-1'>
                        <table className="tabla text-center">
                            <thead>
                                <tr>
                                    <th className='p-2' scope="col">Cantidad</th>
                                    <th className='p-2'>Clave</th>
                                    <th className='p-2'>Descripción</th>
                                    <th className='p-2'>Descuento</th>
                                    <th className='p-2'>Importe</th>

                                </tr>
                            </thead>
                            <tbody>
                                {detalles.length > 0 ? (
                                    detalles.map((item, index) => (
                                        <tr key={index}>
                                            <td className='p-2'>{item.cantidad}</td>
                                            <td className='p-2'>{item.producto_clave}</td>
                                            <td className='p-2'>{item.producto_descripcion}</td>
                                            <td className='p-2'>$ {parseFloat(item.descuento).toLocaleString('es-MX')}</td>
                                            <td className='p-2'>$ {parseFloat(item.importe).toLocaleString('es-MX')}</td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td>
                                            <h1 className='no-items'>No hay pedidos</h1>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Row className='justify-content-end'>
                        <Col lg={4} className='font-bold'>
                            <div class="d-flex bd-highlight mb-3">
                                <div class="bd-highlight">Subtotal</div>
                                <div class="ms-auto bd-highlight">$ {parseFloat(subTotal).toLocaleString('es-MX')}</div>
                            </div>
                            <div class="d-flex bd-highlight mb-3">
                                <div class="bd-highlight">Descuento</div>
                                <div class="ms-auto bd-highlight">$ {parseFloat(descuento).toLocaleString('es-MX')}</div>
                            </div>
                            <div class="d-flex bd-highlight mb-3">
                                <div class="bd-highlight">I.V.A.</div>
                                <div class="ms-auto bd-highlight">$ {parseFloat(iva).toLocaleString('es-MX')}</div>
                            </div>
                            <div class="d-flex bd-highlight mb-3">
                                <div class="bd-highlight">Total</div>
                                <div class="ms-auto bd-highlight">$ {parseFloat(total).toLocaleString('es-MX')}</div>
                            </div>
                        </Col>
                    </Row>
                    <Row className='pt-3'>
                        <strong>{textNum} PESOS 00/100 M.N</strong>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="success" onClick={generatePDF}>
                    Descargar PDF
                </Button>
                <Button variant="secondary" onClick={closeModalDetalles}>
                    Cerrar
                </Button>
                {/* Puedes agregar más botones de acción si es necesario */}
            </Modal.Footer>
        </Modal>
    );
}
