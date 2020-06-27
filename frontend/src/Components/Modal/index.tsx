import React from 'react'
import { Modal, Button } from 'react-bootstrap'

interface props {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>
    title: string;
    body?: any;
    handleSubmit: any;
}

const ModalPattern:React.FC<props> = ({ show, setShow, title, body, handleSubmit }) => {
  const handleClose = () => setShow(false)

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={handleClose}>
                    Cancelar
        </Button>
        <Button variant="dark" onClick={handleSubmit}>
                    Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalPattern
