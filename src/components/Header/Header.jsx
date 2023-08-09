import { Nav, Navbar, Container, Button, Modal } from 'react-bootstrap';
import logo from '../../images/SacolinhaLogo.png';
import { PersonFill } from 'react-bootstrap-icons';
import './style.css';
import { useEffect, useState } from 'react';
import { NavEmpreendedor } from './TipoNav/NavEmpreendedor';
import { NavAdmin } from './TipoNav/NavAdm';
import { NavConsumidor } from './TipoNav/NavConsumidor';
import { Autenticacao } from '../../config/Autenticacao';
import { Link, useNavigate } from 'react-router-dom';

export function Header() {
  const autenticacao = Autenticacao();

  const [token, setToken] = useState(false);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, []);

  const handleClose = () => setShow(false);

  const onLogout = () => {
    localStorage.removeItem('token');
    setShow(false);
    navigate('/');
  };

  return (
    <>
      {['sm'].map((expand) => (
        <Navbar key={expand} bg="light" expand={expand} className=" flex-column mb-3 fixed-top">
          <Container>
            <Navbar.Brand href="/"><img src={logo} height={50} alt="" /></Navbar.Brand>
            {autenticacao.token === undefined || !autenticacao.token ? (
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
                {autenticacao.tipo === "empreendedor" && (
                  <div>
                    <NavEmpreendedor />
                  </div>
                )}
                {autenticacao.tipo === "consumidor" && (
                  <div>
                    <NavConsumidor />
                  </div>
                )}
                {autenticacao.tipo === "administrador" && (
                  <div>
                    <NavAdmin />
                  </div>
                )}
              </>
            )}
          </Container>
        </Navbar >
      ))}
    </>
  );
}