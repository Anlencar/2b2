import { useEffect, useRef, useState } from "react";
import "./App.css";

const IMAGEM_URL =
  "https://p2.trrsf.com.br/image/fget/cf/540/960/smart/images.terra.com/2023/10/02/design-sem-nome-(26)-1hvbk0d7oqerb.png";

const TITULO = "CLICA NA IMAGEM!";

const FRASE = "SITE DOIDÃO • CLICA NA IMAGEM • A COR MUDA • ";

function Faixa({ reversa }) {
  const texto = FRASE.repeat(6);
  return (
    <div className={`faixa ${reversa ? "faixa--reversa" : ""}`} aria-hidden="true">
      <div className="faixa__trilho">
        <span>{texto}</span>
        <span>{texto}</span>
      </div>
    </div>
  );
}

export default function App() {
  const [matiz, setMatiz] = useState(210);
  const [turbo, setTurbo] = useState(false);
  const [cliques, setCliques] = useState(0);
  const [falhou, setFalhou] = useState(false);
  const intervalo = useRef(null);
  const parada = useRef(null);

  useEffect(() => {
    return () => {
      clearInterval(intervalo.current);
      clearTimeout(parada.current);
    };
  }, []);

  const sortearMatiz = () =>
    setMatiz((atual) => (atual + 47 + Math.floor(Math.random() * 70)) % 360);

  const clicar = () => {
    setCliques((c) => c + 1);
    clearInterval(intervalo.current);
    clearTimeout(parada.current);

    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    sortearMatiz();
    if (reduzir) return;

    setTurbo(true);
    intervalo.current = setInterval(sortearMatiz, 90);
    parada.current = setTimeout(() => {
      clearInterval(intervalo.current);
      setTurbo(false);
    }, 1800);
  };

  return (
    <main className="site" style={{ "--h": matiz }}>
      <Faixa />

      <h1 className="titulo" aria-label={TITULO}>
        {TITULO.split("").map((letra, i) => (
          <span
            key={i}
            className="letra"
            aria-hidden="true"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            {letra === " " ? " " : letra}
          </span>
        ))}
      </h1>

      <section className="palco">
        <div className={`lado ${turbo ? "turbo" : ""}`}>
          <div className={`quica ${turbo ? "turbo" : ""}`}>
            <button
              type="button"
              className="imagem-botao"
              onClick={clicar}
              aria-label="Clique para mudar a cor do site"
            >
              {falhou ? (
                <span className="imagem-fallback">?</span>
              ) : (
                <img
                  src={IMAGEM_URL}
                  alt="Imagem pulando de um lado para o outro"
                  referrerPolicy="no-referrer"
                  draggable="false"
                  onError={() => setFalhou(true)}
                />
              )}
            </button>
          </div>
        </div>
      </section>

      <p className="contador">
        {turbo ? "MODO ARCO-ÍRIS!!!" : "Clica aí pra mudar a cor!"}
        <strong> Cliques: {cliques}</strong>
      </p>

      <Faixa reversa />
    </main>
  );
}