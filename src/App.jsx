import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { NovoConsumidor } from "./pages/Consumidores/NovoConsumidor";
import { AddProdutos } from "./pages/Produtos/AddProdutos";
import { Login } from "./pages/Login/Login";
import { Consumidores } from "./pages/Consumidores/Consumidores";
import { Root } from "./pages/Root/Root";
import { Empreendedores } from "./pages/Empreendedores/Empreendedores";
import { NovoEmpreendedor } from "./pages/Empreendedores/NovoEmpreendedor";
import { NotFound } from "./components/NotFound/NotFound";
import { Produto } from "./pages/Produtos/Produto";
import { Cadastro } from "./pages/Cadastro/Cadastro";
import { EditConsumidor } from "./pages/Consumidores/EditConsumidor";
import { EditEmpreendedores } from "./pages/Empreendedores/EditEmpreendedores";
import { Categorias } from "./pages/Produtos/Categorias";
import { ListaProdutos } from "./pages/Produtos/ListaProdutos";
import { EditSenhaEmpreendedor } from "./pages/Empreendedores/EditSenhaEmpreendedor";
import { EditSenhaConsumidor } from "./pages/Consumidores/EditSenhaConsumidor";
import { Toaster } from "react-hot-toast";
import { EditaProd } from "./pages/Produtos/EditaProd";
import { Conta } from "./pages/Conta/Conta";
import { ListaProdutosAdmin } from "./pages/Produtos/ListaProdutosAdmin";
import { ProtecaoAdmin } from "./config/ProtecaoAdmin";
import { ProtecaoConsumidor } from "./config/ProtecaoConsumidor";
import { ProtecaoEmpreendedor } from "./config/ProtecaoEmpreendedor";
import { AdmConsumidor } from "./config/AdmConsumidor";
import { AdmEmpreendedor } from "./config/AdmEmpreendedor";
import { AddProdutoAdmin } from "./pages/Produtos/AddProdutoAdmin";

export function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />}>
            {/* Rotas sem controle de acesso */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/consumidores/novo" element={<NovoConsumidor />} />
            <Route path="/produto/:id" element={<Produto />} />
           
            <Route path="/categoria/:categoria" element={<Categorias />} />
            <Route path="/empreendedores/novo" element={<NovoEmpreendedor />} />
            <Route path="*" element={<NotFound />} />

            {/* Rotas de acesso administrador */}
            <Route path="/" element={<ProtecaoAdmin />}>
              <Route path="/" element={<Outlet />} />
              <Route path="/consumidores" element={<Consumidores />} />
              <Route path="/produtos/admin/lista" element={<ListaProdutosAdmin />} />
              <Route path="/empreendedores" element={<Empreendedores />} />
              <Route path="/produtos/admin/novo" element={<AddProdutoAdmin/>}/>
            </Route>

            {/* Rotas de acesso do empreendedor */}
            <Route path="/" element={<ProtecaoEmpreendedor />}>
              <Route path="/" element={<Outlet />} />
              <Route path="/produtos/lista" element={<ListaProdutos />} />
              <Route path="/conta/empreendedor" element={<Conta />} />
              <Route path="/empreendedores/senha/editar/:id" element={<EditSenhaEmpreendedor />} />
            </Route>

            {/* Rotas de acesso do consumidor */}
            <Route path="/" element={<ProtecaoConsumidor />}>
              <Route path="/" element={<Outlet />} />
              <Route path="/conta/consumidor" element={<Conta />} />
            </Route>

            {/* Rotas de acesso do consumidor e adm */}
            <Route path="/" element={<AdmConsumidor />}>
              <Route path="/" element={<Outlet />} />
              <Route path="/consumidores/editar/:id" element={<EditConsumidor />} />
              <Route path="/consumidores/senha/editar/:id" element={<EditSenhaConsumidor />} />
            </Route>

            {/* Rotas de acesso do empreendedor e adm */}
            <Route path="/" element={<AdmEmpreendedor />}>
              <Route path="/" element={<Outlet />} />
              <Route path="/empreendedores/editar/:id" element={<EditEmpreendedores />} />
              <Route path="/produtos/novo" element={<AddProdutos />} />
              <Route path="/produtos/:id" element={<EditaProd />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
