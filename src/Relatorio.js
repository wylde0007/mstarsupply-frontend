import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFileAlt, FaEye, FaFileCsv, FaChartBar } from 'react-icons/fa';
import './FormStyles.css';

function Relatorio() {
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState(new Date().getFullYear().toString());
  const [movimentacoes, setMovimentacoes] = useState({ entradas: [], saidas: [] });
  const [mercadorias, setMercadorias] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8000/api/mercadorias').then(res => {
      const mercadoriasMap = {};
      res.data.forEach(m => {
        mercadoriasMap[m.id] = m.nome;
      });
      setMercadorias(mercadoriasMap);
    });
  }, []);

  const validar = () => {
    let erros = {};
    if (!mes || mes < 1 || mes > 12) erros.mes = "Mês deve ser entre 1 e 12";
    if (!ano || ano < 2000 || ano > new Date().getFullYear()) erros.ano = `Ano deve ser entre 2000 e ${new Date().getFullYear()}`;
    setErrors(erros);
    return Object.keys(erros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validar()) {
      const res = await axios.get(`http://localhost:8000/api/movimentacoes/${mes}/${ano}`);
      setMovimentacoes(res.data);
    }
  };

  const handleDownload = () => {
    if (validar()) {
      window.location.href = `http://localhost:8000/api/relatorio/${mes}/${ano}`;
    }
  };

  const handleDownloadGerencial = () => {
    if (validar()) {
      window.location.href = `http://localhost:8000/api/relatorio_gerencial/${mes}/${ano}`;
    }
  };

  const handleDownloadCSV = () => {
    if (validar()) {
      window.location.href = `http://localhost:8000/api/relatorio_csv/${mes}/${ano}`;
    }
  };

  return (
    <section className="form-section">
      <h2>Relatório Mensal</h2>
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
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit">
            <FaEye style={{ marginRight: '8px' }} /> Visualizar
          </button>
          <button type="button" onClick={handleDownload}>
            <FaFileAlt style={{ marginRight: '8px' }} /> Baixar PDF
          </button>
          <button type="button" onClick={handleDownloadGerencial}>
            <FaChartBar style={{ marginRight: '8px' }} /> Relatório Gerencial
          </button>
          <button type="button" onClick={handleDownloadCSV}>
            <FaFileCsv style={{ marginRight: '8px' }} /> Baixar CSV
          </button>
        </div>
      </form>
      {movimentacoes.entradas.length > 0 || movimentacoes.saidas.length > 0 ? (
        <div style={{ marginTop: '30px' }}>
          <h3>Entradas</h3>
          <ul className="report-list">
            {movimentacoes.entradas.map(e => (
              <li key={e.id}>
                {mercadorias[e.mercadoria_id]} - {e.quantidade} unidades - {new Date(e.data_hora).toLocaleString()} - {e.local}
              </li>
            ))}
          </ul>
          <h3>Saídas</h3>
          <ul className="report-list">
            {movimentacoes.saidas.map(s => (
              <li key={s.id}>
                {mercadorias[s.mercadoria_id]} - {s.quantidade} unidades - {new Date(s.data_hora).toLocaleString()} - {s.local}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        mes && <p className="no-data">Nenhuma movimentação encontrada para o mês {mes}/{ano}.</p>
      )}
    </section>
  );
}

export default Relatorio;