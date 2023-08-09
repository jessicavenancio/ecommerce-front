import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Button, Form, Col, Container, InputGroup, Modal, Pagination, Row, Table } from "react-bootstrap";
import { Loader } from "../../components/Loader/Loader";
import debounce from "lodash.debounce";
import { Autenticacao } from "../../config/Autenticacao";

export function Empreendedores() {
  const autenticacao = Autenticacao();
  const [empreendedores, setEmpreendedores] = useState(null);
  const [show, setShow] = useState(false);
  const [filtroNome, setFiltroNome] = useState("");
  const [idEmpreendedor, setIdEmpreendedor] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selecionaEmpreendedor, setSelecionaEmpreendedor] = useState(null);
  //pagination
  const [atualPage, setAtualPage] = useState(0);
  const [totalPages, setTotalPages] = useState([]);

  const handleShowConfirmationModal = (empreendedor) => {
    setSelecionaEmpreendedor(empreendedor);
    setShowConfirmationModal(true);
  };
  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setSelecionaEmpreendedor(null);
  };

  const handleClose = () => {
    setIdEmpreendedor(null);
    setShow(false);
  };

  const handleShow = (id) => {
    setIdEmpreendedor(id);
    setShow(true);
  };

  const onDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:3001/empreendedores/${idEmpreendedor}`,
        {
          headers: {
            Authorization: `Bearer ${autenticacao.token}`,
          },
        }
      );

      toast.success("Empreendedor excluído com sucesso", {
        position: "bottom-right",
        duration: 2000,
      });

      initializeTable();
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
        "Ocorreu um erro ao excluir o empreendedor",
        {
          position: "bottom-right",
          duration: 2000,
        }
      );
    }

    handleClose();
  };

  useEffect(() => {
    initializeTable();
  }, [atualPage, filtroNome]);

  async function initializeTable() {
    try {
      const response = await axios.get(
        `http://localhost:3001/empreendedores?nome=${filtroNome}&page=${atualPage}&size=${10}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEmpreendedores(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
        "Ocorreu um erro ao obter os empreendedores",
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
      setFiltroNome(valor);
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
          <h5 className="m-6">Empreendedores Cadastrados</h5>
        </Col>
        <Col className="text-end m-0 p-0">
          <Button className="custom-button" as={Link} to="/empreendedores/novo">
            <i className="bi bi-plus-lg me-2"></i> Empreendedor
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

      {empreendedores === null ? (
        <Loader />
      ) : (
        <Table striped bordered hover className="text-center">
          <thead>
            <tr>
              <th className="align-middle">Nome</th>
              <th className="d-none d-sm-table-cell">E-mail</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {empreendedores
              .filter((empreendedor) =>
                empreendedor.nome.toLowerCase().includes(filtroNome.toLowerCase())
              )
              .map((empreendedor) => (
                <tr key={empreendedor.id}>
                  <td className="align-middle">{empreendedor.nome}</td>
                  <td className="d-none d-sm-table-cell">{empreendedor.email}</td>
                  <td>
                  <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center">
                    <Button
                      className="m-2"
                      variant="danger text-white"
                      onClick={() => handleShow(empreendedor.id)}>  <i className="bi bi-trash-fill"></i>
                    </Button>

                    <Button className="m-2" variant="warning" as={Link} to={`/empreendedores/editar/${empreendedor.id}`} >
                      <i className="bi bi-pencil-fill"></i>
                    </Button>

                    <Button variant="primary" className="m-2" onClick={() => handleShowConfirmationModal(empreendedor)}>
                      <i className="bi bi-info-circle text-white"></i>
                    </Button>
                  </div>
                  </td>
                </tr>
              ))}

          </tbody>
        </Table>
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
        <Modal.Body>Tem certeza que deseja excluir o empreendedor?</Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="danger text-white" onClick={onDelete}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showConfirmationModal} onHide={handleCloseConfirmationModal}>
        <Modal.Header closeButton>
          <Modal.Title>Informações do Empreendedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selecionaEmpreendedor && (
            <>
              <p>ID: {selecionaEmpreendedor.id}</p>
              <p>Nome: {selecionaEmpreendedor.nome}</p>
              <p>Email: {selecionaEmpreendedor.email}</p>
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
