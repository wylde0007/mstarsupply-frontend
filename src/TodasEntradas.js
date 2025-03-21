import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaArrowDown, FaFilter } from 'react-icons/fa';
import './TableStyles.css';

function TodasEntradas() {
  const [entradas, setEntradas] = useState([]);
  const [mercadorias, setMercadorias] = useState({});
  const [filtroData, setFiltroData] = useState('');

  useEffect(() => {
    // Carrega todas as entradas
    axios.get('http://localhost:8000/api/movimentacoes/1/2000').then(res => {
      setEntradas(res.data.entradas); // Como o backend já filtra por mês/ano, uso 1/2000 pra pegar tudo
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

  const entradasFiltradas = filtroData
    ? entradas.filter(e => new Date(e.data_hora).toLocaleDateString('pt-BR').includes(filtroData))
    : entradas;

  return (
    <section className="table-section">
      <h2>
        <FaArrowDown style={{ marginRight: '8px', color: '#007aff' }} />
        Todas as Entradas
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
          {entradasFiltradas.length > 0 ? (
            entradasFiltradas.map(e => (
              <tr key={e.id}>
                <td>{mercadorias[e.mercadoria_id] || 'Desconhecido'}</td>
                <td>{e.quantidade} unidades</td>
                <td>{new Date(e.data_hora).toLocaleString('pt-BR')}</td>
                <td>{e.local}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Nenhuma entrada encontrada.</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

export default TodasEntradas;