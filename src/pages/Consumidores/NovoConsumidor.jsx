import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row, InputGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function NovoConsumidor() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [cidades, setCidades] = useState([]);
  const [ufSelecionada, setUfSelecionada] = useState([]);
  const [estados, setEstados] = useState([]);
  const [imagem, setImagem] = useState(null);
  const [imagemCarregada, setImagemCarregada] = useState(false);

  function handleImagemSelecionada(event) {
    setImagem(event.target.files[0]);
    setImagemCarregada(false);
  }

  function onSubmit(data) {
    const formData = new FormData();
    setImagem(data.foto[0]);

    formData.append("foto", data.foto[0]);
    formData.append("nome", data.nome);
    formData.append("email", data.email);
    formData.append("senha", data.senha);
    formData.append("cpf", data.cpf);
    formData.append("uf", data.uf);
    formData.append("cidade", data.cidade);
    formData.append("cep", data.cep);
    formData.append("rua", data.rua);
    formData.append("numero", data.numero);

    axios
      .post("http://localhost:3001/consumidores", formData)
      .then((response) => {
        toast.success("Consumidor adicionado com sucesso.", {
          position: "bottom-right",
          duration: 2000,
        });
        navigate("/login");
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          toast.error("CPF já está em uso.", {
            position: "bottom-right",
            duration: 2000,
          });
        } else {
          toast.error("Algo de errado aconteceu.", {
            position: "bottom-right",
            duration: 2000,
          });
        }
        console.log(error);
      });
  }

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

  const [tipoInput, setTipoInput] = useState("password");
  const [tipoIcone, setTipoIcone] = useState("bi bi-eye-slash-fill");
  function mudarTipo() {
    if (tipoInput === "password") {
      setTipoIcone("bi bi-eye-fill");
      setTipoInput("text");
    } else {
      setTipoIcone("bi bi-eye-slash-fill");
      setTipoInput("password");
    }
  }

  return (
    <div className="container">
      <h5>Cadastro de Novo Consumidor</h5>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col>
            <Form.Group className="my-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nome completo"
                className={
                  errors.nome
                    ? errors.nome && "is-invalid"
                    : "custom-form-group"
                }
                {...register("nome", {
                  required: "O nome é obrigatório.",
                  maxLength: {
                    value: 255,
                    message: "Limite de 255 caracteres.",
                  },
                })}
              />
              {errors.nome && (
                <Form.Text className="invalid-feedback">
                  {errors.nome.message}
                </Form.Text>
              )}
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="my-3">
              <Form.Label>E-mail</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                className={
                  errors.email
                    ? errors.email && "is-invalid"
                    : "custom-form-group"
                }
                {...register("email", {
                  required: "O e-mail é obrigatório.",
                  maxLength: {
                    value: 255,
                    message: "Limite de 255 caracteres.",
                  },
                })}
              />
              {errors.email && (
                <Form.Text className="invalid-feedback">
                  {errors.email.message}
                </Form.Text>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Senha</Form.Label>

              <InputGroup className="mb-3 inputStyleSenha">
                <InputGroup.Text
                  className="inputGroupPrepend"
                  onClick={mudarTipo}
                >
                  <i className={tipoIcone}></i>
                </InputGroup.Text>
                <Form.Control
                  id="custom-form-group-input"
                  type={tipoInput}
                  placeholder="Senha"
                  className={
                    errors.senha
                      ? errors.senha && "is-invalid"
                      : "custom-form-group"
                  }
                  {...register("senha", { required: "Senha é obrigatória" })}
                />
                <Form.Text className="invalid-feedback">
                  {errors.senha?.message}
                </Form.Text>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formImagem">
              <Form.Label>Imagem</Form.Label>
              <input
                type="file"
                className="form-control"
                {...register("foto")}
                id="custom-form-group-input"
                accept="image/png, image/jpeg"
                onChange={handleImagemSelecionada}
              />
              {imagem && imagemCarregada && console.log("img carregada")}
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>CPF</Form.Label>
              <Form.Control
                type="text"
                placeholder="CPF somente números"
                className={
                  errors.cpf ? errors.cpf && "is-invalid" : "custom-form-group"
                }
                {...register("cpf", {
                  required: "O CPF é obrigatório.",
                  maxLength: { value: 14, message: "Limite de 14 caracteres." },
                })}
              />
              {errors.cpf && (
                <Form.Text className="invalid-feedback">
                  {errors.cpf.message}
                </Form.Text>
              )}
            </Form.Group>
          </Col>
          <Row>
            <Col>
              <Form.Group className="mb-2">
                <Form.Label> UF </Form.Label>

                <br />

                <Form.Select
                  id="uf"
                  className={`custom-form-group ${errors.uf ? "is-invalid" : ""
                    }`}
                  {...register("uf", {
                    required: "O estado é obrigatório.",
                  })}
                  onChange={(event) => setUfSelecionada(event.target.value)}
                >
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
                <Form.Select
                  id="cidade"
                  className={`custom-form-group ${errors.cidade ? "is-invalid" : ""
                    }`}
                  {...register("cidade", {
                    required: "A cidade é obrigatória.",
                  })}
                >
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
              <Form.Control
                type="text"
                placeholder="CEP "
                className={
                  errors.cep ? errors.cep && "is-invalid" : "custom-form-group"
                }
                {...register("cep", {
                  required: "O CEP é obrigatório.",
                  maxLength: { value: 9, message: "Limite de 9 caracteres." },
                })}
              />
              {errors.cep && (
                <Form.Text className="invalid-feedback">
                  {errors.cep.message}
                </Form.Text>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Rua</Form.Label>
              <Form.Control
                type="text"
                placeholder="Rua"
                className={
                  errors.rua ? errors.rua && "is-invalid" : "custom-form-group"
                }
                {...register("rua", {
                  required: "A rua é obrigatória.",
                  maxLength: {
                    value: 255,
                    message: "Limite de 255 caracteres.",
                  },
                })}
              />
              {errors.rua && (
                <Form.Text className="invalid-feedback">
                  {errors.rua.message}
                </Form.Text>
              )}
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Número</Form.Label>
              <Form.Control
                type="text"
                placeholder="Número"
                className={
                  errors.numero
                    ? errors.numero && "is-invalid"
                    : "custom-form-group"
                }
                {...register("numero", {
                  required: "O número é obrigatório.",
                  maxLength: {
                    value: 255,
                    message: "Limite de 255 caracteres.",
                  },
                })}
              />
              {errors.numero && (
                <Form.Text className="invalid-feedback">
                  {errors.numero.message}
                </Form.Text>
              )}
            </Form.Group>
          </Col>
        </Row>
        <div className="text-end ">
          <Button type="submit" className="custom-button">
            Cadastrar
          </Button>
        </div>
      </Form>
    </div>
  );
}
