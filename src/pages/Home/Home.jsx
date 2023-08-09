import {
  Button,
  Card,
  Carousel,
  Col,
  Container,
  Form,
  InputGroup,
  Pagination,
  Row,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { ArrowLeftShort, ArrowRightShort } from "react-bootstrap-icons";
import "./style.css";
import banner1 from "../../images/Banner01.png";
import banner2 from "../../images/Banner02.png";
import banner3 from "../../images/Banner03.png";
import informacoesD from "../../images/informacoes.png";
import informacoesM from "../../images/informacoes-mobile.png";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import debounce from "lodash.debounce";

export function Home() {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState([]);
  const [atualPage, setAtualPage] = useState(0);
  const [pesquisa, setPesquisa] = useState("");
  const dataAtual = new Date();

  const ano = dataAtual.getFullYear();
  const mes = String(dataAtual.getMonth() + 1).padStart(2, "0"); // Adiciona um zero à esquerda, se necessário
  const dia = String(dataAtual.getDate()).padStart(2, "0"); // Adiciona um zero à esquerda, se necessário
  const dataHoje = `${ano}-${mes}-${dia}`;

  useEffect(() => {
    axios
      .get(`http://localhost:3001/produtos?page=${atualPage}&nome=${pesquisa}`)
      .then((response) => {
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error("Erro ao obter produtos");
      });
  }, [atualPage, pesquisa]);

  const debouncedFilter = useCallback(
    debounce((event) => {
      let valor = event.target.value;
      setAtualPage(0);
      setPesquisa(valor);
    }, 800), [pesquisa]);

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
    <>
      <div className="categorias d-flex justify-content-center fixed-top">
        <Nav.Link
          href="/categoria/masculino"
          className="categoriaLink align-bottom mx-sm-5 mx-1"
        >
          <b>masculino</b>
        </Nav.Link>
        <Nav.Link
          href="/categoria/feminino"
          className="categoriaLink align-bottom mx-sm-5 mx-1"
        >
          <b>feminino</b>
        </Nav.Link>
        <Nav.Link
          href="/categoria/infantil"
          className="categoriaLink align-bottom mx-sm-5 mx-1"
        >
          <b>infantil</b>
        </Nav.Link>
        <Nav.Link
          href="/categoria/acessorios"
          className="categoriaLink align-bottom mx-sm-5 mx-1"
        >
          <b>acessórios</b>
        </Nav.Link>
      </div>

      <div>
        <Carousel
          prevIcon={<ArrowLeftShort size={40} />}
          nextIcon={<ArrowRightShort size={40} />}
          indicators={false}
        >
          <Carousel.Item as={Link} to={"/categoria/acessorios"}>
            <img 
            className="d-block w-100" 
            src={banner1} 
            alt="Banner Óculos" 
            />
          </Carousel.Item>
          <Carousel.Item as={Link} to={"/categoria/masculino"}>
            <img
              className="d-block w-100"
              src={banner2}
              alt="Banner Moda Masculina"
            />
          </Carousel.Item>
          <Carousel.Item as={Link} to={"/categoria/infantil"}>
            <img
              className="d-block w-100"
              src={banner3}
              alt="Banner Moda Infantil"
            />
          </Carousel.Item>
        </Carousel>
      </div>

      <div className="bg-light d-flex justify-content-center">
        <img
          className="d-block p-4 d-none d-md-block img-fluid"
          src={informacoesD}
          alt="informacoes"
        />
        <img
          className="d-block p-3 d-md-none d-md-block img-fluid"
          src={informacoesM}
          alt="informacoes"
        />
      </div>

      <div className="container">
        <h4 className="novidades p-3 text-center">NOVIDADES</h4>
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
        <Row xs={2} md={3} className="g-4">
          {products.map((product) => (
            <Col key={product.id}>
              <Card className="image-container card shadow border-0 rounded-3">
                <Card.Img
                  className="image p-3 rounded-5"
                  style={{ objectFit: "cover", aspectRatio: "1/1" }}
                  src={`http://localhost:3001/${product.foto}`}
                />
                {product.desconto > 0 && product.dataDesconto > dataHoje ? (
                  <div>
                    <div className="flag"></div>
                    <div className="discount-label">
                      {product.desconto}% <br />
                      OFF
                    </div>
                  </div>
                ) : null}
                <Card.Body className="pt-0">
                  <Card.Title className="fs-5 cardTitle text-truncate">
                    {product.nome}
                  </Card.Title>
                  {product.desconto > 0 && product.dataDesconto > dataHoje ? (
                    <div className="price">
                      <h4 className="original-price fw-bold">
                        R${" "}
                        {parseFloat(
                          product.preco * (1 - product.desconto / 100)
                        ).toFixed(2)}
                      </h4>
                    </div>
                  ) : (
                    <div className="price">
                      <h4 className="original-price fw-bold">
                        R$ {parseFloat(product.preco).toFixed(2)}
                      </h4>
                    </div>
                  )}
                  <Button
                    as={Link}
                    to={`/produto/${product.id}`}
                    variant="warning w-100"
                  >
                    Ver Detalhes
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
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
    </>
  );
}
