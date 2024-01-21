import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ModalAgregarPedidoCliente from "./ModalAgregarPedidoCliente";
import { sendPedido } from "../../../../services/apiPedidos";
import { LocalStorageService } from "../../../../services/LocalStorageService";
import { format } from "date-fns";

const validationSchema = Yup.object().shape({
    direccion: Yup.string().required("La dirección es requerida"),
    fechaentrega: Yup.string().required("La fecha de entrega es requerida"),
    horaentrega: Yup.string()
        .required("La hora de entrega es requerida")
        .test(
            "validar-hora",
            "La hora de entrega debe ser entre las 9 a. m. y las 8 p. m.",
            function (value) {
                if (!value) {
                    return true;
                }

                const horaEntrega = new Date(`2000-01-01T${value}`);
                const horaMinima = new Date(`2000-01-01T09:00:00`);
                const horaMaxima = new Date(`2000-01-01T20:00:00`);

                return horaEntrega >= horaMinima && horaEntrega <= horaMaxima;
            }

           
    ),
});

// const initialValues = {
//     direccion: '',
//     horaentrega: ''
// };






export default function AgregarPedido({ optionRender, pedidosRender }) {

    const [show, setShow] = useState(false);
    const [pedidos, setPedidos] = useState([]);
    const [subTotal, setsubTotal] = useState(0);
    const [iva, setIva] = useState(0);
    const [total, setTotal] = useState(0);

    const [showAddNewAddress, setShowAddNewAddress] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



    const addProductos = (detalles) => {
        const detallesArray = [];

        for (const key in detalles) {
            if (detalles.hasOwnProperty(key)) {
                detallesArray.push(detalles[key]);
            }
        }

        // Sumar todos los importes en el array de detalles
        const totalImporte = detallesArray.reduce((total, detalle) => {
            // Convierte el importe de cada detalle a un número y suma al total
            return total + parseFloat(detalle.importe);
        }, 0); // El 0 inicializa el total en 0
        setsubTotal(totalImporte)
        setTotal(totalImporte)
        setPedidos(detallesArray);
        setShow(false);
    };

    const handleSubmit = async (values, { resetForm }) => {
        const idUser = LocalStorageService.getId();

        const formData = {
            cliente: idUser,
            direccion: values.direccion,
            subtotal: subTotal,
            descuento: "0.00",
            desc_fin: "0.00",
            ieps: "0.00",
            ret_isr: "0.00",
            ret_iva: "0.00",
            iva: iva,
            total: total,
            estado: "pendiente",
            fechaentrega: values.fechaentrega,
            horaentrega: values.horaentrega,
            descargado: 1,
            detallespedidos: pedidos
        }

        try {
            await sendPedido(formData);
            resetForm();
            optionRender(0)
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container fluid className='add-user pt-4 pb-5'>
            <div className='d-flex'>
                <div className='p-2'><img src='/../img/icons/flecha-izquierda.png' className='cursor' alt='' onClick={() => optionRender(0)} /></div>
                <div className='p-2'><h1>Agregar Pedido</h1></div>
            </div>
            <Formik
                initialValues={{
                    direccion:
                        pedidosRender === undefined ? "" : pedidosRender[0].direccion,
                    fechaentrega: "",
                    horaentrega: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, setFieldValue }) => (
                    <Form>
                        <Row className='pt-3'>
                            <Col lg={1} className="p-2">
                                <div className='card-menu-productos cursor text-center p-3' onClick={handleShow}>
                                    <img src='/img/icons/boton-agregar.png' width={30} alt='' />
                                    {/* <h1 className='pt-4'>Agregar Productos</h1> */}
                                </div>
                            </Col>
                        </Row>
                        {pedidos.length > 0 && (
                            <Row>
                                <div className='table-position-pedidos mt-4 pe-1 ps-1'>
                                    <table className="tabla-pedidos text-center">
                                        <thead>
                                            <tr>
                                                <th className='p-2' scope="col">Número</th>
                                                <th className='p-2'>Cantidad</th>
                                                <th className='p-2'>Clave</th>
                                                <th className='p-2'>Importe</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {pedidos.map((item, index) => (
                                                <tr key={index}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td className='p-2'>{item.cantidad}</td>
                                                    <td className='p-2'>{item.producto_clave}</td>
                                                    <td className='p-2'>{item.importe}</td>
                                                </tr>
                                            ))}
                                        </tbody>

                                    </table>
                                </div>
                            </Row>
                        )}
                        <Row>


                            <Col lg={6} className="form-group-add-user pt-3 text-start">
                                {pedidosRender === undefined ? (
                                    <>
                                        <label>Dirección:</label>
                                        <Field
                                            type="text"
                                            name="direccion"
                                            className="llisting-add-user"
                                        />
                                        <ErrorMessage
                                            name="direccion"
                                            component="div"
                                            className="error-message"
                                        />
                                        {showAddNewAddress && (
                                            <button type="button" onClick={() => { }}>
                                                Agregar Nueva Dirección
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {showAddNewAddress ? (
                                            <>
                                                <label>Dirección:</label>
                                                <Field
                                                    type="text"
                                                    name="direccion"
                                                    className="llisting-add-user"
                                                />
                                                <ErrorMessage
                                                    name="direccion"
                                                    component="div"
                                                    className="error-message"
                                                />
                                                <button
                                                    type="button"
                                                    className="btn-add-user  mt-2"
                                                    onClick={() => {
                                                        setShowAddNewAddress(false);
                                                    }}
                                                >
                                                    Cancelar
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <label>Seleccionar Dirección:</label>
                                             <Field
    as="select"
    name="direccion"
    className="llisting-add-user"
>
    {Array.from(new Set(pedidosRender.map(pedido => pedido.direccion))).map((direccion, index) => (
        <option key={index} value={direccion}>
            {direccion}
        </option>
    ))}
</Field>
                                                <button
                                                    type="button"
                                                    className="btn-add-user  mt-2"
                                                    onClick={() => {
                                                        setShowAddNewAddress(true);
                                                    }}
                                                >
                                                    Agregar Nueva Dirección
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}
                            </Col>




                            <Col lg={6} className="form-group-add-user pt-3 text-start">
                                <label>Fecha de entrega:</label>
                                <Field
                        type="date"
                        name="fechaentrega"
                        className="llisting-add-user"
                        min={format(new Date(), "yyyy-MM-dd")} // Establece el mínimo como la fecha actual
                    />
                                <ErrorMessage
                                    name="fechaentrega"
                                    component="div"
                                    className="error-message"
                                />
                            </Col>
                            <Col lg={6} className="form-group-add-user pt-3 text-start">
                                <label>Hora de entrega:</label>
                                <Field
                                    type="time"
                                    name="horaentrega"
                                    className="llisting-add-user"
                                />
                                <ErrorMessage
                                    name="horaentrega"
                                    component="div"
                                    className="error-message"
                                />
                            </Col>
                        </Row>
                        <Row className='justify-content-end'>
                            <Col lg={3} className="form-group-add-user pt-3">
                                <div className='text-start'>
                                    <div className="p-2 mb-2">
                                        <label>Subtotal: $ {subTotal}</label>
                                    </div>
                                    <div className="p-2 mb-2">
                                        <label>IVA: {iva}</label>
                                    </div>
                                    <div className="p-2 mb-2">
                                        <label>Total: $ {total}</label>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <div className="form-group d-flex justify-content-center text-center pt-4 w-100">
                            <div className="container-buton-add-user">
                                <button
                                    type="submit"
                                    className="btn-add-user w-100 p-2"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Agregando..." : "Agregar Pedido"}
                                </button>
                            </div>

                        </div>

                    </Form>
                )}
            </Formik>
            <ModalAgregarPedidoCliente
                show={show}
                handleClose={handleClose}
                handleShow={handleShow}
                addProductos={addProductos}
            />
        </Container>
    )
}
