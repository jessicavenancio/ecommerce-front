import { useState } from "react";
import { Button, Col, Form, Image, InputGroup, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import imgLogin from "../../images/IMGLOGIN.png"

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [inputType, setInputType] = useState("password");
  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const [iconType, setIconType] = useState("bi bi-eye-slash");
  const navigate = useNavigate();

  function showPassword() {
    if (inputType === "password") {
      setInputType("text");
      setIconType("bi bi-eye");
    } else {
      setInputType("password");
      setIconType("bi bi-eye-slash");
    }
  }

  // função que faz o login
  function onSubmit(data) {
    // conexão com a rota de login
    axios
      .post("http://localhost:3001/auth/login", data)
      .then((response) => {
        // se a resposta for 200, gera o token
        if (response.status === 200) {
          const { acessToken } = response.data;

          // armazena o token
          localStorage.setItem("token", acessToken);

          try {
            // decodifica o token armazenado
            const decodedToken = jwt_decode(acessToken);

            // salva o token decodificado como cookie
            document.cookie = `jwt=${JSON.stringify(decodedToken)}; path=/;`;

            toast.success("Login realizado com sucesso.", {
              position: "bottom-right",
              duration: 2000,
            });
            navigate("/");
            window.location.reload();
          } catch (error) {
            toast.error("Token inválido.", {
              position: "bottom-right",
              duration: 2000,
            });
          }
        } else {
          toast.error("Falha na autenticação!", {
            position: "bottom-right",
            duration: 2000,
          });
        }
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message, {
            position: "bottom-right",
            duration: 2000,
          });
        } else {
          toast.error("Algo deu errado.", {
            position: "bottom-right",
            duration: 2000,
          });
        }

        setIncorrectPassword(true);
        console.log(error);
      });
  }

  return (
    <div className="Login d-flex justify-content-center align-items-center p-5">
      <Row className="p-4 align-items-center">
        <Col className="align-items-center mt-4 pe-4 d-none d-md-block">
          <Image src={imgLogin} alt="" />
        </Col>
        <Col className="align-items-center">
          <Form className="p-4 rounded-2 shadow" onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label className="d-flex justify-content-center">
                <h1>Entrar</h1>
                <br />
              </Form.Label>
              <Form.Text className="d-flex flex-column align-items-center">
                Não está cadastrado?{" "}
                <Link
                  to="/cadastro"
                  style={{ color: "#00B894", textDecoration: "none" }}
                >
                  Cadastre-se.
                </Link>
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>E-mail</Form.Label>
              <Form.Control
                type="email"
                className={
                  errors.email ? errors.email && "is-invalid" : "custom-form-group"
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
                <Form.Text className="invalid-feedback d-block">
                  {errors.email.message}
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Senha</Form.Label>
              <InputGroup className="mb-2">
                <Form.Control
                  type={inputType}
                  className={
                    errors.senha
                      ? errors.senha && "is-invalid"
                      : "custom-form-group"
                  }
                  {...register("senha", {
                    required: " A senha é obrigatória.",
                  })}
                />
                <InputGroup.Text
                  className="inputGroupPrepend"
                  onClick={showPassword}
                >
                  <span className={iconType}></span>
                </InputGroup.Text>
                {errors.senha && (
                  <Form.Text className="invalid-feedback d-block">
                    {errors.senha.message}
                  </Form.Text>
                )}
              </InputGroup>
            </Form.Group>

        {incorrectPassword && (
          <Form.Text className="text-danger mb-0">
            Senha incorreta. <br />
            Por favor, tente novamente.
          </Form.Text>
        )}

            <Button className="btn-upload w-100 mt-3 custom-button" type="submit">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
