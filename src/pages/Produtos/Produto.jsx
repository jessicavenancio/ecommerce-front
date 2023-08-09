import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Toast } from "react-bootstrap";
import { BagFill, Heart, HeartFill, LightningFill } from "react-bootstrap-icons";
import { useParams } from "react-router-dom";
import { Loader } from "../../components/Loader/Loader";
import Countdown from "react-countdown";
import sacolinha from "../../images/favicon.png"
import { Autenticacao } from "../../config/Autenticacao";
import "./produto.css"

export function Produto() {
    const [product, setProduct] = useState(null);
    const [quantidade, setQuantidade] = useState(1);
    const { id } = useParams();
    const [empreendedorNome, setEmpreendedorNome] = useState("");
    const [gostou, setGostou] = useState(false);
    const dataDesconto = product ? new Date(product.dataDesconto) : null;
    const isDiscountExpired = dataDesconto ? new Date() > dataDesconto : false;
    const [showToast, setShowToast] = useState(false); // Estado para controlar a exibição do toast
    const autenticacao = Autenticacao();
    let tipo
    if (autenticacao) {
        tipo = autenticacao.tipo;
    } else {
        tipo = null;
    }

    if (dataDesconto) {
        dataDesconto.setTime(dataDesconto.getTime() + 3 * 60 * 60 * 1000);
    }

    const renderer = ({ days, hours, minutes, seconds }) => {
        return (
            <span>
                {days}d {hours}h {minutes}m {seconds}s
            </span>
        );
    };



    const handleClick = () => {
        setGostou(!gostou);
    };

    const aumentarQuantidade = () => {
        setQuantidade(quantidade + 1);
    };

    const diminuirQuantidade = () => {
        if (quantidade > 1) {
            setQuantidade(quantidade - 1);
        }
    };

    useEffect(() => {
        axios
            .get(`http://localhost:3001/produtos/${id}`)
            .then((response) => {
                const data = response.data;
                setProduct(data);
                axios
                    .get(`http://localhost:3001/empreendedores/${data.usuarioId}`)
                    .then((response) => {
                        const data = response.data;
                        setEmpreendedorNome(data.nome);
                    })
                    .catch((error) => {
                        console.error("Erro ao encontrar empreendedor", error);
                    });
            })
            .catch((error) => {
                console.error("Erro ao obter produto", error);
            });
    }, [id]);

    const addCart = () => {
        const item = {
            produto: product,
            empreendedorNome: empreendedorNome,
            quantidade: quantidade
        };

        setShowToast(true);

        // Recupera os itens existentes do localStorage
        const storedItems = localStorage.getItem('produtos');
        let cartItems = [];
        // Verifica se existem itens no localStorage
        if (storedItems) {
            cartItems = JSON.parse(storedItems);
        }

        // Verifica se o produto já existe no carrinho
        const existingItemIndex = cartItems.findIndex(
            cartItem => cartItem.produto.id === item.produto.id
        );

        if (existingItemIndex !== -1) {
            // O produto já existe no carrinho, incrementa a quantidade
            cartItems[existingItemIndex].quantidade += item.quantidade;
        } else {
            // O produto não existe no carrinho, adiciona-o à lista de itens do carrinho
            cartItems.push(item);
        }

        // Armazena a lista atualizada de volta no localStorage
        localStorage.setItem('produtos', JSON.stringify(cartItems));
    };



    if (product === null) {
        return <Loader />;
    }

    return (
        <Container>
            <Row>
                <Col md={7}>
                    <Card className="border-0 mt-3">
                        <Card.Img
                            className="image p-3 rounded-5"
                            style={{ objectFit: 'cover', aspectRatio: '1/1' }}
                            src={`http://localhost:3001/${product.foto}`}
                        />
                        {product.desconto > 0 && dataDesconto && !isDiscountExpired ? (
                            <div className="bandeirinha">
                                <div className="flag"></div>
                                <div className="discount-label">{product.desconto}% <br />OFF</div>
                            </div>
                        ) : null}
                    </Card>
                </Col>
                <Col className="w-50 pt-3 pb-3">
                    <b className="text-uppercase bordersmall font-weight-bold">
                        {product.categoria}
                    </b>
                    <div className="d-flex ">
                        <h3 className="w-75 mb-0">{product.nome}</h3>
                        {!gostou ? (
                            <Heart className="fs-3 ms-2 w-25" onClick={handleClick} />
                        ) : (
                            <HeartFill
                                className="fs-3 ms-2 w-25 text-danger"
                                onClick={handleClick}
                            />
                        )}
                    </div>
                    <p className="small">Vendido por: {empreendedorNome} </p>
                    <hr />
                    <div className="d-flex align-items-center">
                        {product.desconto > 0 && dataDesconto && !isDiscountExpired ? (
                            <>
                                <h2>R$ {parseFloat(product.preco * (1 - product.desconto / 100)).toFixed(2)}</h2>
                                <i className="fs-5 ms-2 text-secondary text-decoration-line-through font-italic">R$ {parseFloat(product.preco).toFixed(2)}</i>
                            </>
                        ) : <h2>R$ {parseFloat(product.preco).toFixed(2)}</h2>}

                    </div>
                    <p>Estoque disponível: {product.quantidade} unid.</p>
                    <hr />
                    {product.desconto > 0 && dataDesconto && !isDiscountExpired ? (
                        <p className="border text-center bg-danger p-2 rounded-2 text-light">
                            <LightningFill /><b>A oferta termina em:{' '}</b>
                            <Countdown date={dataDesconto} renderer={renderer} />
                        </p>
                    ) : null}

                    <Row>
                        <Col className="align-items-center d-flex"> Quantidade:
                            <Button className="ms-2" variant="danger text-white btn-sm" onClick={diminuirQuantidade}>-</Button>
                            <Button className="me-1 ms-1 bg-light" variant="light">{quantidade}</Button>
                            <Button variant="danger text-white btn-sm" onClick={aumentarQuantidade}>+</Button>
                        </Col>
                        <Col>
                            <Button md={3} onClick={addCart} variant="warning w-100 p-2"><BagFill /> Adicionar Produto</Button>
                        </Col>
                    </Row>
                    <hr />

                    {/* Toast para exibir a mensagem de produto adicionado */}
                    <Toast show={showToast} onClose={() => setShowToast(false)} delay={5000} autohide className='position-fixed bottom-0 end-0 mb-1 me-1'>
                        {tipo === 'consumidor' ? (
                            <>
                                <Toast.Header className="custom-toast">
                                    <img src={sacolinha} alt="Favicon" width={20} height={20} className="me-2" />
                                    <strong className="me-auto">Produto adicionado!</strong>
                                </Toast.Header>
                                <Toast.Body>{product.nome} foi adicionado à sacolinha.</Toast.Body>
                            </>
                        ) : (
                            <>
                                <Toast.Header className="custom-toast-alert">
                                    <img src={sacolinha} alt="Ícone" width={20} height={20} className="me-2" />
                                    <strong className="me-auto">Não é possível adicionar o produto!</strong>
                                </Toast.Header>
                                <Toast.Body>Apenas consumidores logados podem adicionar produto à sacolinha.</Toast.Body>
                            </>
                        )}
                    </Toast>

                    <Row>
                        <h4>Descrição do Produto</h4>
                        <p>{product.descricao}</p>
                    </Row>


                </Col>
            </Row>
        </Container>
    );
}
