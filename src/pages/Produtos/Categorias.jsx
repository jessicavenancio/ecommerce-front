import { Button, Card, Col, Container, Form, InputGroup, Pagination, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { useParams } from "react-router-dom";
import debounce from "lodash.debounce";

export function Categorias() {
    const { categoria } = useParams();
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [atualPage, setAtualPage] = useState(0);
    const [pesquisa, setPesquisa] = useState("");

    useEffect(() => {
        axios
            .get(`http://localhost:3001/produtos?categoria=${categoria}&page=${atualPage}&nome=${pesquisa}&size=${8}`)
            .then((response) => {
                setProducts(response.data.content);
                setTotalPages(response.data.totalPages);
            })
            .catch((error) => {
                console.error('Erro ao obter produtos por categoria');
            });
    }, [atualPage, pesquisa, categoria]);


    const debouncedFilter = useCallback(
        debounce((event) => {
            let valor = event.target.value;
            setPesquisa(valor);
        }, 800),
        []
    );
    function onPesquisa(event) {
        debouncedFilter(event);
    }

    function Next() {
        if (atualPage < totalPages - 1) {
            const next = atualPage + 1
            setAtualPage(next);
        }
    }

    function Previous() {
        if (atualPage > 0) {
            const previous = atualPage - 1
            setAtualPage(previous);
        }
    }

    return (
        <>
            <div className='categorias d-flex justify-content-center fixed-top'>
                <Nav.Link href="/categoria/masculino" className="categoriaLink align-bottom mx-sm-5 mx-1">
                    <b>masculino</b>
                </Nav.Link>
                <Nav.Link href="/categoria/feminino" className="categoriaLink align-bottom mx-sm-5 mx-1">
                    <b>feminino</b>
                </Nav.Link>
                <Nav.Link href="/categoria/infantil" className="categoriaLink align-bottom mx-sm-5 mx-1">
                    <b>infantil</b>
                </Nav.Link>
                <Nav.Link href="/categoria/acessorios" className="categoriaLink align-bottom mx-sm-5 mx-1">
                    <b>acessórios</b>
                </Nav.Link>
            </div>

            <div className="container">
                <h4 className="novidades p-3 text-center">TENDÊNCIA {categoria.toUpperCase()}</h4>
                <Container className="d-flex justify-content-end mb-3">
                    <Form.Control
                        type="text"
                        onChange={onPesquisa}
                        className="custom-form-group campo w-100 w-sm-25"
                        placeholder="O que procura?"
                        style={{ width: "100%", maxWidth: "150px" }}
                    />
                    <InputGroup.Text id="custom-search" className="custom-search custom-form-group" >
                        <i class="bi bi-search"></i>
                    </InputGroup.Text>
                </Container>
                <Row xs={2} md={4} className="g-4">
                    {products.map((product) => (
                        <Col key={product.id}>
                            <Card className="card shadow border-0 rounded-3">
                                <Card.Img
                                    className="image p-3 rounded-5"
                                    style={{ objectFit: 'cover', aspectRatio: '1/1' }}
                                    src={`http://localhost:3001/${product.foto}`}
                                />
                                {product.desconto > 0 ? (
                                    <div>
                                        <div className="flag"></div>
                                        <div className="discount-label">
                                            {product.desconto}% <br />
                                            OFF
                                        </div>
                                    </div>
                                ) : null}
                                <Card.Body className="pt-0">
                                    <Card.Title className="cardTitle">{product.nome}</Card.Title>
                                    <div className="price">
                                        <h4 className="original-price fw-bold">
                                            R$ {parseFloat(product.preco * (1 - product.desconto / 100)).toFixed(2)}
                                        </h4>
                                    </div>
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
                    <Pagination.First as={Button} onClick={() => setAtualPage(0)}> Primeira </Pagination.First>
                    <Pagination.Prev as={Button} onClick={Previous} />
                    <Pagination.Item active>{atualPage + 1}</Pagination.Item>
                    <Pagination.Next as={Button} onClick={Next} />
                    <Pagination.Last as={Button} onClick={() => setAtualPage(totalPages - 1)}>Última</Pagination.Last>
                </Pagination>
            </div>
        </>
    )
}