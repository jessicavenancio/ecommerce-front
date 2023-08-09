import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button, Col, Image, Modal, Pagination, Row, Table, Form, InputGroup, Container, OverlayTrigger, Tooltip, Card } from "react-bootstrap";
import { Loader } from "../../components/Loader/Loader";
import debounce from "lodash.debounce";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Autenticacao } from "../../config/Autenticacao";


export function ListaProdutosAdmin() {
    // Estado para armazenar a lista de produtos
    const [produtos, setProdutos] = useState([]);
    const autenticacao = Autenticacao();
    // Estado para armazenar a lista de empreendedores
    const [Empreendedores, setEmpreendedores] = useState([]);
    // Estado para armazenar o valor de query
    //paginação
    const [pesquisa, setPesquisa] = useState("");
    const [atualPage, setAtualPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [idProduto, setIdProduto] = useState(null);
    const [show, setShow] = useState(false);
    const [showProd, setShowProd] = useState(false);
    const [selecionaProd, setSelecionaProd] = useState(null);

    const handleShow = (id) => {
        setIdProduto(id);
        setShow(true);
    };

    const handleClose = () => {
        setIdProduto(null);
        setShow(false);
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


    useEffect(() => {
        axios.get(`http://localhost:3001/produtos?page=${atualPage}&size=${6}&nome=${pesquisa}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((response) => {
                setProdutos(response.data.content);
                setTotalPages(response.data.totalPages);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erro ao buscar produtos", error);
            });
    }, [atualPage, pesquisa]);

    useEffect(() => {
        axios.get("http://localhost:3001/empreendedores", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((response) => {
                setEmpreendedores(response.data.content);
            })
            .catch((error) => {
                console.error("Erro ao buscar empreendedores", error);
            });
    }, []);


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
            toast.success("Produto excluído com sucesso", {
                position: "top-center",
                duration: 4000,
            });
            initializeTable();
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Ocorreu um erro ao excluir o produto", {
                position: "top-center",
                duration: 4000,
            });
        }
        handleClose();
    };

    async function initializeTable() {
        try {
            await axios
                .get(`http://localhost:3001/produtos`, {
                    headers: {
                        Authorization: `Bearer ${autenticacao.token}`,
                    }

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


    const onPesquisa = useCallback(
        debounce((event) => {
            let valor = event.target.value;
            setAtualPage(0);
            setPesquisa(valor);
        }, 800), []);


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
                    <h5 className="m-6">Produtos Cadastrados</h5>
                </Col>
                <Col className="text-end m-0 p-0">
                    <Button className="custom-button" as={Link} to="/produtos/admin/novo">
                        <i className="bi bi-plus-lg me-2"></i> Produto
                    </Button>
                </Col>
            </Row>
            <Container className="mt-2 p-0 d-flex justify-content-end mb-3">
                <Form.Control
                    type="text"
                    onChange={onPesquisa}
                    className="custom-form-group campo w-100 w-sm-25"
                    placeholder="O que procura?"
                    style={{ width: "100%", maxWidth: "150px" }}
                />
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="custom-search-tooltip">Nome do empreendedor ou produto.</Tooltip>}
                >
                    <InputGroup.Text data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Nome do empreendedor ou produto." id="custom-search" className="custom-search custom-form-group" >
                        <i className="bi bi-search"></i>
                    </InputGroup.Text>
                </OverlayTrigger>
            </Container>
            <hr />
            {loading ? (
                <Loader />
            ) : (
                <div>
                    <Table striped bordered hover className="text-center">
                        <thead>
                            <tr>
                                <th className="align-middle">Empreendedor</th>
                                <th className="align-middle">Nome</th>
                                <th className="align-middle d-none d-sm-table-cell">Preco</th>
                                <th className="align-middle d-none d-sm-table-cell">Desconto</th>
                                <th className="align-middle d-none d-sm-table-cell">Data de desconto</th>
                                <th className="align-middle d-none d-sm-table-cell">Foto</th>
                                <th className="align-middle d-none d-sm-table-cell">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Verifica se a lista de produtos é um array e possui itens */}
                            {Array.isArray(produtos) && produtos.length > 0 ? (
                                produtos
                                    .map((produto) => {
                                        const empreendedor = Empreendedores.find(
                                            (empreendedor) => empreendedor.id === produto.usuarioId
                                        );
                                        if (empreendedor) {
                                            return (
                                                <tr key={produto.id}>
                                                    <td className="align-middle">{empreendedor.nome}</td>
                                                    <td className="align-middle">{produto.nome}</td>
                                                    <td className="align-middle d-none d-sm-table-cell">R$  {parseFloat(produto.preco).toFixed(2)}</td>
                                                    <td className="align-middle d-none d-sm-table-cell">
                                                        {produto.desconto ? `${produto.desconto}%` : "--"}
                                                    </td>
                                                    <td className="align-middle d-none d-sm-table-cell">
                                                        {produto.dataDesconto
                                                            ? new Date(produto.dataDesconto).toLocaleDateString('pt-BR')
                                                            : "--"}
                                                    </td>

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
                                                            <Button className="m-2" onClick={() => handleShowInfo(produto.id)}>
                                                                <i className="bi bi-info-circle text-white"></i>
                                                            </Button> 
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        } else {
                                            return null
                                        }
                                    })
                            ) : (
                                // Exibe uma mensagem se nenhum produto for encontrado
                                <tr>
                                    <td colSpan="6">Nenhum produto encontrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
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
                </div>
            )}
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
                                        <strong>Desconto: </strong>{selecionaProd.desconto ? `${selecionaProd.desconto}%` : "--"}<br />
                                        <strong>Data desconto:</strong>  {selecionaProd.dataDesconto ? `${selecionaProd.dataDesconto}` : "--"} <br />
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
