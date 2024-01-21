import React, { useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addComprobante } from '../../../../services/apiComprobantes';
import '../Comprobantes.css';

const FileDropZone = ({ name, accept, onChange, preview, onRemove }) => (
  <div className="image-drop-zone">
    {preview ? (
      <div className="image-preview">
        <p>Archivo cargado con éxito</p>
        <button className="remove-image-button" onClick={onRemove}>
          Eliminar archivo
        </button>
      </div>
    ) : (
      <div className="drop-zone-text">
        Arrastra y suelta un archivo o haz clic para seleccionar
      </div>
    )}
    <input type="file" name={name} accept={accept} onChange={onChange} />
  </div>
);

export default function AgregarComprobante({ optionRender, fetchGetAllUsuarios }) {
  const [archivoPdffactura, setArchivoPdffactura] = useState('');
  const [archivoPdfcomplementopago, setArchivoPdfcomplementopago] = useState('');
  const [imagePreviewXmlfactura, setImagePreviewXmlfactura] = useState(null);
  const [imagePreviewXmlcomplementopago, setImagePreviewXmlcomplementopago] = useState(null);

  const initialValues = {
    correo: '',
    pdffactura: '',
    pdfcomplementopago: '',
    xmlfactura: '',
    xmlcomplementopago: '',
  };

  const validationSchema = Yup.object().shape({
    correo: Yup.string().required('Tu correo es requerido'),
    pdffactura: Yup.mixed().required('Debes adjuntar un archivo PDF').test('fileType', 'El archivo debe ser un PDF', (value) => {
      return value && value.type === 'application/pdf';
    }),
    pdfcomplementopago: Yup.mixed().required('Debes adjuntar un archivo PDF').test('fileType', 'El archivo debe ser un PDF', (value) => {
      return value && value.type === 'application/pdf';
    }),
    xmlfactura: Yup.mixed().test(
      'fileFormat',
      'El archivo XML es requerido',
      (value) => value !== '' && value !== undefined && value !== null
    ),
    xmlcomplementopago: Yup.mixed().test(
      'fileFormat',
      'El archivo XML es requerido',
      (value) => value !== '' && value !== undefined && value !== null
    ),
  });


  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
  
    // Agregar campos al FormData
    formData.append('email', values.correo);
    formData.append('pdffactura', values.pdffactura);
    formData.append('pdfcomplementopago', values.pdfcomplementopago);
    formData.append('xmlfactura', values.xmlfactura);
    formData.append('xmlcomplementopago', values.xmlcomplementopago);
  
    console.log(formData)
    try {
      await addComprobante(formData);
      resetForm();
      setArchivoPdffactura('');
      setArchivoPdfcomplementopago('');
      optionRender(0, true);
    } catch (error) {
      console.error(error);
    }
    
    setSubmitting(false);
  };
  

  const handleFileChange = (event, setFieldValue, setPreview, documentName) => {
    const file = event.target.files[0];

    if (file) {
      setFieldValue(documentName, file);
      setPreview(file);
    } else {
      setFieldValue(documentName, ''); // Borra el valor si no se selecciona ningún archivo
      setPreview(null);
    }
  };

  const handleImageRemove = (setFieldValue, setPreview, documentName) => {
    setPreview(null);
    setFieldValue(documentName, '');
  };

  return (
    <Container fluid className='add-user pt-4'>
      <div className='d-flex'>
        <div className='p-2'><img src='/../img/icons/flecha-izquierda.png' className='cursor' alt='' onClick={() => optionRender(0)} /></div>
        <div className='p-2'><h1>Agregar Comprobante</h1></div>
      </div>
      <Row className='p-md-5 p-1'>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, resetForm }) => (
            <Form className='text-start'>
              <div className='row pb-5 pt-5'>
                <div className="form-group-add-user col-lg-4">
                  <label >Correo</label>
                  <Field type="email" id="correo" name="correo" className="llisting-add-user" />
                  <ErrorMessage className='alert' name="correo" component="div" />
                </div>
                <div className="form-group-add-user col-lg-4">
                  <label htmlFor="pdffactura" className="custom-file-input">
                    <span className='form-control text-center text-cv'>{archivoPdffactura || 'Adjunta aquí la factura en pdf'}</span>
                    <div className="hidden-file-input">
                      <input
                        type="file"
                        id="pdffactura"
                        name="pdffactura"
                        style={{ display: 'none' }}
                        value={""}
                        onChange={(event) => {
                          const selectedFile = event.currentTarget.files[0];
                          setFieldValue('pdffactura', selectedFile);
                          setArchivoPdffactura(selectedFile ? selectedFile.name : '');
                        }}
                      />
                    </div>
                  </label>
                  <ErrorMessage className='alert' name="pdffactura" component="div" />
                </div>
                <div className="form-group-add-user col-lg-4">
                  <label htmlFor="pdfcomplementopago" className="custom-file-input">
                    <span className='form-control text-center text-cv'>{archivoPdfcomplementopago || 'Adjunta aquí el Comprobante.pdf'}</span>
                    <div className="hidden-file-input">
                      <input
                        type="file"
                        id="pdfcomplementopago"
                        name="pdfcomplementopago"
                        style={{ display: 'none' }}
                        value={""}
                        onChange={(event) => {
                          const selectedFile = event.currentTarget.files[0];
                          setFieldValue('pdfcomplementopago', selectedFile);
                          setArchivoPdfcomplementopago(selectedFile ? selectedFile.name : '');
                        }}
                      />
                    </div>
                  </label>
                  <ErrorMessage className='alert' name="pdfcomplementopago" component="div" />
                </div>
              </div>
              <div className='row'>
                <div className='col-md-6'>
                  <div className='mt-4 text-center form-group-add-user'>
                    <div className="d-flex justify-content-center">
                      <FileDropZone
                        name="xmlfactura"
                        accept=".xml"
                        onChange={(event) => handleFileChange(event, setFieldValue, setImagePreviewXmlfactura, 'xmlfactura')}
                        preview={imagePreviewXmlfactura}
                        onRemove={() => handleImageRemove(setFieldValue, setImagePreviewXmlfactura, 'xmlfactura')}
                      />
                    </div>
                    <ErrorMessage name="xmlfactura" component="div" className="error-message" />
                  </div>
                </div>
                <div className='col-md-6'>
                  <div className='mt-4 text-center form-group-add-user'>
                    <div className="d-flex justify-content-center">
                      <FileDropZone
                        name="xmlcomplementopago"
                        accept=".xml"
                        onChange={(event) => handleFileChange(event, setFieldValue, setImagePreviewXmlcomplementopago, 'xmlcomplementopago')}
                        preview={imagePreviewXmlcomplementopago}
                        onRemove={() => handleImageRemove(setFieldValue, setImagePreviewXmlcomplementopago, 'xmlcomplementopago')}
                      />
                    </div>
                    <ErrorMessage name="xmlcomplementopago" component="div" className="error-message" />
                  </div>
                </div>
              </div>
              <div className="form-group d-flex justify-content-center text-center pt-4 w-100">
                <div className='container-buton-add-user'>
                  <button type="submit" className="btn-add-user w-100 p-2" disabled={isSubmitting}>
                    {isSubmitting ? 'Subiendo...' : 'Agregar comprobante'}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Row>
    </Container>
  );
}
