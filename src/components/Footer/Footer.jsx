import React from "react";
import { Link } from "react-router-dom";
import logo from "../../images/sacolinha-linha.png";

export function Footer() {
  return (
    <footer className="text-center text-lg-start bg-light text-muted">
      <section>
        <div className="container text-center text-md-start mt-5">
          <div className="row mt-3">
            <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
              <img src={logo} width="130" alt="logo com nome" className="mb-4 mt-3" />
              <p >
                <Link className="text-reset" style={{ textDecoration: "none" }}>Termos de uso</Link>
              </p>
              <p>
                <Link className="text-reset" style={{ textDecoration: "none" }}>Politica de privacidade</Link>
              </p>
              <p>
                <Link className="text-reset" style={{ textDecoration: "none" }}>Sobre</Link>
              </p>
              <p>
                <Link className="text-reset" style={{ textDecoration: "none" }}>Ajuda</Link>
              </p>
            </div>
            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4 mt-4">
              <h6 className="text-black fw-bold mb-4 h5 ">Contato</h6>
              <p>
                <i className="bi bi-whatsapp"></i> 11 9 9999 9999{" "}
              </p>
              <p>
                <i className="bi bi-facebook"></i> @sacolinha{" "}
              </p>
              <p>
                <i className="bi bi-instagram"></i> @sacolinha
              </p>
              <p>
                <i className="bi bi-envelope-at"> </i>contato@sacolinha.com
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="text-center p-4">
        {" "}
        © 2023 Copyright:
        <Link className="text-reset fw-bold" href="https://localhost3000/">
          {" "}
          Sacolinha.com.br{" "}
        </Link>
      </div>
    </footer>
  );
}
