import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button, Card, Col, Container, Form, Image, InputGroup, Modal, Pagination, Row, Table } from "react-bootstrap";
import { Loader } from "../../components/Loader/Loader";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Autenticacao } from "../../config/Autenticacao";
import debounce from "lodash.debounce";

export function ListaProdutos() {
    const autenticacao = Autenticacao();
    const [produtos, setProdutos] = useState([]);
    const [show, setShow] = useState(false);
    const [showProd, setShowProd] = useState(false);
    const [selecionaProd, setSelecionaProd] = useState(null);
    const [idProduto, setIdProduto] = useState(null);
    //paginção
    const [atualPage, setAtualPage] = useState(0);
    const [pesquisa, setPesquisa] = useState("");
    const [totalPages, setTotalPages] = useState([]);

    const handleClose = () => {
        setIdProduto(null);
        setShow(false);
    };

    const handleShow = (id) => {
        setIdProduto(id);
        setShow(true);
    };

    const handleProd = (id) => {
        setSelecionaProd(null);
        setShowProd(false)
    };

    const buscarProd = (id) => {
        return axios
            .get(`http://localhost:3001/produtos/${id}`)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.response.data.message, {
                    position: "bottom-right",
                    duration: 2000,
                });
            });
    }

    const handleShowInfo = (id) => {
        buscarProd(id).then((produto) => {
            setSelecionaProd(produto);
            setShowProd(true);
        });
    };

    const onDelete = async () => {
        try {
            await axios.delete(
                `http://localhost:3001/produtos/${idProduto}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            )
                .then(response => {
                    toast.success("Produto excluído com sucesso", { position: "bottom-right", duration: 2000 },
                        console.log("excluido"));

                    initializeTable();
                })
                .catch(error => {
                    console.log(error);
                    toast.error(error.response.data.message, { position: "bottom-right", duration: 2000 });
                });
        } catch (error) {
            console.log(error);
        }
        handleClose();
    };

    useEffect(() => {
        initializeTable();
    }, [atualPage, pesquisa]);

    async function initializeTable() {
        try {
            await axios
                .get(`http://localhost:3001/produtos/empreendedores?usuarioId=${autenticacao.id}&page=${atualPage}&size=${10}&nome=${pesquisa}`, {
                    headers: {
                        Authorization: `Bearer ${autenticacao.token}`,
                    },
                })
                .then((response) => {
                    setProdutos(response.data.content);
                    setTotalPages(response.data.totalPages);
                })
                .catch((error) => {
                    console.error("Erro ao buscar produtos", error);
                });
        } catch (error) {
            console.log(error);
            toast.error(
                error.response?.data?.message ||
                "Ocorreu um erro ao obter a lista de produtos",
                {
                    position: "bottom-right",
                    duration: 2000,
                }
            );
        }
    }

    const debouncedFilter = useCallback(
        debounce((event) => {
            let valor = event.target.value;
            setAtualPage(0);
            setPesquisa(valor);
        }, 800),
        []
    );
    function onPesquisa(event) {
        debouncedFilter(event);
    }

    function Next() {
        if (atualPage < totalPages - 1) {
            const next = atualPage + 1;
            setAtualPage(next);
        }
    }

    function Previous() {
        if (atualPage > 0) {
            const previous = atualPage - 1;
            setAtualPage(previous);
        }
    }

    return (
        <div className="container">

            <Row className="d-flex justify-content-between align-items-center mt-5 me-0">
                <Col>
                    <h5 className="m-4">Produtos Cadastrados</h5>
                </Col>
                <Col className="d-flex justify-content-end">
                    <Button className="custom-button" as={Link} to="/produtos/novo">
                        <i className="bi bi-plus-lg me-2"></i> Produto
                    </Button>
                </Col>
            </Row>

            <Container className="d-flex justify-content-end mb-3">
                <Form.Control
                    type="text"
                    onChange={onPesquisa}
                    className="custom-form-group campo w-100 w-sm-25"
                    placeholder="O que procura?"
                    style={{ width: "100%", maxWidth: "150px" }}
                />
                <InputGroup.Text id="custom-search" className="custom-search custom-form-group" >
                    <i className="bi bi-search"></i>
                </InputGroup.Text>
            </Container>
            <hr />
            {produtos.length === null ? (
                <Loader />
            ) : (
                <div className="table-responsive">
                    <Table striped bordered hover className="text-center">
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th className="d-none d-sm-table-cell">Categoria</th>
                                <th>Preço</th>
                                <th className="d-none d-sm-table-cell">Foto</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {produtos.length > 0 ? (
                                produtos.map((produto) => (
                                    <tr key={produto.id}>
                                        <td className="align-middle">{produto.nome}</td>
                                        <td className="align-middle d-none d-sm-table-cell">{produto.categoria}</td>
                                        <td className="align-middle">R$ {parseFloat(produto.preco).toFixed(2)}</td>
                                        <Col className="image-container align-middle d-none d-sm-table-cell d-flex justify-content-center w-25" style={{ background: 'transparent' }}>
                                            <Card.Img
                                                className="image p-3 rounded-5 w-50"
                                                style={{ objectFit: 'cover', aspectRatio: '1/1', width: 'auto%', height: 'auto' }}
                                                src={`http://localhost:3001/${produto.foto}`}
                                            />
                                        </Col>
                                        <td className="align-middle">
                                            <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center">
                                                <Button
                                                    className="m-2"
                                                    variant="danger text-white"
                                                    onClick={() => handleShow(produto.id)}>
                                                    <i className="bi bi-trash-fill"></i>
                                                </Button>
                                                <Button className="m-2" variant="warning" as={Link} to={`/produtos/${produto.id}`} >
                                                    <i className="bi bi-pencil-fill"></i>
                                                </Button>
                                                <Button className="m-2 text-white" onClick={() => handleShowInfo(produto.id)}>
                                                    <i className="bi bi-info-circle"></i>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">Nenhum produto encontrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            )}

            <Pagination className="d-flex justify-content-center mt-5 text">
                <Pagination.First as={Button} onClick={() => setAtualPage(0)}>
                    {" "}
                    Primeira{" "}
                </Pagination.First>
                <Pagination.Prev as={Button} onClick={Previous} />
                <Pagination.Item active>{atualPage + 1}</Pagination.Item>
                <Pagination.Next as={Button} onClick={Next} />
                <Pagination.Last
                    as={Button}
                    onClick={() => setAtualPage(totalPages - 1)}
                >
                    Última
                </Pagination.Last>
            </Pagination>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmação</Modal.Title>
                </Modal.Header>
                <Modal.Body>Tem certeza que deseja excluir o produto?</Modal.Body>
                <Modal.Footer>
                    <Button variant="warning" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="danger text-white" onClick={onDelete}>
                        Excluir
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showProd} onHide={handleProd}>
                <Modal.Header closeButton>
                    <Modal.Title>Informações do produto</Modal.Title>
                </Modal.Header>

                <Modal.Body >
                    {selecionaProd && (
                        <>
                            <Row>
                                <Col className="d-flex align-items-center">
                                    <div>
                                        <strong>Código:</strong> {selecionaProd.id}<br />
                                        <strong>Nome:</strong> {selecionaProd.nome} <br />
                                        <strong>Categoria:</strong> {selecionaProd.categoria} <br />
                                        <strong>Quantidade:</strong> {selecionaProd.quantidade} <br />
                                        <strong>Preço:</strong>  R$  {selecionaProd.preco}<br />
                                        <strong>Desconto: </strong>{selecionaProd.desconto ? `${selecionaProd.desconto}%` : "--"}<br />
                                        <strong>Data desconto:</strong> {selecionaProd.dataDesconto
                                                            ? new Date(selecionaProd.dataDesconto).toLocaleDateString('pt-BR')
                                                            : "--"} <br />
                                        <strong>Descrição:</strong> {selecionaProd.descricao} <br />
                                    </div>
                                </Col>
                                <Col>
                                    <Image
                                        className="p-3 rounded-5 w-100"
                                        src={`http://localhost:3001/${selecionaProd.foto}`}
                                        alt="Imagem"
                                    />
                                </Col>
                            </Row>
                        </>
                    )}
                </Modal.Body>
            </Modal>

        </div>
    );
}
