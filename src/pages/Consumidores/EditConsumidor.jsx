import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Image } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Autenticacao } from "../../config/Autenticacao";
import imgConta from "../../images/IMGConta.png"

export function EditConsumidor() {

    const autenticacao = Autenticacao();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();
    const [imagem, setImagem] = useState(null)

    const [cidade, setCidade] = useState();
    const [cidades, setCidades] = useState([]);
    const [ufSelecionada, setUfSelecionada] = useState([]);
    const [estados, setEstados] = useState([]);
    const [imagemCarregada, setImagemCarregada] = useState(false);
    const { id } = useParams();

    function handleImagemSelecionada(event) {
        setImagem(event.target.files[0]);
        setImagemCarregada(false);
    }


    function onSubmit(data) {
        setImagem(data.foto[0])
        const formData = new FormData();

        formData.append("foto", data.foto[0]);
        formData.append("nome", data.nome);
        formData.append("email", data.email);
        formData.append("uf", data.uf);
        formData.append("cidade", data.cidade);
        formData.append("cep", data.cep);
        formData.append("rua", data.rua);
        formData.append("numero", data.numero);

        axios.put(`http://localhost:3001/consumidores/${id}`, formData, {
            headers: {

                Authorization: `Bearer ${autenticacao.token}`,

            },
        })
            .then(response => {
                toast.success("Cadastro editado.", { position: "bottom-right", duration: 2000 });
                if (autenticacao.tipo === 'consumidor') {
                    navigate("/conta/consumidor");
                } else {
                    navigate("/consumidores");
                }
            })
            .catch(error => {
                toast.error("Algo deu errado.", { position: "bottom-right", duration: 2000 });
                console.log(error);
            });
    }

    useEffect(() => {
        axios.get(`http://localhost:3001/consumidores/${id}`, {
            headers: {
                Authorization: `Bearer ${autenticacao.token}`,
            }
        })
            .then((response) => {
                const { nome, email, endereco: { uf, cidade, cep, rua, numero } } = response.data;

                setCidade(response.data.endereco.cidade)
                reset({ nome, email, uf, cidade, cep, rua, numero });
                setUfSelecionada(uf)

            })
            .catch((error) => {
                toast.error("Algo deu errado.", { position: "bottom-right", duration: 2000 });
                console.log(error);
            });
    }, [id, reset, cidade, autenticacao.token])



    useEffect(() => {
        if (ufSelecionada === null) {
            return;
        }
        axios
            .get(
                `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSelecionada}/municipios`
            )
            .then((response) => {
                setCidades(response.data);
            });
    }, [ufSelecionada]);

    useEffect(() => {
        axios
            .get("https://servicodados.ibge.gov.br/api/v1/localidades/estados/")
            .then((response) => {
                setEstados(response.data);
            });
    }, []);





return (
    <div className="container">
        <Row>
            <Col className="d-none d-lg-flex align-items-center justify-content-center rounded-start">
                <Image src={imgConta} alt="" />
            </Col>
            <Col className="bg-white shadow rounded-2 p-4">
                <h5>Editar Consumidor</h5>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control type="text" placeholder="Nome completo" className={errors.nome ? errors.nome && "is-invalid" : "custom-form-group"} {...register("nome", { required: "O nome é obrigatório.", maxLength: { value: 255, message: "Limite de 255 caracteres." } })} />
                                {errors.nome && <Form.Text className="invalid-feedback">{errors.nome.message}</Form.Text>}
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>E-mail</Form.Label>
                                <Form.Control type="email" placeholder="Email" className={errors.email ? errors.email && "is-invalid" : "custom-form-group"} {...register("email", { required: "O e-mail é obrigatório.", maxLength: { value: 255, message: "Limite de 255 caracteres." } })} />
                                {errors.email && <Form.Text className="invalid-feedback">{errors.email.message}</Form.Text>}
                            </Form.Group>
                        </Col>

                        <Row>
                            <Col>
                                <Form.Group controlId="formImagem">
                                    <Form.Label>Imagem</Form.Label>
                                    <input
                                        type="file"
                                        className="form-control"{...register("foto")}
                                        id="file-upload"
                                        onChange={handleImagemSelecionada}
                                    />
                                    {imagem && imagemCarregada && console.log("img carregada")}

                                    {errors.imagem && (
                                        <Form.Text className="invalid-feedback">
                                            {errors.imagem.message}
                                        </Form.Text>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group className="mb-2">
                                    <Form.Label> UF </Form.Label>
                                    <br />

                                    <Form.Select id="uf" className={errors.uf ? errors.uf && "is-invalid" : "custom-form-group"} {...register("uf", { required: "O estado é obrigatório.", })}
                                        onChange={(event) => setUfSelecionada(event.target.value)}>
                                        <option value=""> Selecione uma UF </option>
                                        {estados.map((uf) => (
                                            <option key={uf.sigla} value={uf.sigla}>
                                                {uf.sigla}
                                            </option>
                                        ))}
                                    </Form.Select>

                                    <Form.Text className="invalid-feedback">
                                        {errors.endereco?.uf.message}
                                    </Form.Text>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group className="mb-2">
                                    <Form.Label> Cidade </Form.Label>
                                    <br />
                                    <Form.Select id="cidade" className={errors.cidade ? errors.cidade && "is-invalid" : "custom-form-group"} {...register("cidade", { required: "A cidade é obrigatória.", })}>
                                        <option value="">Selecione uma cidade</option>
                                        {cidades.map((cidade) => (
                                            <option key={cidade.id} value={cidade.nome}>
                                                {cidade.nome}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Text className="invalid-feedback">
                                        {errors.endereco?.cidade.message}
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>CEP</Form.Label>
                                <Form.Control type="text" placeholder="CEP" className={errors.cep ? errors.cep && "is-invalid" : "custom-form-group"} {...register("cep", { required: "O CEP é obrigatório.", maxLength: { value: 9, message: "Limite de 9 caracteres." } })} />
                                {errors.cep && <Form.Text className="invalid-feedback">{errors.cep.message}</Form.Text>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Rua</Form.Label>
                                <Form.Control type="text" placeholder="Rua" className={errors.rua ? errors.rua && "is-invalid" : "custom-form-group"} {...register("rua", { required: "A rua é obrigatória.", maxLength: { value: 255, message: "Limite de 255 caracteres." } })} />
                                {errors.rua && <Form.Text className="invalid-feedback">{errors.endereco?.rua.message}</Form.Text>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Numero</Form.Label>
                                <Form.Control type="text" placeholder="Número" className={errors.numero ? errors.numero && "is-invalid" : "custom-form-group"} {...register("numero", { required: "O número é obrigatório.", maxLength: { value: 255, message: "Limite de 255 caracteres." } })} />
                                {errors.numero && <Form.Text className="invalid-feedback">{errors.numero.message}</Form.Text>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <hr />
                <div className="d-flex justify-content-end">
                    <Button variant="warning"  type="submit">
                    Salvar
                    </Button>
                </div>
                </Form>
            </Col>
        </Row>
    </div >
);
}