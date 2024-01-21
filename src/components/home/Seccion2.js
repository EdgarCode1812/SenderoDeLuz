// Seccion2.jsx
import React, { useState } from 'react';
import './Home.css';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik, Field, ErrorMessage, Form as FormikForm } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
    nombre: Yup.string().required('Este campo es obligatorio').max(90, 'Exediste el número de caracteres'),
    numeroWhatsapp: Yup.string()
        .matches(/^[0-9]{10}$/, 'Número de cel inválido')
        .required('Este campo es obligatorio'),
    problema: Yup.string()
        .required('Este campo es obligatorio')
        .max(100, 'El mensaje debe tener menos de 100 caracteres')
});

export default function Seccion2() {
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSubmit = (values) => {
        const mensaje = `Hola mi nombre es ${values.nombre} y mi problema es el siguiente: ${values.problema}`;
        const numeroFijo = '2711184201';
        window.open(`https://wa.me/${numeroFijo}?text=${mensaje}`, '_blank');
    };

    return (
        <div className="">
            <div className="bg-video-wrap">
                <div className="brightness">
                    <video autoPlay={true} loop={true} muted={true} src='/videos/videodeFondo.mp4'></video>
                </div>

                <div className="overlay"></div>
                <div className="center-div text-center">
                    <div className="margin-top">
                        <img src="/img/logoSendero.png" className='img-logo-seccion2' alt="" />
                        <p className="pt-2 pb-3 ps-4 pe-4">
                            Si te enfrentas a la depresión, los celos, el miedo, la neurosis, la ansiedad, el alcoholismo,
                            la drogadicción u otras dificultades, estamos aquí para ayudarte.
                        </p>
                        <button type="button" className="btn btn-success ps-4 pe-4" onClick={handleShowModal}>
                            <img src="/img/icons/whatsappBlanco.png" width="25px" alt="" /> Pedir Ayuda
                        </button>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Estamos para ayudarte</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={{ nombre: '', numeroWhatsapp: '', problema: '' }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        <FormikForm>
                            <Form.Group className='p-2' controlId="nombre">
                                <Form.Label>Nombre</Form.Label>
                                <Field type="text" name="nombre" className="form-control" />
                                <ErrorMessage name="nombre" component="div" className="text-danger" />
                            </Form.Group>

                            <Form.Group className='p-2' controlId="numeroWhatsapp">
                                <Form.Label>Número de WhatsApp</Form.Label>
                                <Field type="text" name="numeroWhatsapp" className="form-control" />
                                <ErrorMessage name="numeroWhatsapp" component="div" className="text-danger" />
                            </Form.Group>

                            <Form.Group className='p-2' controlId="problema">
                                <Form.Label>¿Cuál es tu problema?</Form.Label>
                                <Field as="textarea" rows={3} name="problema" className="form-control" />
                                <ErrorMessage name="problema" component="div" className="text-danger" />
                            </Form.Group>
                            <div className='d-flex justify-content-center'>
                               
                                    <Button variant="success" type="submit" className='ps-4 pe-4'>
                                        <img src="/img/icons/whatsappBlanco.png" width="25px" alt="" /> Enviar
                                    </Button>
                            </div>
                        </FormikForm>
                    </Formik>
                </Modal.Body>
            </Modal>
        </div>
    );
}
