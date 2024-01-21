import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import './Productos.css'
import AgregarProducto from './accionesProductos/AgregarProducto';
import { deleteProducto, getProductos } from '../../../services/apisProductos';
import EliminarProducto from './accionesProductos/DeleteProducto';
import Loading from '../../shared/loading/Loading';
import { isMobile } from 'react-device-detect';


export default function MenuProductos({ handleBackToMenu }) {
    const [currentSection, setCurrentSection] = useState(0);
    const [productoid, setProductoId] = useState();
    const [showModal, setShowModal] = useState(false);
    const [butondisableDelete, setButondisableDelete] = useState(false);
    const [textAlert, setTextAlert] = useState('');
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {

        fetchGetAllProductos();
    }, []);

    const fetchGetAllProductos = async () => {
        setLoading(false)
        try {
            const usuariosData = await getProductos();
            setLoading(true)
            setProductos(usuariosData.gelatinas);
            console.log(usuariosData.gelatinas);
        } catch (error) {
            console.error(error);
        }
    };

    const closeModal = async () => {
        setShowModal(false);
    };
    const openModal = async (id) => {
        setShowModal(true);
        setProductoId(id)
    };

    const confirmDelete = async (productoid) => {
        setButondisableDelete(true);
        const deleteIds = [productoid]; // Cambia a una matriz de IDs
        try {
            await deleteProducto(productoid);
            setButondisableDelete(false);
            setShowModal(false);
            const updatedUsers = productos.filter(producto => !deleteIds.includes(producto.id));
            setProductos(updatedUsers);
        } catch (error) {
            console.error(error);
        }
    };


    const optionRender = (value, id) => {
        if (value === 0 && id) {
            fetchGetAllProductos();
        }
        setCurrentSection(value);
        setProductoId(id);
    }

    const renderSection = () => {
        switch (currentSection) {
            case 1:
                return <AgregarProducto optionRender={optionRender} />
            case 2:
                return
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
        <Container className="content-menu-productos">

            {currentSection === 0 ? (
                <>
                    {loading ? (
                        <>
                            {isMobile && (
                                <>
                                    <div className='p-3'>
                                        <img onClick={() => handleBackToMenu()} src='img/icons/flecha-izquierda.png' width={25} alt='' />
                                    </div>
                                    <div><h3> Regresar</h3></div>
                                </>
                            )}
                            <div className='d-flex justify-content-between pt-3'>

                                <div className="me-auto p-2">
                                    <div className='p-2'><h1>Productos disponibles</h1></div>
                                    <div className="input-group rounded pt-4">
                                        <input
                                            type="text"
                                            className="form-control-search rounded"
                                            placeholder="Ingresa el sabor"
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && searchText != '') {
                                                    e.preventDefault();
                                                    searchFactura();
                                                }
                                            }}
                                        />
                                        <div className="input-group-append">
                                            {searchText != '' && (
                                                <span className='pe-2'>
                                                    <img src='/img/icons/cerrar.png' className='icons-search' width={12} alt='' onClick={deleteSearch} />
                                                </span>
                                            )}
                                            <span className='pe-2' id="search-addon" onClick={searchFactura}>
                                                <img src='/img/icons/buscar.png' className='icons-search' width={23} alt='' />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="buton-clientes-facturas ms-auto p-2">
                                    <div className='card-menu-productos cursor text-center p-3' onClick={() => optionRender(1)}>
                                        <img src='/img/icons/agregar.png' width={50} alt='' />
                                        <h1 className='pt-4'>Agregar Producto</h1>
                                    </div>
                                </div>

                            </div>
                            <div className='table-position mt-4 pe-1 ps-1'>
                                <table className="tabla text-center">
                                    <thead>
                                        <tr>
                                            <th className='p-2' scope="col">Número</th>
                                            <th className='p-2'>Sabor</th>
                                            <th className='p-2'>Tipo</th>
                                            <th className='p-2'>imagen</th>
                                            <th className='p-2'>Actiones</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {productos.length > 0 && loading ? (
                                            productos.map((item, index) => (
                                                <tr key={index}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td className='p-2'>{item.sabor}</td>
                                                    <td className='p-2'>{item.tipo}</td>
                                                    <td className='p-2'>
                                                        <div className='img-producto-gelatina'>
                                                            <img src={item.imagen_url} alt='' />
                                                        </div>
                                                    </td>
                                                    <td className="p-2">
                                                        <div className='p-1'>
                                                            <button className='btn btn-danger' onClick={() => openModal(item.id)}>Borrar</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td>
                                                    <h1 className='no-items'>No cuentas con ningun producto registrado</h1>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>
                            </div>
                            <EliminarProducto showModalDelete={showModal} closeModal={closeModal} confirmDelete={confirmDelete} butondisableDelete={butondisableDelete} productoid={productoid} />
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
