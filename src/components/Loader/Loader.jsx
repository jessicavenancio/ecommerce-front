import { Spinner } from "react-bootstrap";

export function Loader() {
    return (
        <div className="w-100 d-flex gap-3 justify-content-center align-items-center">
            <Spinner variant="primary" />
            Carregando...
        </div>
    );
}