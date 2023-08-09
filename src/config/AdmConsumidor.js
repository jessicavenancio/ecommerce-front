import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Autenticacao } from "./Autenticacao";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

export const AdmConsumidor = (props) => {
    const autenticacao = Autenticacao();
    const navigate = useNavigate();
    const resposta = autenticacao.token && (autenticacao.tipo == "consumidor" || autenticacao.tipo == "administrador");

    function presentPage() {
        navigate(-1);
    }

    useEffect(() => {
        if (!resposta) {
            console.log("resposta" + resposta);
            presentPage();
            return null;
        }
    }, [autenticacao.tipo, navigate]);

    if (!autenticacao.token) {
        toast.success("Acesso negado.", { position: "bottom-right", duration: 7000 })
        return <Navigate to="/" />
    };

    return <Outlet {...props} />;
};

