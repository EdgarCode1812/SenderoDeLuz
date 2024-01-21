import React, { useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { sendRegisterEmpleado } from '../../../../services/apiEmpleados';
import { addFactura, addFacturaProveedor } from '../../../../services/apiFacturas';

const validationSchema = Yup.object().shape({
    puesto_trabajador: Yup.string().required('El puesto del trabajador es requerido'),
    archivo: Yup.mixed().required('Debes adjuntar un archivo PDF').test('fileType', 'El archivo debe ser un PDF', (value) => {
        return value && value.type === 'application/pdf';
    }),
    constancia: Yup.mixed().required('Debes adjuntar un archivo PDF').test('fileType', 'El archivo debe ser un PDF', (value) => {
        return value && value.type === 'application/pdf';
    }),
    licencia: Yup.mixed().required('Debes adjuntar un archivo PDF').test('fileType', 'El archivo debe ser un PDF', (value) => {
        return value && value.type === 'application/pdf';
    }),
    ine_pdf: Yup.mixed().required('Debes adjuntar un archivo PDF').test('fileType', 'El archivo debe ser un PDF', (value) => {
        return value && value.type === 'application/pdf';
    }),
    domicilio: Yup.string().required('El domicilio es requerido'),
    numero_seguro_social: Yup.string().required('El número de seguro social es requerido'),
    curp: Yup.string().required('El CURP es requerido'),
    telefono: Yup.string().required('El CURP es requerido'),
    nombre_trabajador: Yup.string().required('El nombre es requerido'),
    foto: Yup.mixed()
        .required('Debes adjuntar una imagen')
        .test('fileType', 'El archivo debe ser una imagen', (value) => {
            return value && value.type.startsWith('image/');
        }),
});

const initialValues = {
    puesto_trabajador: '',
    archivo: '',
    domicilio: '',
    constancia: '',
    ine_pdf: '',
    numero_seguro_social: '',
    curp: '',
    nombre_trabajador: '',
    foto: '',
    telefono: '',
    licencia: ''
};

export default function AgregarEmpleado({ optionRender }) {
    const [imagePreview, setImagePreview] = useState(null);
    const [archivoINE, setArchivoINE] = useState('');
    const [archivoComprobante, setArchivoComprobante] = useState('');
    const [archivoConstancia, setArchivoConstacia] = useState('');
    const [archivoImagen, setArchivoImagen] = useState('');
    const [archivoLicencia, setAchivoLicencia] = useState('');

    const handleXMLChange = (event, setFieldValue) => {
        const file = event.target.files[0];

        if (file) {
            setFieldValue('documento', file);
            setImagePreview(file);
            // Opcionalmente, puedes realizar otras acciones con el archivo XML aquí
        } else {
            setFieldValue('documento', ''); // Borra el valor si no se selecciona ningún archivo
        }
    };

    const handleImageRemove = (setFieldValue) => {
        // Elimina la imagen de la vista previa
        setImagePreview('');
        // Establece el campo de imagen en cadena vacía cuando se elimina la imagen.
        setFieldValue('documento', '');
    };


    const handleSubmit = async (value, { setSubmitting, resetForm }) => {
        console.log("Entra funcion")

        console.log(value)

        const formData = new FormData();
        formData.append('archivo', value.archivo);
        formData.append('domicilio', value.domicilio);
        formData.append('numero_seguro_social', value.numero_seguro_social);
        formData.append('curp', value.curp);
        formData.append('nombre_trabajador', value.nombre_trabajador);
        formData.append('puesto_trabajador', value.puesto_trabajador);
        formData.append('constancia', value.constancia);
        formData.append('ine_pdf', value.ine_pdf);
        formData.append('foto', value.foto);
        formData.append('telefono', value.telefono);
        formData.append('licencia', value.licencia);

        try {
            await sendRegisterEmpleado(formData);
            resetForm();
            setArchivoINE('');
            setArchivoImagen('');
            setArchivoComprobante('');
            setArchivoConstacia('');
            setAchivoLicencia('');
            optionRender(0, true);
        } catch (error) {
            console.error(error);
        }
        setSubmitting(false)
    };

    return (
        <Container fluid className='add-user pt-4'>
            <div className='d-flex'>
                <div className='p-2'><img src='/../img/icons/flecha-izquierda.png' className='cursor' alt='' onClick={() => optionRender(0)} /></div>
                <div className='p-2'><h1>Agregar Empleado</h1></div>
            </div>
            <Row className="p-md-5 p-1">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, setFieldValue }) => (
                        <Form>
                            <div className="text-start row p-3">
                                <div className="form-group-add-user col-lg-4">
                                    <label>Puesto trabajador</label>
                                    <Field type="text" name="puesto_trabajador" className="llisting-add-user" />
                                    <ErrorMessage name="puesto_trabajador" component="div" className="error-message" />
                                </div>
                                <div className="form-group-add-user col-lg-4">
                                    <label>Nombre</label>
                                    <Field type="text" name="nombre_trabajador" className="llisting-add-user" />
                                    <ErrorMessage name="nombre_trabajador" component="div" className="error-message" />
                                </div>
                                <div className="form-group-add-user col-lg-4">
                                    <label>CURP</label>
                                    <Field type="text" name="curp" className="llisting-add-user" />
                                    <ErrorMessage name="curp" component="div" className="error-message" />
                                </div>
                            </div>
                            <div className="text-start row p-3">
                                <div className="form-group-add-user col-lg-4">
                                    <label>Núm seguro social</label>
                                    <Field type="text" name="numero_seguro_social" className="llisting-add-user" />
                                    <ErrorMessage name="numero_seguro_social" component="div" className="error-message" />
                                </div>
                                <div className="form-group-add-user col-lg-4">
                                    <label>Domicilio</label>
                                    <Field type="text" name="domicilio" className="llisting-add-user" />
                                    <ErrorMessage name="domicilio" component="div" className="error-message" />
                                </div>
                                <div className="form-group-add-user col-lg-4">
                                    <label>Telefono</label>
                                    <Field type="text" name="telefono" className="llisting-add-user" />
                                    <ErrorMessage name="telefono" component="div" className="error-message" />
                                </div>
                                <div className="d-flex flex-column form-group-add-user col-lg-4">
                                    <label>INE</label>
                                    <label htmlFor="ine_pdf" className="cursor">
                                        <span className='form-control text-center text-cv'>{archivoINE || 'Adjunta aquí el INE .pdf'}</span>
                                        <Field
                                            type="file"
                                            id="ine_pdf"
                                            name="ine_pdf"
                                            style={{ display: 'none' }}
                                            value={""}
                                            onChange={(event) => {
                                                const selectedFile = event.currentTarget.files[0];
                                                setFieldValue('ine_pdf', selectedFile);
                                                setArchivoINE(selectedFile ? selectedFile.name : '');
                                            }}
                                        />
                                    </label>
                                    <ErrorMessage name="ine_pdf" component="div" className="error-message" />
                                </div>

                                <div className="d-flex flex-column form-group-add-user col-lg-4">
                                    <label>Licencia de conducir</label>
                                    <label htmlFor="licencia" className="cursor">
                                        <span className='form-control text-center text-cv'>{archivoLicencia || 'Adjunta aquí la licencia de conducir .pdf'}</span>
                                        <Field
                                            type="file"
                                            id="licencia"
                                            name="licencia"
                                            style={{ display: 'none' }}
                                            value={""}
                                            onChange={(event) => {
                                                const selectedFile = event.currentTarget.files[0];
                                                setFieldValue('licencia', selectedFile);
                                                setAchivoLicencia(selectedFile ? selectedFile.name : '');
                                            }}
                                        />
                                    </label>
                                    <ErrorMessage name="licencia" component="div" className="error-message" />
                                </div>

                            </div>
                            <div className="text-start row ">
                                <div className="d-flex flex-column form-group-add-user col-lg-4">
                                    <label>Constancia Fiscal</label>
                                    <label htmlFor="constancia" className="cursor">
                                        <span className='form-control text-center text-cv'>{archivoConstancia || 'Adjunta aquí la constancia fiscal .pdf'}</span>
                                        <Field
                                            type="file"
                                            id="constancia"
                                            name="constancia"
                                            style={{ display: 'none' }}
                                            value={""}
                                            onChange={(event) => {
                                                const selectedFile = event.currentTarget.files[0];
                                                setFieldValue('constancia', selectedFile);
                                                setArchivoConstacia(selectedFile ? selectedFile.name : '');
                                            }}
                                        />
                                    </label>
                                    <ErrorMessage name="constancia" component="div" className="error-message" />
                                </div>
                                <div className="d-flex flex-column form-group-add-user col-lg-4">
                                    <label>Comprobante de Domicilio</label>
                                    <label htmlFor="archivo" className="cursor">
                                        <span className='form-control text-center text-cv'>{archivoComprobante || 'Adjunta aquí el comprobante de domicilio .pdf'}</span>
                                        <Field
                                            type="file"
                                            id="archivo"
                                            name="archivo"
                                            style={{ display: 'none' }}
                                            value={""}
                                            onChange={(event) => {
                                                const selectedFile = event.currentTarget.files[0];
                                                setFieldValue('archivo', selectedFile);
                                                setArchivoComprobante(selectedFile ? selectedFile.name : '');
                                            }}
                                        />
                                    </label>
                                    <ErrorMessage name="archivo" component="div" className="error-message" />
                                </div>
                                <div className="d-flex flex-column form-group-add-user col-lg-4">
                                    <label>Foto del trabajador</label>
                                    <label htmlFor="foto" className="cursor">
                                        <span className='form-control text-center text-cv'>{archivoImagen || 'Adjunta aquí el imagen del trabajador'}</span>
                                        <Field
                                            type="file"
                                            id="foto"
                                            name="foto"
                                            style={{ display: 'none' }}
                                            value={""}
                                            onChange={(event) => {
                                                const selectedFile = event.currentTarget.files[0];
                                                setFieldValue('foto', selectedFile);
                                                setArchivoImagen(selectedFile ? selectedFile.name : '');
                                            }}
                                        />
                                    </label>
                                    <ErrorMessage name="foto" component="div" className="error-message" />
                                </div>
                            </div>
                            <div className="form-group d-flex justify-content-center text-center pt-4 w-100">
                                <div className='container-buton-add-user'>
                                    <button type="submit" className="btn-add-user w-100 p-2" disabled={isSubmitting} >
                                        {isSubmitting ? 'Agregando...' : 'Agregar Factura'}
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
