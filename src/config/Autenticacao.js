import jwt_decode from "jwt-decode";
import { Navigate } from "react-router-dom";

export function Autenticacao() {
    let token = localStorage.getItem('token');
    let tipo;
    let id;
    let email;

    try {
        if (token) {
            const decodedToken = jwt_decode(token); // Decodifica o token
            tipo = decodedToken.tipo; // pega o tipo
            email = decodedToken.email // pega o email
            id = decodedToken.id; //pega o id
            return { tipo, id, token, email };
        } else if (!token || token === undefined) {
            return (
                { tipo, id, token },
                <Navigate to="/" />
            )
        }
    } catch (error) {
        console.log('Erro ao decodificar o token:', error);
    }
}