import { Link } from "react-router-dom";
import imgnotfound from "../../images/IMG404.png";
import { Image } from "react-bootstrap";

export function NotFound() {
  return (
    <div className="container">
      <div className="d-flex flex-column align-items-center">
        <Image src={imgnotfound} height={400} alt="pagina nao encontrada" />
        <br/>
        <h6>Página não encontrada</h6>
        <Link to="/" className="text-success bold" >
          Voltar para página inicial
        </Link>
      </div>p
    </div>
  );
}
