import React, { useState, useEffect } from 'react';
import { Modal, Button, Container } from 'react-bootstrap'

export default function ModalEliminarComprobante({ closeModal, showModalDelete, confirmDelete, butondisableDelete, comprobanteId }) {
  const [butonDelete, setButonDelete] = useState();



  useEffect(() => {
    setButonDelete(butondisableDelete)
  }, [butondisableDelete]);

  return (
    <div>
      <Container fluid className='pr-3 pl-3 pb-3 pt-5 p-md-5 mt-5 panel'>
        <Modal show={showModalDelete} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar eliminación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Estás seguro de que deseas eliminar este <strong>comprobante</strong>?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={() => confirmDelete(comprobanteId)} disabled={butonDelete}>
              {butonDelete ? 'Eliminando...' : 'Sí, eliminar'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}
