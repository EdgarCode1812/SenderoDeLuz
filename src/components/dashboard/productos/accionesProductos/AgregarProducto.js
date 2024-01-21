import React, { useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addProducto } from '../../../../services/apisProductos';

const validationSchema = Yup.object().shape({
    tipo: Yup.string().required('El tipo es requerido'),
    sabor: Yup.string().required('El sabor es requerido'),
    imagen: Yup.mixed()
        .test(
            'fileFormat',
            'La imagen es requerida',
            (value) => {
                // Verifica que el valor no sea una cadena vacía y sea un archivo válido.
                return value !== '' && value !== undefined && value !== null;
            }
        ),
});

const initialValues = {
    tipo: '',
    sabor: '',
    imagen: '',
};

export default function AgregarProducto({ optionRender }) {
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (event, setFieldValue) => {
        const file = event.target.files[0];

        // Actualiza el campo de imagen en Formik a base64
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFieldValue('imagen', e.target.result);
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFieldValue('imagen', '');
            setImagePreview(null);
        }
    };

    const handleImageRemove = (setFieldValue) => {
        // Elimina la imagen de la vista previa
        setImagePreview(null);
        // Establece el campo de imagen en cadena vacía cuando se elimina la imagen.
        setFieldValue('imagen', '');
    };


    const handleSubmit = async (values, { resetForm }) => {
        const formData ={
            sabor: values.sabor,
            tipo: values.tipo,
            imagen_url: values.imagen
        }

        try{
            const response = await addProducto(formData);
            resetForm();
            optionRender(0, true)
        }catch (error) {
            console.error(error);
          }
    };
    return (
        <Container fluid className='add-user pt-4'>
            <div className='d-flex'>
                <div className='p-2'><img src='/../img/icons/flecha-izquierda.png' className='cursor' alt='' onClick={() => optionRender(0)} /></div>
                <div className='p-2'><h1>Agregar Producto</h1></div>
            </div>
            <Row className="p-md-5 p-1">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, setFieldValue }) => (
                        <Form>
                            <div className="row">
                                <div className="form-group-add-user col-lg-6">
                                    <label>Tipo</label>
                                    <Field type="text" name="tipo" className="llisting-add-user" />
                                    <ErrorMessage name="tipo" component="div" className="error-message" />
                                </div>
                                <div className="form-group-add-user col-lg-6">
                                    <label>Sabor</label>
                                    <Field type="text" name="sabor" className="llisting-add-user" />
                                    <ErrorMessage name="sabor" component="div" className="error-message" />
                                </div>
                            </div>
                            {/* Agregar campo de carga de imagen aquí */}
                            <div className='mt-4 text-center form-group-add-user'>
                                <div className="d-flex justify-content-center">

                                    <div className="image-drop-zone">
                                        {imagePreview ? (
                                            <div className="image-preview">
                                                <img src={imagePreview} alt="Vista previa de la imagen" />
                                                <button className="remove-image-button" onClick={() => handleImageRemove(setFieldValue)}>
                                                    <img src='/../img/icons/close.png' width={35} className='cursor' alt='' />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="drop-zone-text">
                                                Arrastra y suelta una imagen o haz clic para seleccionar
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            name="imagen"
                                            accept="image/*"
                                            onChange={(event) => handleImageChange(event, setFieldValue)}
                                        />
                                    </div>
                                </div>
                                <ErrorMessage name="imagen" component="div" className="error-message" />
                            </div>

                            <div className="form-group d-flex justify-content-center text-center pt-4 w-100">
                                <div className='container-buton-add-user'>
                                    <button type="submit" className="btn-add-user w-100 p-2" disabled={isSubmitting} >
                                        {isSubmitting ? 'Agregando...' : 'Agregar Producto'}
                                    </button>
                                </div>

                            </div>
                        </Form>
                    )}
                </Formik>
            </Row>
        </Container>
    )
}
