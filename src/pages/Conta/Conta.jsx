import { useEffect, useState } from "react";
import { Button, Form, Card, Container, Col, Row, Image } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import imgConta from "../../images/IMGConta.png"
import { Autenticacao } from "../../config/Autenticacao";

export function Conta() {
    const [usuario, setUsuario] = useState();
    const autenticacao = Autenticacao();

    useEffect(() => {
        axios.get(`http://localhost:3001/${autenticacao.tipo}es/${autenticacao.id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
            .then(response => {
                setUsuario(response.data); // atualiza o estado com os dados recebidos
            })
            .catch(error => {
                console.log(error);
            });

    }, []);

    return (
        <Container className="d-flex justify-content-center align-items-center">
            <Row>
                <Col className="d-none d-lg-flex align-items-center justify-content-center rounded-start">
                    <Image src={imgConta} alt="" />
                </Col>
                <Col className="bg-white shadow rounded-2 p-4">
                    {usuario && (
                        <div className="w-100">
                            <Card className="align-items-center border-0" style={{ backgroundColor: '#FFAF00' }}>
                                <Card.Img
                                    className="w-25 p-3 rounded-circle"
                                    style={{ objectFit: 'cover', aspectRatio: '1/1' }}
                                    src={usuario.foto ? `http://localhost:3001/${usuario.foto}` : 'http://localhost:3001/sacolinha.png'}
                                    alt="Foto do usuário"
                                />
                            </Card>
                            <br />
                            <Row>
                                <h5>Dados Pessoais</h5>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nome</Form.Label>
                                        <Form.Control className="custom-form-group" placeholder={usuario.nome} disabled />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>E-mail</Form.Label>
                                        <Form.Control className="custom-form-group" placeholder={usuario.email} disabled />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row >
                                <h5>Endereço</h5>
                                <Col>
                                    <Form.Group className="">
                                        <Form.Label>Cep</Form.Label>
                                        <Form.Control className="custom-form-group" placeholder={usuario.endereco.cep} disabled />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="">
                                        <Form.Label>Cidade / UF</Form.Label>
                                        <Form.Control className="custom-form-group" placeholder={`${usuario.endereco.cidade} / ${usuario.endereco.uf}`} disabled />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mt-3">
                                        <Form.Label>Rua</Form.Label>
                                        <Form.Control className="custom-form-group" placeholder={usuario.endereco.rua} disabled />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mt-3">
                                        <Form.Label>Numero</Form.Label>
                                        <Form.Control className="custom-form-group" placeholder={usuario.endereco.numero} disabled />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="pt-3">
                                <hr />
                                <Row>
                                    <Col>
                                        <div className="d-flex justify-content-center justify-content-md-end p-2">
                                            <div className="p-2">
                                                <Link to={`/${usuario.tipo}es/senha/editar/${usuario.id}`}>
                                                    <Button variant="primary" className="text-white">Alterar Senha</Button>
                                                </Link>
                                            </div>
                                            <div className="p-2">
                                                <Link to={`/${usuario.tipo}es/editar/${usuario.id}`}>
                                                    <Button variant="primary" className="text-white">Atualizar Dados</Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Col>

                                </Row>
                            </div>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    )
}
