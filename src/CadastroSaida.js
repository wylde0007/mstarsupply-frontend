import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaArrowUp } from 'react-icons/fa';
import './FormStyles.css';

function CadastroSaida() {
  const [mercadorias, setMercadorias] = useState([]);
  const [formData, setFormData] = useState({
    mercadoria_id: '', quantidade: '', data_hora: '', local: ''
  });
  const [disponibilidade, setDisponibilidade] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8000/api/mercadorias').then(res => setMercadorias(res.data));
  }, []);

  const verificarDisponibilidade = async (mercadoriaId) => {
    if (mercadoriaId) {
      const res = await axios.get(`http://localhost:8000/api/mercadorias/${mercadoriaId}/disponibilidade`);
      setDisponibilidade(res.data.disponibilidade);
    } else {
      setDisponibilidade(null);
    }
  };

  const validar = () => {
    let erros = {};
    if (!formData.mercadoria_id) erros.mercadoria_id = "Selecione uma mercadoria";
    if (!formData.quantidade || formData.quantidade <= 0) erros.quantidade = "Quantidade inválida";
    if (disponibilidade !== null && formData.quantidade > disponibilidade) erros.quantidade = "Quantidade excede o estoque disponível";
    if (!formData.data_hora) erros.data_hora = "Data e hora obrigatórias";
    else {
      const dataSelecionada = new Date(formData.data_hora);
      const agora = new Date();
      if (dataSelecionada > agora) erros.data_hora = "Data não pode ser futura";
    }
    if (!formData.local) erros.local = "Local obrigatório";
    setErrors(erros);
    return Object.keys(erros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validar()) {
      try {
        await axios.post('http://localhost:8000/api/saidas', {
          ...formData,
          data_hora: new Date(formData.data_hora).toISOString().replace('T', ' ').slice(0, 19)
        });
        alert("Saída registrada!");
        setFormData({ mercadoria_id: '', quantidade: '', data_hora: '', local: '' });
        setDisponibilidade(null);
        setErrors({});
      } catch (error) {
        alert("Erro ao registrar saída: " + (error.response?.data?.error || error.message));
      }
    }
  };

  return (
    <section className="form-section">
      <h2>Registrar Saída</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div>
          <label>Mercadoria</label>
          <select
            value={formData.mercadoria_id}
            onChange={(e) => {
              setFormData({ ...formData, mercadoria_id: e.target.value });
              verificarDisponibilidade(e.target.value);
            }}
          >
            <option value="">Selecione uma mercadoria</option>
            {mercadorias.map(m => (
              <option key={m.id} value={m.id}>{m.nome}</option>
            ))}
          </select>
          {errors.mercadoria_id && <span>{errors.mercadoria_id}</span>}
        </div>
        {disponibilidade !== null && (
          <div>
            <label>Disponibilidade Atual</label>
            <p>{disponibilidade} unidades</p>
          </div>
        )}
        <div>
          <label>Quantidade</label>
          <input
            type="number"
            placeholder="Digite a quantidade"
            value={formData.quantidade}
            onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
            min="1"
          />
          {errors.quantidade && <span>{errors.quantidade}</span>}
        </div>
        <div>
          <label>Data e Hora</label>
          <input
            type="datetime-local"
            value={formData.data_hora}
            onChange={(e) => setFormData({ ...formData, data_hora: e.target.value })}
            max={new Date().toISOString().slice(0, 16)}
          />
          {errors.data_hora && <span>{errors.data_hora}</span>}
        </div>
        <div>
          <label>Local</label>
          <input
            placeholder="Digite o local"
            value={formData.local}
            onChange={(e) => setFormData({ ...formData, local: e.target.value })}
          />
          {errors.local && <span>{errors.local}</span>}
        </div>
        <button type="submit">
          <FaArrowUp style={{ marginRight: '8px' }} /> Registrar Saída
        </button>
      </form>
    </section>
  );
}

export default CadastroSaida;