import axios from "axios";
import { useForm } from "react-hook-form";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";

export function AddProdutoAdmin() {
    const { handleSubmit, register, formState: { errors }, watch } = useForm();
    const [imagem, setImagem] = useState(null);
    const [imagemCarregada, setImagemCarregada] = useState(false);
    const navigate = useNavigate();
    const [empreendedores, setEmpreendedores] = useState([]);

    function handleImagemSelecionada(event) {
        setImagem(event.target.files[0]);
        setImagemCarregada(false);
    }

    useEffect(() => {
        axios.get(`http://localhost:3001/empreendedores`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        ).then((response) => {
            setEmpreendedores(response.data.content)


        })
    }, []
    )

    function onSubmit(data) {
        setImagem(data.foto[0]);

        const formData = new FormData();

        formData.append("nome", data.nome);
        formData.append("preco", data.preco);
        formData.append("descricao", data.descricao);
        formData.append("desconto", data.desconto);
        formData.append("dataDesconto", data.dataDesconto ?? '');
        formData.append("foto", data.foto[0]);
        formData.append("categoria", data.categoria);
        formData.append("quantidade", data.quantidade);
        formData.append("usuarioId", data.usuarioId);

        axios
            .post("http://localhost:3001/produtos", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                toast.success("Produto adicionado com sucesso!", {
                    position: "bottom-right",
                    duration: 2500,
                });
                navigate("/");
            })
            .catch((error) => {
                toast.error("Não foi possível adicionar um novo Produto.", {
                    position: "bottom-left",
                    duration: 3000,
                });
            });
    }

    return (
        <div className="container">
            <h1>Cadastrar Produto</h1>
            <Form onSubmit={handleSubmit(onSubmit)}>

                <Form.Group>
                    <Form.Label>Selecionar empreendedor do produto</Form.Label>
                    <Form.Select defaultValue=""
                        className={errors.usuarioId ? errors.usuarioId && "is-invalid" : "custom-form-group"}
                        {...register("usuarioId", { required: "O empreendedor é necessário." })}
                    >

                        <option value="">Selecione um empreendedor...</option>
                        {empreendedores.map((empreendedor) => {
                            return (
                                <option key={empreendedor.id} value={empreendedor.id}>{empreendedor.nome}</option>
                            )
                        })}
                    </Form.Select>
                </Form.Group>

                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Produto</Form.Label>
                            <Form.Control type="text" placeholder="Nome do produto" className={errors.nome ? errors.nome && "is-invalid" : "custom-form-group"}
                                {...register("nome", { required: "O nome é obrigatório.", maxLength: { value: 255, message: "Limite de 255 caracteres." } })} />
                            {errors.nome && <Form.Text className="invalid-feedback">{errors.nome.message}</Form.Text>}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formImagem">
                            <Form.Label>Imagem</Form.Label>
                            <input
                                type="file"
                                className={errors.foto ? "is-invalid form-control" : "custom-form-group form-control"}
                                {...register("foto", { required: "A foto é obrigatória, nos formatos .png e jpeg" })}
                                id="file-upload"
                                accept="image/png, image/jpeg"
                                onChange={handleImagemSelecionada}
                            />
                            {imagem && imagemCarregada && console.log("img carregada")}
                            {errors.foto && (
                                <Form.Text className="invalid-feedback">
                                    {errors.foto.message}
                                </Form.Text>
                            )}
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Categoria</Form.Label>
                            <Form.Select defaultValue=""
                                className={errors.categoria ? errors.categoria && "is-invalid" : "custom-form-group"}
                                {...register("categoria", {
                                    required: "A categoria é obrigatória.",
                                })}>
                                <option value="">Selecione uma categoria...</option>
                                <option value="feminino">Feminino</option>
                                <option value="masculino">Masculino</option>
                                <option value="infantil">Infantil</option>
                                <option value="acessorios">Acessorios</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Preço</Form.Label>
                            <InputGroup>
                                <InputGroup.Text id="inputGroupPrepend" className="inputGroupPrepend">R$</InputGroup.Text>
                                <Form.Control
                                    placeholder="0,01"
                                    type="number"
                                    className={errors.preco ? errors.preco && "is-invalid" : "custom-form-group"}
                                    {...register("preco", {
                                        required: "Preço é obrigatório.",
                                        min: { value: 0.01, message: "O preço mínimo é R$0,01." },
                                    })}
                                    inputMode="numeric"
                                    step="0.01"
                                    aria-describedby="inputGroupPrepend"
                                />

                                {errors.preco && (
                                    <Form.Text className="invalid-feedback">
                                        {errors.preco.message}
                                    </Form.Text>
                                )}


                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Estoque</Form.Label>
                            <Form.Control placeholder="1"
                                min="1"
                                type="number"
                                className={errors.quantidade ? errors.quantidade && "is-invalid" : "custom-form-group "}
                                // className="custom-form-group"
                                {...register("quantidade", {
                                    required: "A quantidade é obrigatória.",
                                    min: { value: 1, message: "A quantidade mínima é 1." }
                                })}
                            />
                            {errors.quantidade && (
                                <Form.Text className="invalid-feedback">
                                    {errors.quantidade.message}
                                </Form.Text>
                            )}

                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Desconto</Form.Label>
                            <InputGroup>
                                <InputGroup.Text id="inputGroupPrepend" className="inputGroupPrepend">
                                    %
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="1"
                                    type="number"
                                    className={errors.desconto ? "is-invalid" : "custom-form-group"}
                                    {...register("desconto", {
                                        min: { value: 1, message: "O desconto mínimo é 1." },
                                    })}
                                    inputMode="numeric"
                                    step="1"
                                    aria-describedby="inputGroupPrepend"
                                />
                            </InputGroup>
                        </Form.Group>
                    </Col>

                    <Col>
                        {watch("desconto") && (
                            <Form.Group className="mb-3">
                                <Form.Label>Desconto válido até</Form.Label>
                                <Form.Control
                                    id="custom-form-group"
                                    type="date"
                                    className={
                                        errors.dataDesconto ? "is-invalid" : "custom-form-group"
                                    }
                                    {...register("dataDesconto", {
                                    })}
                                    min={new Date().toISOString().slice(0, 10)}
                                />
                            </Form.Group>
                        )}
                    </Col>
                </Row>


                <Form.Group className="mb-3">
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control id="custom-form-group" as="textarea" rows={5} type="text"
                        className={errors.descricao ? errors.descricao && "is-invalid" : "custom-form-group "}
                        {...register("descricao", { required: "A descrição é obrigatório.", })} />
                    {errors.descricao && (
                        <Form.Text className="invalid-feedback">
                            {errors.descricao.message}
                        </Form.Text>
                    )}
                </Form.Group>

                <div className="d-flex justify-content-end">
                    <Button variant="warning" type="submit" className="ml-auto">
                        Cadastrar
                    </Button>
                </div>
            </Form>
        </div>
    )
}