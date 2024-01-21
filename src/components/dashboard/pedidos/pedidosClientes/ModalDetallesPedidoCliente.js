import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Button, Container, Col, Row } from 'react-bootstrap';
import '../Pedidos.css'
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { PdfMakeWrapper, Txt, Columns, Img, Table, Cell } from 'pdfmake-wrapper';

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
                ...detalles.map((item, index) => [
                    new Txt(item.cantidad).end,
                    new Txt(item.producto_clave).end,
                    new Txt(item.producto_descripcion).end,
                    new Txt(item.descuento || 0).end,
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
                    `$ ${parseFloat(descuento).toLocaleString('es-MX')}`
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
                pdf.create().download('detalles_pedido_cliente.pdf');
            }
        } catch (error) {
            console.error('Error al generar el PDF:', error);
        }
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
