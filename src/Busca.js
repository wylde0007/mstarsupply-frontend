import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import './TableStyles.css';

function Busca() {
  const [termo, setTermo] = useState('');
  const [tipo, setTipo] = useState('mercadorias');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!termo) {
      setResultados([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/busca`, {
        params: { q: termo, tipo }
      });
      setResultados(res.data);
    } catch (error) {
      console.error('Erro ao buscar:', error);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [tipo, termo]);

  return (
    <section className="table-section">
      <h2>
        <FaSearch style={{ marginRight: '8px', color: '#007aff' }} />
        Busca
      </h2>
      <div className="filter-section">
        <label>Tipo de Busca:</label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="mercadorias">Mercadorias</option>
          <option value="entradas">Entradas</option>
          <option value="saidas">Saídas</option>
        </select>
        <input
          type="text"
          placeholder="Digite o termo de busca (nome, data, local)"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table>
          <thead>
            {tipo === 'mercadorias' ? (
              <tr>
                <th>Nome</th>
                <th>Quantidade</th>
              </tr>
            ) : (
              <tr>
                <th>Mercadoria</th>
                <th>Quantidade</th>
                <th>Data/Hora</th>
                <th>Local</th>
              </tr>
            )}
          </thead>
          <tbody>
            {resultados.length > 0 ? (
              resultados.map(r => (
                tipo === 'mercadorias' ? (
                  <tr key={r.id}>
                    <td>{r.nome}</td>
                    <td>{r.quantidade} unidades</td>
                  </tr>
                ) : (
                  <tr key={r.id}>
                    <td>{r.mercadoria}</td>
                    <td>{r.quantidade} unidades</td>
                    <td>{new Date(r.data_hora).toLocaleString('pt-BR')}</td>
                    <td>{r.local}</td>
                  </tr>
                )
              ))
            ) : (
              <tr>
                <td colSpan={tipo === 'mercadorias' ? 2 : 4}>
                  Nenhum resultado encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default Busca;