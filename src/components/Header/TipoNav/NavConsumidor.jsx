import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import logo from "../../../images/SacolinhaLogo.png";
import { CartIcon } from "../../../components/Sacolinha/Sacolinha";
import { DoorOpenFill, PersonFill, TrashFill, XCircleFill } from "react-bootstrap-icons";
import { useState, useEffect } from "react";
import { Button, Card, Col, Image, Modal, Row } from "react-bootstrap";
import axios from "axios";
import { Autenticacao } from "../../../config/Autenticacao";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export function NavConsumidor() {
    const [show, setShow] = useState(false);
    const [showCartModal, setShowCartModal] = useState(false);
    const [cartItems, setCartItems] = useState(0);

    const produtosCarrinho = JSON.parse(localStorage.getItem("produtos"));

    const handleShowCart = () => setShowCartModal(true);
    const handleCloseCart = () => setShowCartModal(false);
    const [valorTotal, setValorTotal] = useState(0);
    const [nomeUsuario, setNomeUsuario] = useState()
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const dataAtual = new Date();
    const ano = dataAtual.getFullYear();
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Adiciona um zero à esquerda, se necessário
    const dia = String(dataAtual.getDate()).padStart(2, '0'); // Adiciona um zero à esquerda, se necessário
    const dataHoje = (`${ano}-${mes}-${dia}`);
    const [screenSize, setScreenSize] = useState(window.innerWidth);

    useEffect(() => {
        setCartItems(produtosCarrinho ? produtosCarrinho.length : 0);
        // Definir o número de itens do carrinho com base no tamanho do array produtosCarrinho
    }, [produtosCarrinho]);

    useEffect(() => {
        const handleSize = () => {
            setScreenSize(window.innerWidth);
        }
        window.addEventListener('resize', handleSize);
        return () => { window.addEventListener('resize', handleSize) };
    }, []);

    useEffect(() => {
        // Calcula o valor total sempre que o array de produtos no carrinho mudar
        if (produtosCarrinho && produtosCarrinho.length > 0) {
            const total = produtosCarrinho.reduce((acc, item) => {
                let valorItem = 0;
                if (item.produto.desconto > 0 && (item.produto.dataDesconto > dataHoje)) {
                    const precoComDesconto =
                        item.produto.preco * (1 - item.produto.desconto / 100);
                    valorItem = precoComDesconto * item.quantidade;
                } else {
                    valorItem = item.produto.preco * item.quantidade;
                }
                return acc + valorItem;
            }, 0);
            setValorTotal(total);
        } else {
            setValorTotal(0);
        }
    }, [produtosCarrinho, dataHoje]);

    const handleRemoverProduto = (index) => {
        const updatedItems = [...produtosCarrinho];
        updatedItems.splice(index, 1); // Remove o produto do array de acordo com o índice fornecido
        setCartItems(cartItems - 1); // Atualiza o número de itens do carrinho
        localStorage.setItem("produtos", JSON.stringify(updatedItems)); // Atualiza os produtos no armazenamento local
    };

    const handleDiminuir = (index) => {
        const updatedItems = [...produtosCarrinho];
        if (updatedItems[index].quantidade > 1) {
            updatedItems[index].quantidade--;
            setCartItems(cartItems - 1);
            localStorage.setItem("produtos", JSON.stringify(updatedItems));
        }
    };

    const handleAumentar = (index) => {
        const updatedItems = [...produtosCarrinho];
        updatedItems[index].quantidade++;
        setCartItems(cartItems + 1);
        localStorage.setItem("produtos", JSON.stringify(updatedItems));
    };

    const handleLimparSacolinha = () => {
        toast.warn(
            <div>
                Tem certeza que deseja apagar todos os produtos da sacolinha?
                <div className="mt-2">
                    <Button variant="danger text-white" size="sm" onClick={confirmarLimpeza}>
                        Confirmar
                    </Button>
                </div>
            </div>,
            {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                onClose: () => {
                    // Lógica de ação após o fechamento do toast (cancelamento)
                    // toast.info("Operação cancelada.");
                }
            }
        );
    };

    const confirmarLimpeza = () => {
        localStorage.removeItem("produtos"); // Remove os produtos do armazenamento local
        setCartItems(0); // Define o número de itens do carrinho como zero
        toast.success("Sacolinha limpa com sucesso!");
    };

    function onLogout() {
        localStorage.removeItem("token");
        setShow(false);
        window.location.href = "/";
    }

    const autenticacao = Autenticacao()

    useEffect(() => {
        if (autenticacao) {
            axios.get(`http://localhost:3001/consumidores/${autenticacao.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            })
                .then((response) => {
                    setNomeUsuario(response.data.nome.split(' ')[0])
                })
        }
    }, [autenticacao])
    return (
        <>
            {["sm"].map((expand) => (
                <Navbar
                    key={expand}
                    bg="light"
                    expand={expand}
                    className=" flex-column mb-3 fixed-top"
                >
                    <Container>
                        <Navbar.Brand href="/">
                            <img src={logo} height={50} alt="" />
                        </Navbar.Brand>

                        {nomeUsuario && ( //nome de usuario perto logout
                            <Nav.Link>Oi, <b>{nomeUsuario}</b></Nav.Link> ///nome de usuario perto logout
                        )}

                        {
                            screenSize <= 576 ?
                                (<Button className="me-2 ms-auto" onClick={handleShowCart}>
                                    <CartIcon itemCount={cartItems}/>
                                </Button>)
                                : (null)
                        }

                        <>
                            <Navbar.Toggle
                                aria-controls={`offcanvasNavbar-expand-${expand}`}
                            />
                            <Navbar.Offcanvas
                                id={`offcanvasNavbar-expand-${expand}`}
                                aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                                placement="end"
                                className="menu-mobile"
                                style={{ maxWidth: "80vw" }}
                            >
                                <Offcanvas.Header closeButton>
                                    <Offcanvas.Title
                                        id={`offcanvasNavbarLabel-expand-${expand}`}
                                    />
                                </Offcanvas.Header>
                                <Offcanvas.Body>
                                    <Nav className="justify-content-end flex-grow-1 pe-3">
                                        {
                                            screenSize >= 576 ?
                                                (<Button className="me-2 ms-auto" onClick={handleShowCart}>
                                                    <CartIcon itemCount={cartItems}/>
                                                </Button>)
                                                : (null)
                                        }
                                        <Nav.Link href="/conta/consumidor" className="px-4 text-dark">
                                            {" "}
                                            <PersonFill size={20} /> Minha conta
                                        </Nav.Link>
                                        <Nav.Link onClick={handleShow} className="px-4 text-dark">
                                            {" "}
                                            <DoorOpenFill size={20} /> Sair
                                        </Nav.Link>
                                    </Nav>
                                </Offcanvas.Body>
                            </Navbar.Offcanvas>
                        </>
                    </Container>
                </Navbar>
            ))}
            <Modal show={showCartModal} onHide={handleCloseCart}>
                <Modal.Header closeButton>
                    <Modal.Title>Sacolinha</Modal.Title>
                </Modal.Header>
                <Modal.Body className="border">
                    {Array.isArray(produtosCarrinho) &&
                        produtosCarrinho.map((item, index) => {
                            return (
                                <div className="pb-2" key={item.produto.id}>
                                    <Card>
                                        <Card.Header>
                                            <Row>
                                                <Col className="text-start">
                                                    {item.empreendedorNome}
                                                </Col>
                                            </Row>
                                        </Card.Header>
                                        <Card.Body className="d-flex justify-content-center">
                                            <Row className="">
                                                <Col className="d-flex">
                                                    <Button
                                                        variant="none me-1 p-0"
                                                        onClick={() => handleRemoverProduto(index)}
                                                    >
                                                        <XCircleFill
                                                            className="text-danger me-1"
                                                            size={25}
                                                        ></XCircleFill>
                                                    </Button>
                                                    <div>
                                                        <Image
                                                            className="image w-100 rounded-2 mt-2"
                                                            style={{ objectFit: "cover", aspectRatio: "1/1" }}
                                                            src={`http://localhost:3001/${item.produto.foto}`}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col className="m-0 p-0 align-items-center d-flex">
                                                    <div>
                                                        {item.produto.nome}
                                                        <br />
                                                        {item.produto.desconto > 0 && (item.produto.dataDesconto > dataHoje) ? (
                                                            <>
                                                                <b>
                                                                    R${" "}
                                                                    {parseFloat(
                                                                        item.produto.preco *
                                                                        (1 - item.produto.desconto / 100)
                                                                    ).toFixed(2)}
                                                                </b>
                                                                <br />
                                                                <i className="text-secondary text-decoration-line-through font-italic">
                                                                    R$ {parseFloat(item.produto.preco).toFixed(2)}
                                                                </i>
                                                            </>
                                                        ) : (
                                                            <b>
                                                                R$ {parseFloat(item.produto.preco).toFixed(2)}
                                                            </b>
                                                        )}
                                                    </div>
                                                </Col>
                                                <Col className="d-flex align-items-center justify-content-center text-center">
                                                    <div className="d-flex flex-column flex-sm-row align-items-center">
                                                        <div className="d-flex flex-wrap align-items-center flex-column flex-sm-row">
                                                            <div>
                                                                <span className="me-2">Quantidade:</span>
                                                            </div>
                                                            <div className="d-flex flex-wrap">
                                                                <div className="mb-1 mb-sm-0">
                                                                    <Button
                                                                        className="btn-sm"
                                                                        variant="danger text-white"
                                                                        onClick={() => handleDiminuir(index)}
                                                                    >
                                                                        -
                                                                    </Button>
                                                                </div>
                                                                <div className="mb-1 mb-sm-0">
                                                                    <Button className="bg-light btn-sm" variant="light">
                                                                        {item.quantidade}
                                                                    </Button>
                                                                </div>
                                                                <div className="mb-1 mb-sm-0">
                                                                    <Button
                                                                        className="me-1 btn-sm"
                                                                        variant="danger text-white"
                                                                        onClick={() => handleAumentar(index)}
                                                                    >
                                                                        +
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </Col>

                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </div>
                            );
                        })}
                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex flex-column flex-lg-row align-items-center justify-content-lg-between">
                        <b className="pe-1 fs-5 mb-2 mb-lg-0">Total: R$ {valorTotal.toFixed(2)}</b>
                        <div className=" d-flex justify-content-between">
                            <Button className="me-1" variant="primary" onClick={handleCloseCart}>
                                Finalizar Compra
                            </Button>
                            <Button variant="danger text-white" onClick={handleLimparSacolinha}><TrashFill /></Button>
                        </div>
                    </div>
                </Modal.Footer>
                <ToastContainer variant="none"
                    // toastClassName="custom-toast"
                    bodyClassName="custom-toast-body"
                    containerClassName="custom-toast-container"
                />
            </Modal>
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
