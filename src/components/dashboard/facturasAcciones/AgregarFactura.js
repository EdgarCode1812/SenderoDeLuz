import React, { useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import '../usuarios/Usuarios.css'
import * as Yup from 'yup';
import { addFactura, addFacturaProveedor } from '../../../services/apiFacturas';

const validationSchema = Yup.object().shape({
  correo: Yup.string().required('El tipo es requerido'),
  documento: Yup.mixed()
    .test(
      'fileFormat',
      'El archivo XML es requerido',
      (value) => {
        // Verifica que el valor no sea una cadena vacía y sea un archivo válido.
        return value !== '' && value !== undefined && value !== null;
      }
    ),
});

const initialValues = {
  correo: '',
  documento: '',
};

export default function AgregarFacturaClientes({ optionRender, typeComponent }) {
  const [imagePreview, setImagePreview] = useState(null);

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


  const handleSubmit = async (values, { resetForm }) => {
    // Aquí puedes manejar el envío de datos, incluyendo la imagen si es necesario  
    const formData = new FormData();
    formData.append('email', values.correo);
    formData.append('archivo', values.documento);
  
    try {
      if (typeComponent === 'cliente') {
        await addFactura(formData);
      } else {
        await addFacturaProveedor(formData);
      }
  
      resetForm();
      optionRender(0, true);
    } catch (error) {
      console.error(error);
      // Aquí puedes manejar el error de manera específica si es necesario
    }
  };
    return (
    <Container fluid className='add-user pt-4'>
      <div className='d-flex'>
        <div className='p-2'><img src='/../img/icons/flecha-izquierda.png' className='cursor' alt='' onClick={() => optionRender(0)} /></div>
        <div className='p-2'><h1>Agregar Factura</h1></div>
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
                <div className="form-group-add-user col-lg-12">
                  <label>Correo</label>
                  <Field type="email" name="correo" className="llisting-add-user" />
                  <ErrorMessage name="correo" component="div" className="error-message" />
                </div>
              </div>
              {/* Agregar campo de carga de imagen aquí */}
              <div className='mt-4 text-center form-group-add-user'>
                <div className="d-flex justify-content-center">
                  <div className="image-drop-zone">
                    {imagePreview ? (
                      <div className="image-preview">
                        <p>Factura cargada con éxito</p>
                        <button className="remove-image-button" onClick={() => handleImageRemove(setFieldValue)}>
                          Eliminar archivo
                        </button>
                      </div>
                    ) : (
                      <div className="drop-zone-text">
                        Arrastra y suelta un archivo XML o haz clic para seleccionar
                      </div>
                    )}
                    <input
                      type="file"
                      name="documento"
                      accept=".xml" // Solo se aceptarán archivos XML
                      onChange={(event) => handleXMLChange(event, setFieldValue)}
                    />
                  </div>

                </div>

                <ErrorMessage name="documento" component="div" className="error-message" />
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
