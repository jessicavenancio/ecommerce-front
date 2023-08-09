import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export function Cadastro() {

  return (

    <div className="text-center">
      <h1>Crie sua Conta</h1>
      <h5 className="mb-4">Já possui? <Link to="/login" style={{ color: "#00B894", textDecoration: "none" }}>Entre</Link></h5>

      <div style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Link to="/empreendedores/novo">
          <Button type="submit" className="custom-button" style={{ margin: '10px' }}>
            Empreendedor
          </Button>
        </Link>

        <Link to="/consumidores/novo">
          <Button type="submit" className="custom-button" style={{ margin: '10px' }}>
            Consumidor
          </Button>
        </Link>
      </div>
    </div>

  );
}