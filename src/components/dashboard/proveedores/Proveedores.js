import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import Loading from '../../shared/loading/Loading';
import { getFacturasProveedores, deleteFacturaProveedor, getFacturaProveedorbyemail } from '../../../services/apiFacturas';
import './Proveedores.css'
import '../productos/Productos.css'
import EliminarFactura from '../facturasAcciones/EliminarFactura';
import AgregarFactura from '../facturasAcciones/AgregarFactura';
import './Proveedores.css'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import { isMobile } from 'react-device-detect';


export default function Proveedores({ handleBackToMenu }) {
    const [facturaid, setFacturaId] = useState();
    const [showModal, setShowModal] = useState(false);
    const [butondisableDelete, setButondisableDelete] = useState(false);
    const [result, setResult] = useState(false);
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSection, setCurrentSection] = useState(0);
    const [resultSerch, setResultSerch] = useState(false);





    useEffect(() => {

        fetchGetAllFacturas();
    }, []);

    const fetchGetAllFacturas = async () => {
        setLoading(false)
        try {
            const facturasData = await getFacturasProveedores();
            setLoading(true)
            console.log(facturasData.facturas)
            setFacturas(facturasData.facturas);
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

        // Vuelve a obtener todas las facturas
        fetchGetAllFacturas();
        setResult(false)
    };




    const searchFactura = async (values) => {
        const { searchText, startDate, endDate } = values;

        const resultados = facturas.filter((factura, index) => {
            // Compara la posición en el arreglo con el valor del formulario
            const fechaFactura = new Date(factura.fecha); // Convierte la fecha de la factura a un objeto Date

            return (
                (!searchText || factura.email.includes(searchText)) && // Usa includes para comprobar si searchText está contenido en el correo electrónico
                (!startDate || fechaFactura >= new Date(startDate)) && // Compara con la fecha de inicio
                (!endDate || fechaFactura <= new Date(endDate)) // Compara con la fecha de fin
            );
        });

        // Hacer algo con los resultados, por ejemplo, imprimirlos
        if (resultados.length == 0) {
            setResult(true)
        }
        setFacturas(resultados);
    };



    const closeModal = async () => {
        setShowModal(false);
    };
    const openModal = async (id) => {
        setShowModal(true);
        setFacturaId(id)
    };


    const confirmDelete = async (facturaid) => {
        setButondisableDelete(true);
        const deleteIds = [facturaid]; // Cambia a una matriz de IDs
        try {
            await deleteFacturaProveedor(facturaid);
            setButondisableDelete(false);
            setShowModal(false);
            const updatedUsers = facturas.filter(factura => !deleteIds.includes(factura.id));
            setFacturas(updatedUsers);
        } catch (error) {
            console.error(error);
        }
    };

    const optionRender = (value, id) => {
        if (value === 0 && id) {
            fetchGetAllFacturas();
        }
        setCurrentSection(value);
        setFacturaId(id);
    }

    const renderSection = (typeComponent) => {
        switch (currentSection) {
            case 1:
                return <AgregarFactura optionRender={optionRender} typeComponent={typeComponent} />
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
                                                <div className='p-2 text-start'><h1>Facturas Proveedores</h1></div>

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
                                            <th className='p-2'>Email</th>
                                            <th className='p-2'>Fecha</th>
                                            <th className='p-2'>Documento</th>
                                            <th className='p-2'>Actiones</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {facturas.length > 0 && loading ? (
                                            facturas.map((item, index) => (
                                                <tr key={index}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td className='p-2'>{item.email}</td>
                                                    <td className='p-2'>{format(new Date(item.fecha), "dd 'de' MMMM 'de' yyyy", { locale: es })}</td>
                                                    <td className="p-2">
                                                        <button className="btn btn-primary btn-sm" onClick={() => downloadXML(item.url, 'factura.xml')}>
                                                            Descargar XML
                                                        </button>
                                                    </td>

                                                    <td className="p-2">
                                                        <div className='p-1'>
                                                            <button className='btn btn-danger' onClick={() => openModal(item.id)}>Borrar</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            !result ? (
                                                <tr>
                                                    <td>
                                                        <h1 className='no-items'>No cuentas con ninguna factura</h1>
                                                    </td>
                                                </tr>
                                            ) : (
                                                <tr>
                                                    <td>
                                                        <h1 className='no-items'>No encontramos ninguna factura con esos datos</h1>
                                                    </td>
                                                </tr>
                                            )

                                        )}
                                    </tbody>

                                </table>
                            </div>
                            <EliminarFactura showModalDelete={showModal} closeModal={closeModal} confirmDelete={confirmDelete} butondisableDelete={butondisableDelete} facturaid={facturaid} />
                        </>
                    ) : (
                        <Container style={{ height: '100vh' }}>
                            <Loading />
                        </Container>

                    )}
                </>
            ) : (
                <Row>
                    {renderSection('proveedor')}
                </Row>
            )
            }



        </Container >
    )
}
