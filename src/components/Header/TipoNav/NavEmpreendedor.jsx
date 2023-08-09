import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import logo from '../../../images/SacolinhaLogo.png';
import { BagFill, DoorOpenFill, PersonFill } from 'react-bootstrap-icons';
import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Autenticacao } from '../../../config/Autenticacao';
import axios from 'axios';

export function NavEmpreendedor() {
    const [show, setShow] = useState(false);
    const [nomeUsuario, setNomeUsuario] = useState()

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    function onLogout() {
        localStorage.removeItem('token');
        setShow(false);
        window.location.href = "/";
    }

    const autenticacao = Autenticacao()
    useEffect(() => {
        if (autenticacao) {
            axios.get(`http://localhost:3001/empreendedores/${autenticacao.id}`)
                .then((response) => {
                    setNomeUsuario(response.data.nome.split(' ')[0])
                })
        }
    }, [autenticacao])
    return (
        <>
            {['sm'].map((expand) => (
                <Navbar key={expand} bg="light" expand={expand} className=" flex-column mb-3 fixed-top">
                    <Container>
                        <Navbar.Brand href="/"><img src={logo} height={50} alt="" /></Navbar.Brand>
                        <>
                            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                            <Navbar.Offcanvas
                                id={`offcanvasNavbar-expand-${expand}`}
                                aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                                placement="end"
                                className="menu-mobile"
                                style={{ maxWidth: '80vw' }}
                            >
                                <Offcanvas.Header closeButton>
                                    <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`} />
                                </Offcanvas.Header>
                                <Offcanvas.Body>
                                    <Nav className="justify-content-end flex-grow-1 pe-3">
                                        {autenticacao && ( //nome de usuario perto logout
                                            <Nav.Link>Oi, <b>{nomeUsuario}</b></Nav.Link>
                                        )}
                                        <Nav.Link href="/conta/empreendedor" className="px-4 text-dark" > <PersonFill size={20} /> Minha conta</Nav.Link>
                                        <Nav.Link href="/produtos/lista" className="px-4 text-dark"> <BagFill size={20} /> Meus Produtos</Nav.Link>
                                        <Nav.Link onClick={handleShow} className="px-4 text-dark"> <DoorOpenFill size={20} /> Sair</Nav.Link>
                                    </Nav>
                                </Offcanvas.Body>
                            </Navbar.Offcanvas>
                        </>
                    </Container>
                </Navbar >
            ))
            }
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Tem certeza que quer Sair?</Modal.Title>
                </Modal.Header>
                <Modal.Body>Sentiremos saudades!</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger text-white" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button className="custom-button" onClick={onLogout}>
                        Sair
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
