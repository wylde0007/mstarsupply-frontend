import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaArrowUp, FaFilter } from 'react-icons/fa';
import './TableStyles.css';

function TodasSaidas() {
  const [saidas, setSaidas] = useState([]);
  const [mercadorias, setMercadorias] = useState({});
  const [filtroData, setFiltroData] = useState('');

  useEffect(() => {
    // Carrega todas as saídas
    axios.get('http://localhost:8000/api/movimentacoes/1/2000').then(res => {
      setSaidas(res.data.saidas); // Como o backend já filtra por mês/ano, uso 1/2000 pra pegar tudo
    });

    // Carrega lista de mercadorias
    axios.get('http://localhost:8000/api/mercadorias').then(res => {
      const mercadoriasMap = {};
      res.data.forEach(m => {
        mercadoriasMap[m.id] = m.nome;
      });
      setMercadorias(mercadoriasMap);
    });
  }, []);

  const saidasFiltradas = filtroData
    ? saidas.filter(s => new Date(s.data_hora).toLocaleDateString('pt-BR').includes(filtroData))
    : saidas;

  return (
    <section className="table-section">
      <h2>
        <FaArrowUp style={{ marginRight: '8px', color: '#ff3b30' }} />
        Todas as Saídas
      </h2>
      <div className="filter-section">
        <label>
          <FaFilter style={{ marginRight: '8px' }} />
          Filtrar por Data (dd/mm/aaaa):
        </label>
        <input
          type="text"
          placeholder="Ex.: 20/03/2025"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Mercadoria</th>
            <th>Quantidade</th>
            <th>Data/Hora</th>
            <th>Local</th>
          </tr>
        </thead>
        <tbody>
          {saidasFiltradas.length > 0 ? (
            saidasFiltradas.map(s => (
              <tr key={s.id}>
                <td>{mercadorias[s.mercadoria_id] || 'Desconhecido'}</td>
                <td>{s.quantidade} unidades</td>
                <td>{new Date(s.data_hora).toLocaleString('pt-BR')}</td>
                <td>{s.local}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Nenhuma saída encontrada.</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

export default TodasSaidas;