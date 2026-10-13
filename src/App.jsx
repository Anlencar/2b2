// App.jsx — 2B2 | Telas de Login e Cadastro de Empresa
// Substitua o conteúdo do seu src/App.jsx por este arquivo.
// Certifique-se de que o main.jsx importa o App normalmente e que o App.css está na mesma pasta.

import { useState } from "react";
import "./App.css";

/* =====================================================
   FUNÇÕES AUXILIARES (máscaras e validações)
   ===================================================== */

// Mantém apenas dígitos
const apenasDigitos = (valor) => valor.replace(/\D/g, "");

// Máscara de CNPJ: 00.000.000/0000-00
const mascaraCNPJ = (valor) => {
  const d = apenasDigitos(valor).slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};

// Máscara de telefone: (00) 0000-0000 ou (00) 00000-0000
const mascaraTelefone = (valor) => {
  const d = apenasDigitos(valor).slice(0, 11);
  if (d.length <= 10) {
    return d
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return d.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
};

// Validação de CNPJ (dígitos verificadores)
const cnpjValido = (cnpj) => {
  const d = apenasDigitos(cnpj);
  if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false;

  const calcDigito = (base) => {
    const pesos =
      base.length === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const soma = base
      .split("")
      .reduce((acc, num, i) => acc + Number(num) * pesos[i], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const d1 = calcDigito(d.slice(0, 12));
  const d2 = calcDigito(d.slice(0, 12) + d1);
  return d1 === Number(d[12]) && d2 === Number(d[13]);
};

// Validação simples de e-mail
const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/* =====================================================
   COMPONENTES REUTILIZÁVEIS
   ===================================================== */

// Campo de formulário com label e mensagem de erro
function Campo({ id, label, erro, children }) {
  return (
    <div className={`campo ${erro ? "campo--erro" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {erro && <span className="campo__erro">{erro}</span>}
    </div>
  );
}

// Campo de senha com botão para mostrar/ocultar
function CampoSenha({ id, label, value, onChange, erro, autoComplete }) {
  const [visivel, setVisivel] = useState(false);

  return (
    <Campo id={id} label={label} erro={erro}>
      <div className="campo__senha">
        <input
          id={id}
          name={id}
          type={visivel ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="campo__toggle"
          onClick={() => setVisivel(!visivel)}
          aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
        >
          {visivel ? "Ocultar" : "Mostrar"}
        </button>
      </div>
    </Campo>
  );
}

// Logotipo da marca
function Logo() {
  return (
    <div className="logo">
      <span className="logo__icone">2B</span>
      <span className="logo__texto">2B2</span>
    </div>
  );
}

/* =====================================================
   TELA DE LOGIN
   ===================================================== */
function TelaLogin({ irParaCadastro }) {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErros((prev) => ({ ...prev, [name]: undefined })); // limpa o erro ao digitar
  };

  const validar = () => {
    const novosErros = {};
    if (!emailValido(form.email)) novosErros.email = "Informe um e-mail válido.";
    if (!form.senha) novosErros.senha = "Informe sua senha.";
    return novosErros;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const novosErros = validar();
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    setEnviando(true);
    // TODO: substituir pela chamada real à sua API de autenticação
    // ex.: await fetch("/api/auth/login", { method: "POST", body: JSON.stringify(form) })
    await new Promise((r) => setTimeout(r, 800));
    setEnviando(false);
    console.log("Login enviado:", form);
    alert("Login simulado com sucesso!");
  };

  const handleEsqueceuSenha = () => {
    // TODO: navegar para o fluxo de recuperação de senha
    alert("Fluxo de recuperação de senha ainda não implementado.");
  };

  return (
    <div className="card">
      <Logo />
      <h1 className="card__titulo">Acesse sua conta</h1>
      <p className="card__subtitulo">
        Entre para gerenciar sua empresa na plataforma 2B2.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <Campo id="email" label="E-mail corporativo" erro={erros.email}>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="voce@suaempresa.com.br"
            autoComplete="email"
          />
        </Campo>

        <CampoSenha
          id="senha"
          label="Senha"
          value={form.senha}
          onChange={handleChange}
          erro={erros.senha}
          autoComplete="current-password"
        />

        <div className="linha-acoes">
          <button
            type="button"
            className="link-botao"
            onClick={handleEsqueceuSenha}
          >
            Esqueceu a senha?
          </button>
        </div>

        <button type="submit" className="botao botao--primario" disabled={enviando}>
          {enviando ? "Acessando..." : "Acessar"}
        </button>
      </form>

      <p className="card__rodape">
        Não tem conta?{" "}
        <button type="button" className="link-botao" onClick={irParaCadastro}>
          Cadastre sua empresa
        </button>
      </p>
    </div>
  );
}

/* =====================================================
   TELA DE CADASTRO DE EMPRESA
   ===================================================== */
function TelaCadastro({ irParaLogin }) {
  const [form, setForm] = useState({
    razaoSocial: "",
    cnpj: "",
    email: "",
    telefone: "",
    porte: "",
    senha: "",
    confirmarSenha: "",
  });
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Aplica máscara nos campos que precisam
    let novoValor = value;
    if (name === "cnpj") novoValor = mascaraCNPJ(value);
    if (name === "telefone") novoValor = mascaraTelefone(value);

    setForm((prev) => ({ ...prev, [name]: novoValor }));
    setErros((prev) => ({ ...prev, [name]: undefined }));
  };

  const validar = () => {
    const e = {};
    if (form.razaoSocial.trim().length < 3)
      e.razaoSocial = "Informe a razão social ou nome da empresa.";
    if (!cnpjValido(form.cnpj)) e.cnpj = "CNPJ inválido.";
    if (!emailValido(form.email)) e.email = "Informe um e-mail válido.";
    if (apenasDigitos(form.telefone).length < 10)
      e.telefone = "Informe um telefone com DDD.";
    if (!form.porte) e.porte = "Selecione o porte da empresa.";
    if (form.senha.length < 8) e.senha = "A senha deve ter ao menos 8 caracteres.";
    if (form.confirmarSenha !== form.senha)
      e.confirmarSenha = "As senhas não coincidem.";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const novosErros = validar();
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    setEnviando(true);
    // TODO: substituir pela chamada real à sua API de cadastro
    // Dica: não envie "confirmarSenha" ao backend.
    const { confirmarSenha, ...payload } = form;
    await new Promise((r) => setTimeout(r, 1000));
    setEnviando(false);
    console.log("Cadastro enviado:", payload);
    alert("Cadastro simulado com sucesso!");
    irParaLogin();
  };

  return (
    <div className="card card--larga">
      <Logo />
      <h1 className="card__titulo">Cadastre sua empresa</h1>
      <p className="card__subtitulo">
        Preencha os dados abaixo para iniciar o onboarding na plataforma.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <Campo id="razaoSocial" label="Razão social / Nome da empresa" erro={erros.razaoSocial}>
          <input
            id="razaoSocial"
            name="razaoSocial"
            type="text"
            value={form.razaoSocial}
            onChange={handleChange}
            placeholder="Ex.: Acme Soluções Ltda."
            autoComplete="organization"
          />
        </Campo>

        {/* Duas colunas no desktop, uma no mobile */}
        <div className="grade">
          <Campo id="cnpj" label="CNPJ" erro={erros.cnpj}>
            <input
              id="cnpj"
              name="cnpj"
              type="text"
              inputMode="numeric"
              value={form.cnpj}
              onChange={handleChange}
              placeholder="00.000.000/0000-00"
            />
          </Campo>

          <Campo id="porte" label="Porte da empresa" erro={erros.porte}>
            <select id="porte" name="porte" value={form.porte} onChange={handleChange}>
              <option value="">Selecione...</option>
              <option value="1-10">1 a 10 funcionários</option>
              <option value="11-50">11 a 50 funcionários</option>
              <option value="50+">Mais de 50 funcionários</option>
            </select>
          </Campo>
        </div>

        <div className="grade">
          <Campo id="email" label="E-mail corporativo" erro={erros.email}>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="voce@suaempresa.com.br"
              autoComplete="email"
            />
          </Campo>

          <Campo id="telefone" label="Telefone / WhatsApp" erro={erros.telefone}>
            <input
              id="telefone"
              name="telefone"
              type="tel"
              inputMode="tel"
              value={form.telefone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              autoComplete="tel"
            />
          </Campo>
        </div>

        <div className="grade">
          <CampoSenha
            id="senha"
            label="Senha"
            value={form.senha}
            onChange={handleChange}
            erro={erros.senha}
            autoComplete="new-password"
          />
          <CampoSenha
            id="confirmarSenha"
            label="Confirmar senha"
            value={form.confirmarSenha}
            onChange={handleChange}
            erro={erros.confirmarSenha}
            autoComplete="new-password"
          />
        </div>

        <button type="submit" className="botao botao--primario" disabled={enviando}>
          {enviando ? "Enviando..." : "Cadastrar empresa"}
        </button>
      </form>

      <p className="card__rodape">
        Já tem conta?{" "}
        <button type="button" className="link-botao" onClick={irParaLogin}>
          Faça login
        </button>
      </p>
    </div>
  );
}

/* =====================================================
   COMPONENTE PRINCIPAL — alterna entre as telas
   ===================================================== */
export default function App() {
  // "login" | "cadastro"
  const [tela, setTela] = useState("login");

  return (
    <main className="pagina">
      {tela === "login" ? (
        <TelaLogin irParaCadastro={() => setTela("cadastro")} />
      ) : (
        <TelaCadastro irParaLogin={() => setTela("login")} />
      )}
      <footer className="pagina__rodape">
        © {new Date().getFullYear()} 2B2. Todos os direitos reservados.
      </footer>
    </main>
  );
}