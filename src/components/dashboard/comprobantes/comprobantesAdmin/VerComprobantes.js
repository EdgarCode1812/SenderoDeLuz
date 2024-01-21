import React, { useState, useEffect } from 'react'
import { Container, Row } from 'react-bootstrap';
import Loading from '../../../shared/loading/Loading';
import { deleteComprobante, getComprobantebyemail, getComprobantes } from '../../../../services/apiComprobantes';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import ModalEditarComprobante from './ModalEditarComprobante';
import AgregarComprobante from './AgregarComprobante';
import ModalEliminarComprobante from './ModalEliminarComprobante';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { isMobile } from 'react-device-detect';


export default function VerComprobantes({ handleBackToMenu }) {

  const [currentSection, setCurrentSection] = useState(0);
  const [comprobanteId, setComprobanteId] = useState();
  const [showModal, setShowModal] = useState(false);
  const [butondisableDelete, setButondisableDelete] = useState(false);
  const [comprobantes, setComprobantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [result, setResult] = useState(false);



  const fetchGetAllComprobantes = async () => {
    setLoading(false)
    try {
      const comprobantesData = await getComprobantes();
      setLoading(true)
      setComprobantes(comprobantesData.comprobantes);
      console.log(comprobantesData.comprobantes);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {

    fetchGetAllComprobantes();
  }, []);

  const closeModal = async () => {
    setShowModal(false);
  };
  const openModal = async (id) => {
    setShowModal(true);
    setComprobanteId(id)
  };

  const confirmDelete = async (comprobanteid) => {
    setButondisableDelete(true);
    const deleteIds = [comprobanteid]; // Cambia a una matriz de IDs
    try {
      await deleteComprobante(comprobanteid);
      setButondisableDelete(false);
      setShowModal(false);
      const updatedComprobantes = comprobantes.filter(comprobante => !deleteIds.includes(comprobante.id));
      setComprobantes(updatedComprobantes);
    } catch (error) {
      console.error(error);
    }
  };

  const optionRender = (value, id) => {
    if (value === 0 && id) {
      fetchGetAllComprobantes();
    }
    setCurrentSection(value);
    setComprobanteId(id);
  }

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return <AgregarComprobante optionRender={optionRender} fetchGetAllComprobantes={fetchGetAllComprobantes} />
      case 2:
        return <ModalEditarComprobante optionRender={optionRender} comprobanteId={comprobanteId} />
      default:
        return null;
    }
  };
  const deleteSearch = (resetForm) => {
    // Limpia el formulario 
    resetForm({
      searchText: '',
      startDate: '',
      endDate: ''
    });

    // Vuelve a obtener todas las facturas
    fetchGetAllComprobantes();
    setResult(false)
  };



  const searchFactura = async (values) => {
    const { searchText, startDate, endDate } = values;

    const resultados = comprobantes.filter((comprobante, index) => {
      // Compara la posición en el arreglo con el valor del formulario
      const fechaComprobantes = new Date(comprobante.fecha); // Convierte la fecha de la factura a un objeto Date
      return (
        (!searchText || comprobante.email.includes(searchText)) && // Usa includes para comprobar si searchText está contenido en el correo electrónico
        (!startDate || fechaComprobantes >= new Date(startDate)) && // Compara con la fecha de inicio
        (!endDate || fechaComprobantes <= new Date(endDate)) // Compara con la fecha de fin
      );
    });

    // Hacer algo con los resultados, por ejemplo, imprimirlos
    if (resultados.length == 0) {
      setResult(true)
    }
    setComprobantes(resultados);
  };

  const validationSchema = Yup.object().shape({
    searchText: Yup.string().email('Ingrese una dirección de correo electrónico válida'),
    startDate: Yup.date().test({
      name: 'startDate',
      exclusive: true,
      message: 'La fecha de inicio debe ser anterior a la fecha de fin',
      test: function (startDate) {
        const endDate = this.parent.endDate;
        return !endDate || startDate < endDate;
      },
    }),
    endDate: Yup.date().test({
      name: 'endDate',
      exclusive: true,
      message: 'La fecha de fin debe ser posterior a la fecha de inicio',
      test: function (endDate) {
        const startDate = this.parent.startDate;
        return !startDate || endDate > startDate;
      },
    }),
  });

  return (

    <Container className="content-menu-productos">
      {currentSection === 0 ? (
        <>
          {loading ? (
            <>
              {isMobile && (
                <>
                  <div className='pe-3'>
                    <img onClick={() => handleBackToMenu()} src='img/icons/flecha-izquierda.png' width={25} alt='' />
                  </div>
                  <div><h3> Regresar</h3></div>
                </>
              )}

              <Formik
                initialValues={{
                  searchText: '',
                  startDate: '',
                  endDate: ''
                }
                }
                validationSchema={validationSchema}
                onSubmit={searchFactura}
              >
                {({ isSubmitting, values, resetForm }) => (
                  <Form>
                    <div className='row pt-3'>
                      <div className="col-md-10 p-2">
                        <div className='p-2 text-start'><h1>Comprobantes</h1></div>

                        <div className='row'>
                          <div className='col-md-3'>
                            <Field
                              type="text"
                              name='searchText'
                              className="form-control-search rounded"
                              placeholder="Ingresa el correo"
                            />
                            <ErrorMessage name="searchText" component="div" className="error-message" />
                          </div>
                          <div className='col-md-3'>
                            <Field
                              type="date"
                              name='startDate'
                              id="startDate"
                              className="form-control-search rounded"
                            />
                            <ErrorMessage name="startDate" component="div" className="error-message" />
                          </div>
                          <div className='col-md-3'>
                            <Field
                              type="date"
                              name='endDate'
                              id="endDate"
                              className="form-control-search rounded"
                            />
                            <ErrorMessage name="endDate" component="div" className="error-message" />
                          </div>
                          <div className='d-flex justify-content-start col-md-3'>
                            <div className="p-1 bd-highlight">
                              <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-sm pe-3"><img src='/img/icons/lupa.png' width={16} alt='' />
                                {isSubmitting ? 'Buscando...' : 'Buscar'}
                              </button>
                            </div>
                            {(values.searchText !== '' || values.startDate !== '' || values.endDate !== '') && (
                              <div className="p-1 bd-highlight">
                                <button type="button" className="btn btn-secondary btn-sm" onClick={() => deleteSearch(resetForm)}>Limpiar</button>
                              </div>
                            )}

                          </div>
                        </div>
                      </div>

                      <div className="col-md-2 buton-clientes-facturas p-2">
                        <div className='card-menu-productos cursor text-center p-3' onClick={() => optionRender(1)}>
                          <img src='/img/icons/AgregarFactura.png' width={50} alt='' />
                          <h1 className='pt-4'>Agregar Comprobante</h1>
                        </div>
                      </div>

                    </div>



                  </Form>
                )}
              </Formik>
              <div className='table-position mt-4 pe-1 ps-1'>
                <table className="tabla text-center">
                  <thead>
                    <tr>
                      <th className='p-2' scope="col">Número</th>
                      <th className='p-2'>Email</th>
                      <th className='p-2'>Fecha y Hora</th>
                      <th className='p-2'>PDF Complemento pago</th>
                      <th className='p-2'>XML Complemento pago</th>
                      <th className='p-2'>PDF Factura</th>
                      <th className='p-2'>XML Factura</th>
                      <th className='p-2'>Acciones</th>

                    </tr>
                  </thead>
                  <tbody>
                    {comprobantes.length > 0 && loading ? (
                      comprobantes.map((item, index) => (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td className='p-2'>{item.email}</td>
                          <td>
                            <div>
                              {format(new Date(item.fecha), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                            </div>
                            <div>
                              {format(new Date(item.fecha), "HH:mm:ss", { locale: es })}
                            </div>
                          </td>
                          <td className="p-2">
                            <a href={item.urlpdfcomplementopago} download={`Comprobante_${item.email}.pdf`} target="_blank" rel="noopener noreferrer">
                              <span className='pe-3'><img src='/img/icons/pdf.png' width={25} alt='' /></span>
                            </a>

                          </td>
                          <td className="p-2">
                            <a href={item.urlxmlcomplementopago} download={`Comprobante_${item.email}.pdf`} target="_blank" rel="noopener noreferrer">
                              <span className='pe-3'><img src='/img/icons/pdf.png' width={25} alt='' /></span>
                            </a>

                          </td>
                          <td className="p-2">
                            <a href={item.urlpdffactura} download={`Comprobante_${item.email}.pdf`} target="_blank" rel="noopener noreferrer">
                              <span className='pe-3'><img src='/img/icons/pdf.png' width={25} alt='' /></span>
                            </a>

                          </td>
                          <td className="p-2">
                            <a href={item.urlxmlfactura} download={`Comprobante_${item.email}.pdf`} target="_blank" rel="noopener noreferrer">
                              <span className='pe-3'><img src='/img/icons/pdf.png' width={25} alt='' /></span>
                            </a>

                          </td>
                          <td className="p-2">
                            <div className='d-flex justify-content-center'>
                              <div className='p-1'>
                                <button className='btn btn-danger' onClick={() => openModal(item.id)}>Borrar</button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      !result ? (
                        <tr>
                          <td>
                            <h1 className='no-items'>No cuentas con ningún comprobante aún</h1>
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td>
                            <h1 className='no-items'>No encontramos ningún comprobante con esos datos</h1>
                          </td>
                        </tr>
                      )

                    )}
                  </tbody>
                </table>
              </div>
            </>

          ) : (
            <Container style={{ height: '100vh' }}>
              <Loading />
            </Container>
          )}
        </>
      ) : (
        <Row>
          {renderSection()}
        </Row>
      )}
      <ModalEliminarComprobante showModalDelete={showModal} closeModal={closeModal} confirmDelete={confirmDelete} butondisableDelete={butondisableDelete} comprobanteId={comprobanteId} />
    </Container >
  )
}
