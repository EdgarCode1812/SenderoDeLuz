import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Button, Container, Col, Row } from 'react-bootstrap';
import '../Pedidos.css'
import { changePedidobyAdmin, getPedidobyAdmin } from '../../../../services/apiPedidos';
import Loading from '../../../shared/loading/Loading';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { PdfMakeWrapper, Txt, Columns, Img, Table, Cell } from 'pdfmake-wrapper';

export default function ModalDetallesPedidoAdmin({ showModal, closeModalDetalles, fetchGetPedidosUser, fecha, idPedido, estadoInicial }) {
    const [subTotal, setsubTotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [iva, setIva] = useState(0);
    const [pedidoData, setPedidoData] = useState({});
    const [textNum, settextNum] = useState('');
    const [fechaFormateada, setFechaFormateada] = useState('');
    const [estadoPedido, setEstadoPedido] = useState();


    const [pedido, setPedido] = useState([]);
    const [loading, setLoading] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [descuentos, setDescuentos] = useState({});
    const [totalDescuentos, setTotalDescuentos] = useState(0);

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
        PdfMakeWrapper.setFonts(pdfFonts);

        // Variable para rastrear si la imagen está lista
        let isImageReady = false;

        try {
            const pdf = new PdfMakeWrapper();

            // Logo y detalles de la empresa
            const logoBase64 = await fetchImage("/img/logo.png");
            console.log(logoBase64);

            // Actualiza la variable isImageReady cuando la imagen está lista
            isImageReady = true;

            // Agrega la imagen al PDF solo si está lista
            if (isImageReady) {
                pdf.add(new Img(logoBase64).build());
            }

            pdf.add(new Txt('Gelatinas Corona').bold().fontSize(16).alignment('center').end);
            pdf.add(new Txt('\n').end);
            pdf.add(new Txt('¡Más Corona Que Nunca!').bold().fontSize(14).alignment('center').end);
            pdf.add(new Txt('\n').end);
            pdf.add(new Txt('R.F.C.: VACM820529LS4').end);
            pdf.add(new Txt('\n').end);
            pdf.add(new Txt('Calle: ORIENTE 27 No. 573, Col. SAN CARLOS, CP: 94320, ORIZABA, VERACRUZ, MEXICO').end);
            pdf.add(new Txt('\n').end);
            pdf.add(new Txt(`Fecha Pedido: ${fechaFormateada}`).end);
            pdf.add(new Txt('\n').end);
            pdf.add(new Txt('\n').end);

            // Crea la tabla y la agrega al documento
            const tableBody = [
                [
                    new Txt('Cantidad').bold().end,
                    new Txt('Clave').bold().end,
                    new Txt('Descripción').bold().end,
                    new Txt('Descuento').bold().end,
                    new Txt('Importe').bold().end,
                ],
                ...pedido.map((item, index) => [
                    new Txt(item.cantidad).end,
                    new Txt(item.producto_clave).end,
                    new Txt(item.producto_descripcion).end,
                    new Txt(descuentos[index] || 0).end,
                    new Txt(`$ ${parseFloat(item.importe).toLocaleString('es-MX')}`).end,
                ]),
            ];

            pdf.add(
                new Table(tableBody)
                    .widths(['*', '*', '*', '*', '*']) // Distribuye el ancho por igual
                    .layout({
                        hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1 : 0,
                        vLineWidth: (i, node) => 0,
                    })
                    .end
            );

            // Agrega la sección de resumen de totales alineada a la derecha
            pdf.add(new Txt('\n').end);
            pdf.add(new Txt('\n').end);
            pdf.add(
                new Columns([
                    new Txt('Subtotal').end,
                    `$ ${parseFloat(subTotal).toLocaleString('es-MX')}`
                ]).columnGap(10).alignment('right').end
            );

            pdf.add(
                new Columns([
                    new Txt('Descuento').end,
                    `$ ${parseFloat(totalDescuentos).toLocaleString('es-MX')}`
                ]).columnGap(10).alignment('right').end
            );

            pdf.add(
                new Columns([
                    new Txt('I.V.A.').end,
                    `$ ${parseFloat(iva).toLocaleString('es-MX')}`
                ]).columnGap(10).alignment('right').end
            );

            pdf.add(
                new Columns([
                    new Txt('Total').end,
                    `$ ${isNaN(total) ? parseFloat(subTotal).toLocaleString('es-MX') : parseFloat(total).toLocaleString('es-MX')}`
                ]).columnGap(10).alignment('right').end
            );

            pdf.add(new Txt('\n').end);
            pdf.add(new Txt('\n').end);

            pdf.add(new Txt(`${textNum}  PESOS 00/100 M.N`).end);

            // Crea y descarga el PDF solo si la imagen está lista
            if (isImageReady) {
                pdf.create().download('detalles_pedido.pdf');
            }
        } catch (error) {
            console.error('Error al generar el PDF:', error);
        }
    };




    const fetchGetPedidobyUser = useCallback(async () => {
        try {
            const pedidoData = await getPedidobyAdmin(idPedido);
            setLoading(true);
            setPedidoData(pedidoData.pedido_detalles);
            const fechaRecibida = fecha;
            const fechaObjeto = new Date(fechaRecibida);
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            const fechaFormateadaString = fechaObjeto.toLocaleDateString('es-ES', options);
            setFechaFormateada(fechaFormateadaString);

            const detalles = pedidoData.pedido_detalles.detalles;
            setPedido(detalles);
            let sumaImportes = 0;
            detalles.forEach((item) => {
                sumaImportes += parseFloat(item.importe);
            });

            setsubTotal(sumaImportes);
            // Inicializa los descuentos a partir de los detalles del pedido
            const descuentosIniciales = {};
            detalles.forEach((item, index) => {
                descuentosIniciales[index] = parseFloat(item.descuento);
            });
            setDescuentos(descuentosIniciales);

            const porcentajeDescuento = 0;
            const descuentoCalculado = (porcentajeDescuento / 100) * sumaImportes;
            setIva(descuentoCalculado);
        } catch (error) {
            console.error(error);
        }
    }, [idPedido, fecha]);

    useEffect(() => {
        const fetchData = async () => {
            if (showModal) {
                await fetchGetPedidobyUser();
                setEstadoPedido(estadoInicial);
            }
        };

        fetchData();
    }, [showModal, estadoInicial, fetchGetPedidobyUser]);

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
        const totalDescuentos = Object.values(descuentos).reduce((total, descuento) => total + descuento, 0);
        setTotalDescuentos(totalDescuentos);

        const totalResta = subTotal - totalDescuentos + iva;
        setTotal(totalResta);
        const letras = numeroALetras(totalResta);
        settextNum(letras);
    }, [descuentos, subTotal, iva, numeroALetras]);


    const sendChanges = async () => {
        if (!pedidoData || !pedidoData.detalles) {
            console.error('PedidoData o detalles es undefined');
            return;
        }

        // Copia el objeto pedidoData para no modificar el original directamente
        const nuevoPedidoData = { ...pedidoData };

        // Actualiza los descuentos en detalles según el objeto descuentos
        nuevoPedidoData.detalles = nuevoPedidoData.detalles.map((detalle, index) => {
            // Verifica si hay un descuento definido para este índice en el objeto descuentos
            if (descuentos.hasOwnProperty(index)) {
                // Actualiza el descuento en el detalle con el valor correspondiente del objeto descuentos
                detalle.descuento = descuentos[index];
            }
            return detalle;
        });

        const detallesArray = nuevoPedidoData.detalles.map((detalle) => ({
            producto_clave: detalle.producto_clave,
            cantidad: detalle.cantidad,
            descuento: detalle.descuento,
            importe: detalle.importe,
            detalle_id: detalle.detalle_id,
            direccion: detalle.direccion,
            producto_descripcion: detalle.producto_descripcion,
            producto_id: detalle.producto_id,
        }));

        const formData = {
            cliente: pedidoData.cliente_id,
            subtotal: pedidoData.subtotal,
            descuento: totalDescuentos,
            desc_fin: pedidoData.desc_fin,
            ieps: pedidoData.ieps,
            ret_isr: pedidoData.ret_isr,
            ret_iva: pedidoData.ret_iva,
            iva: pedidoData.iva,
            total: total,
            estado: estadoPedido,
            direccion: pedidoData.direccion,
            descargado: pedidoData.descargado,
            horaentrega: pedidoData.horaentrega,
            detallespedidos: detallesArray,
        };
        setBtnDisabled(true);
        try {
            await changePedidobyAdmin(formData, pedidoData.pedido_id);
            setBtnDisabled(false);
            setLoading(false);
            closeModal();
            fetchGetPedidosUser();
        } catch (error) {
            console.error(error);
        }
    };

    const closeModal = () => {
        closeModalDetalles();
        setLoading(false);
    };



    return (
        <Modal show={showModal} onHide={closeModal} dialogClassName="modal-xl">
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {loading ? (
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
                        <Row className='pt-4'>
                            <Col lg={6}>
                                <label htmlFor="estadoPedido" className="form-label">Estado del Pedido:</label>
                                <select
                                    className="form-select"
                                    id="estadoPedido"
                                    value={estadoPedido}
                                    onChange={(e) => setEstadoPedido(e.target.value)}
                                >
                                    <option value="pendiente">Pendiente</option>
                                    <option value="cancelado">Cancelado</option>
                                    <option value="entregado">Entregado</option>
                                </select>
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
                                    {pedido.length > 0 ? (
                                        pedido.map((item, index) => (
                                            <tr key={index}>
                                                <td className='p-2'>{item.cantidad}</td>
                                                <td className='p-2'>{item.producto_clave}</td>
                                                <td className='p-2'>{item.producto_descripcion}</td>
                                                {/* Dentro del cuerpo del modal */}
                                                <td className='p-2'>
                                                    <div className="input-group">
                                                        <span className="input-group-text">$</span>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={descuentos[index] || ''}
                                                            onChange={(e) => {
                                                                const inputValue = e.target.value;
                                                                const newDescuentos = {
                                                                    ...descuentos,
                                                                    [index]: inputValue === '' || isNaN(parseFloat(inputValue)) ? 0 : parseFloat(inputValue),
                                                                };
                                                                setDescuentos(newDescuentos);
                                                            }}
                                                        />
                                                    </div>
                                                </td>


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
                                <div className="d-flex bd-highlight mb-3">
                                    <div className="bd-highlight">Subtotal</div>
                                    <div className="ms-auto bd-highlight">$ {parseFloat(subTotal).toLocaleString('es-MX')}</div>
                                </div>
                                <div className="d-flex bd-highlight mb-3">
                                    <div className="bd-highlight">Descuento</div>
                                    <div className="ms-auto bd-highlight">
                                        {isNaN(totalDescuentos) ? '$ 0.00' : `$ ${parseFloat(totalDescuentos).toLocaleString('es-MX')}`}
                                    </div>
                                </div>

                                <div className="d-flex bd-highlight mb-3">
                                    <div className="bd-highlight">I.V.A.</div>
                                    <div className="ms-auto bd-highlight">$ {parseFloat(iva).toLocaleString('es-MX')}</div>
                                </div>
                                <div className="d-flex bd-highlight mb-3">
                                    <div className="bd-highlight">Total</div>
                                    <div className="ms-auto bd-highlight">    ${isNaN(total) ? parseFloat(subTotal).toLocaleString('es-MX') : parseFloat(total).toLocaleString('es-MX')}</div>
                                </div>
                            </Col>
                        </Row>
                        <Row className='pt-3'>
                            <strong>{textNum} PESOS 00/100 M.N</strong>
                        </Row>
                    </Container>
                ) : (
                    <Container style={{ height: '100vh' }}>
                        <Loading />
                    </Container>
                )}

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={sendChanges} disabled={btnDisabled}>
                    Enviar
                </Button>
                <Button variant="success" onClick={generatePDF}>
                    Descargar PDF
                </Button>
                {/* Puedes agregar más botones de acción si es necesario */}
            </Modal.Footer>
        </Modal>
    );
}
