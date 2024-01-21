import React, { useEffect, useState } from 'react'
import './Curriculums.css'
import { deleteCV, getCurriculums } from '../../../services/apiCurriculums';
import { Container } from 'react-bootstrap';
import Loading from '../../shared/loading/Loading';
import ModalDeletedCV from './ModalDeletedCV';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import { isMobile } from 'react-device-detect';

export default function Curriculums({ handleBackToMenu }) {
    const [curriculums, setCurriculums] = useState([]);
    const [userId, setUserId] = useState();
    const [showModal, setShowModal] = useState(false);
    const [butondisableDelete, setButondisableDelete] = useState(false);
    const [textAlert, setTextAlert] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [result, setResult] = useState(false);

    const fetchGetAllGelatinas = async () => {
        setLoading(false)
        try {
            const cvData = await getCurriculums();
            setLoading(true)
            setCurriculums(cvData.gelatinas);
            console.log(cvData.gelatinas);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchGetAllGelatinas();
    }, []);

    const confirmDelete = async (userid) => {
        setButondisableDelete(true);
        const deleteIds = [userid]; // Cambia a una matriz de IDs
        try {
            await deleteCV(userid);
            setButondisableDelete(false);
            setShowModal(false);
            const updatedUsers = curriculums.filter(cv => !deleteIds.includes(cv.id));
            setCurriculums(updatedUsers);
        } catch (error) {
            console.error(error);
        }
    };

    const closeModal = async () => {
        setShowModal(false);
    };
    const openModal = async (text, id) => {
        setShowModal(true);
        setTextAlert(text);
        setUserId(id)
    };

    const deleteSearch = (resetForm) => {
        // Limpia el formulario 
        resetForm({
            searchText: '',
            startDate: '',
            endDate: ''
        });

        // Vuelve a obtener todas las facturas
        fetchGetAllGelatinas();
        setResult(false)
    };;



    const searchFactura = async (values) => {
        const { searchText, startDate, endDate } = values;

        const resultados = curriculums.filter((curriculum, index) => {
            // Compara la posición en el arreglo con el valor del formulario
            const fechacurriculum = new Date(curriculum.fecha); // Convierte la fecha de la curriculum a un objeto Date
            return (
                (!searchText || curriculum.email.includes(searchText)) && // Usa includes para comprobar si searchText está contenido en el correo electrónico
                (!startDate || fechacurriculum >= new Date(startDate)) && // Compara con la fecha de inicio
                (!endDate || fechacurriculum <= new Date(endDate)) // Compara con la fecha de fin
            );
        });

        // Hacer algo con los resultados, por ejemplo, imprimirlos
        if (resultados.length == 0) {
            setResult(true)
        }
        console.log(resultados)
        setCurriculums(resultados);
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
        <div className='table-position mt-4 pe-1 ps-1'>
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


                                <div className='row pb-3'>
                                    <div className="col-md-10 p-2">
                                        <div className='p-2 text-start'><h1>Curriculums</h1></div>

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

                                </div>
                            </Form>
                        )}
                    </Formik>
                    <table className="tabla text-center pt-5">
                        <thead>
                            <tr>
                                <th className='p-2' scope="col">Número</th>
                                <th className='p-2'>Nombre</th>
                                <th className='p-2'>Correo</th>
                                <th className='p-2'>Fecha</th>
                                <th className='p-2'>Mensaje</th>
                                <th className='p-2'>Documento</th>
                                <th className='p-2'>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {curriculums.length > 0 && loading ? (
                                curriculums && curriculums.map((item, index) => (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td className='p-2'>{item.name}</td>
                                        <td className='p-2'>{item.email}</td>
                                        <td className='p-2'>{format(new Date(item.fecha), "dd 'de' MMMM 'de' yyyy", { locale: es })}</td>
                                        <td className='p-2'>{item.sms}</td>
                                        <td className="p-2">
                                            <a href={item.document_url} download={`CV_${item.name}.pdf`} target="_blank" rel="noopener noreferrer">
                                                <span className='pe-3'><img src='/img/icons/pdf.png' width={25} alt='' /></span>
                                            </a>
                                        </td>
                                        <td className='p-2'>
                                            <button className='btn btn-danger' onClick={() => openModal(`${item.name}`, item.id)}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                !result ? (
                                    <tr>
                                        <td colSpan="5">
                                            <h1 className='no-items'>Ningún currículum para mostrar en la tabla.</h1>
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
                    <ModalDeletedCV showModalDelete={showModal} closeModal={closeModal} confirmDelete={confirmDelete} butondisableDelete={butondisableDelete} textAlert={textAlert} userId={userId} />
                </>
            ) : (
                <Container style={{ height: '100vh' }}>
                    <Loading />
                </Container>

            )}
        </div>
    )
}
