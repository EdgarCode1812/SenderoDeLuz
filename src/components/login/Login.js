import React, { useEffect, useState } from 'react'
import './Login.css'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { loginService } from '../../services/LoginService';
import { LocalStorageService } from '../../services/LocalStorageService';

const validationSchema = Yup.object().shape({
    correo: Yup.string().required('El correo es requerido'),
    contrasena: Yup.string().required('La contraseña es requerida'),
});

const initialValues = {
    correo: '',
    contrasena: '',
};

export default function Login() {
    const navigate = useNavigate();
    const [errorLogin, seterrorLogin] = useState(false);

    const loggedUser = LocalStorageService.getToken();
    useEffect(() => {

        if (loggedUser) {
            navigate('/');
        }
    }, []);

    const handleSubmit = async (values, { resetForm }) => {
        const form = {
            email: values.correo,
            password: values.contrasena
        }

        try {
            const response = await loginService(form);
            LocalStorageService.saveTokens(response.token, response.role, response.email, response.id);
            resetForm();
            navigate('/PanelDeControl');
            seterrorLogin(false);
        } catch (error) {
            if (error.response && error.response.status === 403) {
                seterrorLogin(true);
                setTimeout(() => {
                    seterrorLogin(false);
                }, 4000);
            } else {
                // Otro tipo de error, puedes manejarlo según tus necesidades
                console.error("Error al iniciar sesión", error);
            }
        }
    };


    return (
        <div className='bg-login'>
            {!loggedUser && (
                <div className='container con-position d-flex justify-content-center pb-5 pt-5'>
                    <div className='row con-ins-login p-3'>
                        <div className='col-md-12 p-2'>
                            <div className='text-center pt-2'>
                                <h1 className='text-center'>Iniciar sesión</h1>
                            </div>
                            <div className='text-center pt-3'>
                                <img src="/img/logo.png" alt="" />
                            </div>
                            <div className='p-md-5 p-1'>
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ values, handleSubmit }) => (

                                        <Form className='text-start'>
                                            <div className="form-group-login">
                                                <label >Correo</label>
                                                <Field type="email" id="correo" name="correo" className="llisting-login" />
                                                <ErrorMessage name="correo" component="div" />
                                            </div>

                                            <div className="form-group-login">
                                                <label>Contraseña</label>
                                                <Field type="password" id="contrasena" name="contrasena" className="llisting-login" />
                                                <ErrorMessage name="contrasena" component="div" />
                                            </div>

                                            {errorLogin && (
                                                <div className={`alert-error-login text-center p-2 pt-3 ${errorLogin ? 'show-error-login' : ''}`}>
                                                    <p>Contraseña o correo invalido</p>
                                                </div>
                                            )}

                                            <div className="form-group text-center pt-4">
                                                <button type="submit" className="btn-login w-100 p-2">Iniciar Sesión</button>
                                            </div>
                                        </Form>

                                    )}

                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
