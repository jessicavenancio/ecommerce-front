import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Button, Col, Container, Form, InputGroup, Modal, Pagination, Row, Table } from "react-bootstrap";
import { Loader } from "../../components/Loader/Loader";
import debounce from "lodash.debounce";

export function Consumidores() {
    const [consumidores, setConsumidores] = useState([]);
    const [idConsumidor, setIdConsumidor] = useState(null);
    const [show, setShow] = useState(false);
    const [selecionaConsumidor, setSelecionaConsumidor] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [filtroNome, setFiltroNome] = useState("");
    // paginação
    const [atualPage, setAtualPage] = useState(0);
    const [totalPages, setTotalPages] = useState([]);

    const handleClose = () => {
        setIdConsumidor(null);
        setShow(false);
    };

    const handleShow = (id) => {
        setIdConsumidor(id);
        setShow(true);
    };

    const debouncedFilter = useCallback(
        debounce((event) => {
            let valor = event.target.value;
            setAtualPage(0);
            setFiltroNome(valor);
        }, 800),
        []
    );
    function onPesquisa(event) {
        debouncedFilter(event);
    }

    const handleShowConfirmationModal = (consumidor) => {
        setSelecionaConsumidor(consumidor);
        setShowConfirmationModal(true);
    };

    const handleCloseConfirmationModal = () => {
        setShowConfirmationModal(false);
        setSelecionaConsumidor(null);
    };

    useEffect(() => {
        initializeTable()
    }, [atualPage, filtroNome])

    const onDelete = async () => {
        try {
            await axios.delete(`http://localhost:3001/consumidores/${idConsumidor}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });

            toast.success("Consumidor excluído com sucesso", {
                position: "top-center",
                duration: 4000,
            });

            initializeTable();
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Ocorreu um erro ao excluir o consumidor", {
                position: "top-center",
                duration: 4000,
            });
        }
        handleClose();
    };

    async function initializeTable() {
        try {
            const response = await axios.get(`http://localhost:3001/consumidores?nome=${filtroNome}&page=${atualPage}&size=${10}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            setConsumidores(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Ocorreu um erro ao obter os consumidores", {
                position: "top-center",
                duration: 4000,
            });
        }
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
                    <h5 className="m-6">Consumidores Cadastrados</h5>
                </Col>
                <Col className="text-end m-0 p-0">
                    <Button className="custom-button" as={Link} to="/consumidores/novo">
                        <i className="bi bi-plus-lg me-2"></i> Consumidor
                    </Button>
                </Col>
            </Row>
            <Container className="mt-2 p-0 d-flex justify-content-end mb-3">
                <Form.Control
                    type="text"
                    onChange={onPesquisa}
                    className="custom-form-group campo w-100 w-sm-25"
                    placeholder="Quem procura?"
                    style={{ width: "100%", maxWidth: "150px" }}
                />
                <InputGroup.Text id="custom-search" className="custom-search custom-form-group" >
                    <i className="bi bi-search"></i>
                </InputGroup.Text>
            </Container>
            <hr />
            {
                consumidores === null ?
                    <Loader />
                    :
                    <Table striped bordered hover className="text-center">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th className="d-none d-sm-table-cell">E-mail</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {consumidores.filter(consumidor =>
                                consumidor.nome.toLowerCase().includes(filtroNome.toLowerCase())
                            ).map(consumidor => {
                                return (
                                    <tr key={consumidor.id}>
                                        <td>{consumidor.nome}</td>
                                        <td className="d-none d-sm-table-cell">{consumidor.email}</td>
                                        <td>
                                        <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center">
                                            <Button variant="danger text-white" className="m-2" onClick={() => handleShow(consumidor.id)}>
                                                <i className="bi bi-trash-fill"></i>
                                            </Button>
                                            <Button variant="warning" className="m-2" as={Link} to={`/consumidores/editar/${consumidor.id}`}>
                                                <i className="bi bi-pencil-fill"></i>
                                            </Button>
                                            <Button variant="primary" className="m-2" onClick={() => handleShowConfirmationModal(consumidor)}>
                                                <i className="bi bi-info-circle text-white"></i>
                                            </Button>
                                        </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
            }
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
                <Modal.Body>Tem certeza que deseja excluir o consumidor?</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger text-white" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={onDelete}>
                        Excluir
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showConfirmationModal} onHide={handleCloseConfirmationModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Informações do Consumidor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selecionaConsumidor && (
                        <>
                            <p>ID: {selecionaConsumidor.id}</p>
                            <p>Nome: {selecionaConsumidor.nome}</p>
                            <p>Email: {selecionaConsumidor.email}</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger text-white" onClick={handleCloseConfirmationModal}>Fechar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

}