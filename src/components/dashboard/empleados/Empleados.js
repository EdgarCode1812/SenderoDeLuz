import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import Loading from '../../shared/loading/Loading';
import { getFacturas, deleteFactura, getFacturaClientebyemail } from '../../../services/apiFacturas';
import '../productos/Productos.css'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import { isMobile } from 'react-device-detect';
import AgregarEmpleado from './accionesEmpleados/AgregarEmpleado';
import EliminarEmpleado from './accionesEmpleados/EliminarEmpleado';
import { deleteEmpleado, getEmpleados } from '../../../services/apiEmpleados';


export default function Empleados({ handleBackToMenu }) {
  const [empleadoid, setEmpleadoId] = useState();
  const [showModal, setShowModal] = useState(false);
  const [butondisableDelete, setButondisableDelete] = useState(false);
  const [result, setResult] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);



  useEffect(() => {

    fetchGetAllEmpleados();
  }, []);

  const fetchGetAllEmpleados = async () => {
    setLoading(false)
    try {
      const empleadosData = await getEmpleados();
      setLoading(true)
      setEmpleados(empleadosData.Empleados);
      console.log("Se imprime resultados", empleadosData.Empleados)
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSearch = (resetForm) => {
    // Limpia el formulario 
    resetForm({
      searchText: '',
      startDate: '',
      endDate: ''
    });

    fetchGetAllEmpleados();
    setResult(false)
  };


  const searchFactura = async (values) => {
    const { nombre, curp } = values;

    const resultados = empleados.filter((empleado, index) => {
      return (
        (!nombre || empleado.nombre_trabajador.includes(nombre)) &&
        (!curp || empleado.curp.includes(curp))
      );
    });

    // Hacer algo con los resultados, por ejemplo, imprimirlos
    if (resultados.length == 0) {
      setResult(true)
    }
    setEmpleados(resultados);
  };

  const closeModal = async () => {
    setShowModal(false);
  };
  const openModal = async (id) => {
    setShowModal(true);
    setEmpleadoId(id)
  };


  const confirmDelete = async (Empleadoid) => {
    setButondisableDelete(true);
    const deleteIds = [Empleadoid]; // Cambia a una matriz de IDs
    try {
      await deleteEmpleado(Empleadoid);
      setButondisableDelete(false);
      setShowModal(false);
      const updatedUsers = empleados.filter(empleado => !deleteIds.includes(empleado.id_empleado));
      setEmpleados(updatedUsers);
    } catch (error) {
      console.error(error);
    }
  };

  const optionRender = (value, id) => {
    if (value === 0 && id) {
      fetchGetAllEmpleados();
    }
    setCurrentSection(value);
    setEmpleadoId(id);
  }

  const renderSection = (typeComponent) => {
    switch (currentSection) {
      case 1:
        return <AgregarEmpleado optionRender={optionRender} typeComponent={typeComponent} />

      default:
        return null;
    }
  };

  const downloadXML = async (url, fileName) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const urlObject = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = urlObject;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(urlObject);
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
    }
  };

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('Ingrese un nombre').max(50, 'El nombre no puede tener más de 50 caracteres'),
    curp: Yup.string()
      .matches(
        /^[A-Z]{4}[0-9]{6}[HM]{1}[A-Z]{5}[0-9]{2}$/,
        'Ingrese una CURP válida'
      ),
  });

  return (
    <Container className="facturas content-menu-productos">
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
                  nombre: '',
                  curp: ''
                }
                }
                validationSchema={validationSchema}
                onSubmit={searchFactura}
              >
                {({ isSubmitting, values, resetForm }) => (
                  <Form>
                    <div className='row pt-3'>
                      <div className="col-md-10 p-2">
                        <div className='p-2 text-start'><h1>Empleados</h1></div>

                        <div className='row'>
                          <div className='col-md-3'>
                            <Field
                              type="text"
                              name='nombre'
                              className="form-control-search rounded"
                              placeholder="Ingresa el nombre"
                            />
                            <ErrorMessage name="nombre" component="div" className="error-message" />
                          </div>

                          <div className='col-md-3'>
                            <Field
                              type="text"
                              name='curp'
                              className="form-control-search rounded"
                              placeholder="Ingresa el CURP"
                            />
                            <ErrorMessage name="curp" component="div" className="error-message" />
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
                          <h1 className='pt-4'>Agregar Factura</h1>
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
                      <th className='p-2'>Empleado</th>
                      <th className='p-2'>Nombre</th>
                      <th className='p-2'>Comprobante de Domicilio</th>
                      <th className='p-2'>CURP</th>
                      <th className='p-2'>Núm. Seguro social</th>
                      <th className='p-2'>Telefono</th>
                      <th className='p-2'>INE</th>
                      <th className='p-2'>Licencia</th>
                      <th className='p-2'>Constancia Fiscal</th>
                      <th className='p-2'>Puesto</th>
                      <th className='p-2'>Actiones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {empleados.length > 0 && loading ? (
                      empleados.map((item, index) => (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td className='p-2'>
                            <div className='img-producto-gelatina'>
                              <img src={item.foto_trabajador} alt='' />
                            </div>
                          </td>
                          <td className='p-2'>{item.nombre_trabajador}</td>
                          <td className="p-2">
                            <a href={item.comprobante_domicilio} download={`Comprobante_de_domicilio_${item.nombre_trabajador}.pdf`} target="_blank" rel="noopener noreferrer">
                              <span className='pe-3'><img src='/img/icons/pdf.png' width={25} alt='' /></span>
                            </a>
                          </td>
                          <td className='p-2'>{item.curp}</td>
                          <td className='p-2'>{item.numero_seguro_social}</td>
                          <td className='p-2'>{item.telefono}</td>
                          <td className="p-2">
                            <a href={item.ine} download={`INE_${item.nombre_trabajador}.pdf`} target="_blank" rel="noopener noreferrer">
                              <span className='pe-3'><img src='/img/icons/pdf.png' width={25} alt='' /></span>
                            </a>
                          </td>
                          <td className="p-2">
                            <a href={item.licencia} download={`Licencia_${item.nombre_trabajador}.pdf`} target="_blank" rel="noopener noreferrer">
                              <span className='pe-3'><img src='/img/icons/pdf.png' width={25} alt='' /></span>
                            </a>
                          </td>
                          <td className="p-2">
                            <a href={item.constancia_fiscal} download={`Constancia_Fiscal_${item.nombre_trabajador}.pdf`} target="_blank" rel="noopener noreferrer">
                              <span className='pe-3'><img src='/img/icons/pdf.png' width={25} alt='' /></span>
                            </a>
                          </td>
                          <td className='p-2'>{item.puesto_trabajador}</td>
                          <td className="p-2">
                            <div className='p-1'>
                              <button className='btn btn-danger' onClick={() => openModal(item.id_empleado)}>Borrar</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      !result ? (
                        <tr>
                          <td>
                            <h1 className='no-items'>Aún no hay empleados registrados</h1>
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td>
                            <h1 className='no-items'>No encontramos ningún empleado con esos datos</h1>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>

                </table>
              </div>
              <EliminarEmpleado showModalDelete={showModal} closeModal={closeModal} confirmDelete={confirmDelete} butondisableDelete={butondisableDelete} empleadoid={empleadoid} />
            </>
          ) : (
            <Container style={{ height: '100vh' }}>
              <Loading />
            </Container>

          )}
        </>
      ) : (
        <Row>
          {renderSection('cliente')}
        </Row>
      )}



    </Container>
  )
}
