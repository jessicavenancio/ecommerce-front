import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Form, Col, Row, InputGroup, Image } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import imgSenha from "../../images/IMGSenha.png"
import { Autenticacao } from "../../config/Autenticacao";

export function EditSenhaEmpreendedor() {
  const autenticacao = Autenticacao();
  const [iconType, setIconType] = useState("bi bi-eye-slash");
  const [inputType, setInputType] = useState("password");

  const {
    register,
    handleSubmit,
    reset,
  } = useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  function showPassword() {
    if (inputType === "password") {
      setInputType("text");
      setIconType("bi bi-eye");
    } else {
      setInputType("password");
      setIconType("bi bi-eye-slash");
    }
  }

  function onSubmit(data) {
    axios
      .put(`http://localhost:3001/empreendedores/senha/${id}`, data, {
        headers: {
          Authorization: `Bearer ${autenticacao.token}`,
        },
      })
      .then((response) => {
        toast.success("Senha editada com sucesso.", {
          position: "bottom-right",
          duration: 2000,
        });
        navigate("/");
      })
      .catch((error) => {
        toast.error("Algo deu errado.", {
          position: "bottom-right",
          duration: 2000,
        });
        console.log(error);
      });
  }
  useEffect(() => {
    axios
      .get(`http://localhost:3001/empreendedores/senha${id}`)
      .then((response) => {
        const { email, senha } = response.data;
        reset({ email, senha });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id, reset]);

  return (
    <div className="container">
      <Row className="p-5">
      <Col className="d-none d-lg-flex align-items-center justify-content-center rounded-start">
        <Image src={imgSenha} alt="" />
      </Col>
      <Col className="bg-white shadow rounded-2 p-4">
        <h5>Alterar Senha</h5>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  {...register("email", { required: "O e-mail é obrigatório." })}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className="mb-2">
                <Form.Label>Nova senha</Form.Label>
                <InputGroup className="mb-2">
                  <Form.Control
                    type={inputType}
                    placeholder="Nova senha"
                    {...register("senha", { required: "A senha é obrigatória." })}
                  />
                  <InputGroup.Text
                    className="inputGroupPrepend"
                    onClick={showPassword}
                  >
                    <span className={iconType}></span>
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <hr/>
          <div className="d-flex justify-content-center justify-content-md-end p-2">

          <Button variant="warning" className="me-2" type="submit">
            Salvar
          </Button>
          <Button variant="danger text-white" type="submit" as={Link} to={'/conta/empreendedor'}>
            Cancelar
          </Button>
          </div>
        </Form>
        </Col>
        </Row>
    </div>
  );
}
