import React, { useState, useEffect } from 'react'
import { Container, Row } from 'react-bootstrap'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addUser, getRoles } from '../../../../services/apisUsuarios';

const validationSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es requerido'),
  rol: Yup.string().required('Seleccione un rol'),
  correo: Yup.string().email('Correo inválido').required('El correo es requerido'),
  contrasena: Yup.string().required('La contraseña es requerida').min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmContrasena: Yup.string().oneOf([Yup.ref('contrasena'), null], 'Las contraseñas no coinciden').required('Confirma tu contraseña'),
});

const initialValues = {
  nombre: '',
  rol: '',
  correo: '',
  contrasena: '',
  confirmContrasena: '',
};

export default function AgregarUsuarios({ optionRender, fetchGetAllUsuarios }) {
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchGetRoless = async () => {
      try {
        const rolesData = await getRoles();
        setRoles(rolesData.rows);
      } catch (error) {
        console.error(error);
      }
    };
    fetchGetRoless();
  }, []);

  const toggleShowPass = (option) => {
    if (option === 'showNewPass') {
      setShowNewPass(!showNewPass)
    } else if (option === 'showConfirmPass') {
      setShowConfirmPass(!showConfirmPass)
    }
  };

  const handleSubmit = async (values, { resetForm }) => {

    const form = {
      email: values.correo,
      password: values.contrasena,
      role: values.rol,
      name: values.nombre
    }

    try{

      await addUser(form);
      resetForm();
      optionRender(0, true)

    }catch (error) {
        console.error(error);
      }
    
  };

  return (
    <Container fluid className='add-user pt-4'>
      <div className='d-flex'>
        <div className='p-2'><img src='/../img/icons/flecha-izquierda.png' className='cursor' alt='' onClick={() => optionRender(0)} /></div>
        <div className='p-2'><h1>Agregar usuario</h1></div>
      </div>
      <Row className='p-md-5 p-1'>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (

            <Form className='text-start'>
              <div className='row pb-5 pt-5'>
                <div className="form-group-add-user col-lg-6">
                  <label >Nombre</label>
                  <Field type="text" id="nombre" name="nombre" className="llisting-add-user" />
                  <ErrorMessage className='alert' name="nombre" component="div" />
                </div>
                <div className="form-group-add-user col-lg-6">
                  <label >Correo</label>
                  <Field type="email" id="correo" name="correo" className="llisting-add-user" />
                  <ErrorMessage className='alert' name="correo" component="div" />
                </div>
              </div>
              <div className='row pt-5 pb-5'>
                <div className="form-group-add-user col-lg-4">
                  <label >Rol</label>
                  <Field as="select" id="rol" name="rol" className="llisting-add-user">
                    <option value="" disabled>Seleccione un rol</option>
                    {roles.map((rol, index) => (
                      <option key={index} value={rol.id}>
                        {rol.role_name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage className='alert' name="rol" component="div" />
                </div>
                <div className="form-group-add-user col-lg-4">
                  <label>Contraseña</label>
                  <div className="input-group">
                    <Field type={showNewPass ? 'text' : 'password'} id="contrasena" name="contrasena" className="llisting-add-user-pass" />
                    <div className="input-group-append">
                      <span
                        onClick={() => toggleShowPass('showNewPass')}
                        className="btn-eye"
                      >
                        <img src={`/../img/icons/${showNewPass ? 'ver' : 'esconder'}.png`} alt='' className='cursor' width={20} />
                      </span>
                    </div>
                  </div>
                  <ErrorMessage className='alert' name="contrasena" component="div" />
                </div>
                <div className="form-group-add-user col-lg-4">
                  <label>Confirmar contraseña</label>
                  <div className="input-group">
                    <Field
                      type={showConfirmPass ? 'text' : 'password'} // Cambia el tipo de campo según el estado
                      name="confirmContrasena"
                      className="llisting-add-user-pass"
                    />
                    <div className="input-group-append">
                      <span
                        onClick={() => toggleShowPass('showConfirmPass')}
                        className="btn-eye"
                      >
                        <img src={`/../img/icons/${showConfirmPass ? 'ver' : 'esconder'}.png`} width={20} className='cursor' alt='' />
                      </span>
                    </div>
                  </div>
                  <ErrorMessage className='alert' name="confirmContrasena" component="div" />

                </div>
              </div>
              <div className="form-group d-flex justify-content-center text-center pt-4 w-100">
                <div className='container-buton-add-user'>
                  <button type="submit" className="btn-add-user w-100 p-2" disabled={isSubmitting}>{isSubmitting ? 'Registrando...' : 'Registrar usuario'}</button>
                </div>
              </div>
            </Form>
          )}
        </Formik>

      </Row>
    </Container >
  )
}
