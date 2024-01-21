import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import './Usuarios.css'
import AgregarUsuarios from './accionesUsuarios/AgregarUsuarios';
import EliminarUsuarios from './accionesUsuarios/EliminarUsuarios';
import EditarUsuarios from './accionesUsuarios/EditarUsuarios';
import { deleteUser, getUsers } from '../../../services/apisUsuarios';
import Loading from '../../shared/loading/Loading';

export default function UsuariosMenu() {
    const [currentSection, setCurrentSection] = useState(0);
    const [userId, setUserId] = useState();
    const [showModal, setShowModal] = useState(false);
    const [butondisableDelete, setButondisableDelete] = useState(false);
    const [textAlert, setTextAlert] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');



    useEffect(() => {

        fetchGetAllUsuarios();
    }, []);

    const fetchGetAllUsuarios = async () => {
        setLoading(false)
        try {
            const usuariosData = await getUsers();
            setLoading(true)
            setUsuarios(usuariosData.rows);
            console.log(usuariosData.rows);
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

    const confirmDelete = async (userid) => {
        setButondisableDelete(true);
        const deleteIds = [userid]; // Cambia a una matriz de IDs
        try {
            await deleteUser(userid);
            setButondisableDelete(false);
            setShowModal(false);
            const updatedUsers = usuarios.filter(user => !deleteIds.includes(user.id));
            setUsuarios(updatedUsers);
        } catch (error) {
            console.error(error);
        }
    };


    const optionRender = (value, id) => {
        if (value === 0 && id) {
            fetchGetAllUsuarios();
        }
        setCurrentSection(value);
        setUserId(id);
    }

    const renderSection = () => {
        switch (currentSection) {
            case 1:
                return <AgregarUsuarios optionRender={optionRender} fetchGetAllUsuarios={fetchGetAllUsuarios} />
            case 2:
                return <EditarUsuarios optionRender={optionRender} userId={userId} />
            default:
                return null;
        }
    };

    const deleteSearch = () => {
        // // La cruz se ha hecho clic
        // fetchGetAllFacturas();
        setSearchText('')
    };



    const searchFactura = async () => {
        console.log(searchText)
        // setLoading(false)
        // try {
        //     const facturasData = await getFacturaProveedorbyemail(searchText);
        //     console.log(facturasData.facturasproveedores)
        //     setLoading(true)
        //     setFacturas(facturasData.facturasproveedores);
        // } catch (error) {
        //     console.error(error);
        // }
    };

    return (
        <Container className="content-menu-usuarios">

            {currentSection === 0 ? (
                <>
                    {loading ? (
                        <>
                            <div className='d-flex justify-content-between pt-3'>

                                <div className="me-auto p-2">
                                    <div className='p-2'><h1>Usuarios registrados</h1></div>
                            
                                </div>
                                <div className="buton-clientes-facturas ms-auto p-2">
                                    <div className='card-menu-productos cursor text-center p-3' onClick={() => optionRender(1)}>
                                        <img src='/img/icons/agregarUsuarios.png' width={50} alt='' />
                                        <h1 className='pt-4'>Agregar usuario</h1>
                                    </div>
                                </div>

                            </div>

                            <div className='table-position mt-4 pe-1 ps-1'>
                                <table className="tabla text-center">
                                    <thead>
                                        <tr>
                                            <th className='p-2' scope="col">Número</th>
                                            <th className='p-2'>Nombre</th>
                                            <th className='p-2'>Rol</th>
                                            <th className='p-2'>Correo</th>
                                            <th className='p-2'>Actiones</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {usuarios.length > 0 && loading ? (
                                            usuarios.map((item, index) => (
                                                <tr key={index}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td className='p-2'>{item.name}</td>
                                                    <td className='p-2'>{item.role}</td>
                                                    <td className="p-2">{item.email}</td>
                                                    <td className="p-2">
                                                        <div className='d-flex justify-content-center'>
                                                            <div className='p-1'>
                                                                <button className='btn btn-danger' onClick={() => openModal(`${item.role} ${item.name}`, item.id)}>Borrar</button>
                                                            </div>
                                                            <div className='p-1'>
                                                                <button className='btn btn-primary' onClick={() => optionRender(2, item.id)}>Editar</button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td>
                                                    <h1 className='no-items'>No cuentas con ningun usuario registrado</h1>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>
                            </div>
                            <EliminarUsuarios showModalDelete={showModal} closeModal={closeModal} confirmDelete={confirmDelete} butondisableDelete={butondisableDelete} textAlert={textAlert} userId={userId} />
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


        </Container>
    )
}
