import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import logo from '../../../images/SacolinhaLogo.png';
import { BagFill, DoorOpenFill, PeopleFill, PersonFill, PersonLinesFill } from 'react-bootstrap-icons';
import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

export function NavAdmin() {
    const [token, setToken] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        setToken(localStorage.getItem('token'))
    }, []);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    function onLogout() {
        localStorage.removeItem('token');
        setShow(false);
        window.location.href = "/";
    }
    return (
        <>
            {['sm'].map((expand) => (
                <Navbar key={expand} bg="light" expand={expand} className=" flex-column mb-3 fixed-top">
                    <Container>
                        <Navbar.Brand href="/"><img src={logo} height={50} alt="" /></Navbar.Brand>
                        {!token ? (
                            <div className="d-flex justify-content-end ms-auto">
                                <Nav.Link href="/login">
                                    {" "}
                                    <PersonFill size={25} /> Login
                                </Nav.Link>
                                <Nav.Link href="/cadastro" className="px-4">
                                    {" "}
                                    Cadastro{" "}
                                </Nav.Link>

                            </div>
                        ) : (
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
                                            <Nav.Link href="/consumidores" className="px-4 text-dark"><PeopleFill size={20} /> Consumidores </Nav.Link>
                                            <Nav.Link href="/empreendedores" className="px-4 text-dark"><PersonLinesFill size={20} /> Empreendedores</Nav.Link>
                                            <Nav.Link href="/produtos/admin/lista" className="px-4 text-dark"> <BagFill size={20} /> Produtos</Nav.Link>
                                            <Nav.Link onClick={handleShow} className="px-4 text-dark"> <DoorOpenFill size={20} /> Sair</Nav.Link>
                                        </Nav>
                                    </Offcanvas.Body>
                                </Navbar.Offcanvas>
                            </>
                        )}
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
