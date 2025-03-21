import React, { useState } from 'react';
import { FaChartBar } from 'react-icons/fa';
import './FormStyles.css';

function Grafico() {
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState(new Date().getFullYear().toString());
  const [graficoUrl, setGraficoUrl] = useState(null);
  const [errors, setErrors] = useState({});

  const validar = () => {
    let erros = {};
    if (!mes || mes < 1 || mes > 12) erros.mes = "Mês deve ser entre 1 e 12";
    if (!ano || ano < 2000 || ano > new Date().getFullYear()) erros.ano = `Ano deve ser entre 2000 e ${new Date().getFullYear()}`;
    setErrors(erros);
    return Object.keys(erros).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validar()) {
      setGraficoUrl(`http://localhost:8000/api/grafico/${mes}/${ano}`);
    }
  };

  return (
    <section className="form-section">
      <h2>Gráfico de Movimentações</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div>
          <label>Mês</label>
          <input
            type="number"
            placeholder="Digite o mês (1-12)"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            min="1"
            max="12"
          />
          {errors.mes && <span>{errors.mes}</span>}
        </div>
        <div>
          <label>Ano</label>
          <input
            type="number"
            placeholder="Digite o ano"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            min="2000"
            max={new Date().getFullYear()}
          />
          {errors.ano && <span>{errors.ano}</span>}
        </div>
        <button type="submit">
          <FaChartBar style={{ marginRight: '8px' }} /> Gerar Gráfico
        </button>
      </form>
      {graficoUrl && (
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <img src={graficoUrl} alt="Gráfico de Movimentações" style={{ maxWidth: '100%', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }} />
        </div>
      )}
    </section>
  );
}

export default Grafico;