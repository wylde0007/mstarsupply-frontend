import React, { useState } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import './FormStyles.css';

function CadastroMercadoria() {
  const [formData, setFormData] = useState({
    nome: '',
    numero_registro: '',
    fabricante: '',
    tipo: '',
    descricao: '',
    custo_unitario: '', // Armazena o valor numérico puro
  });
  const [inputValue, setInputValue] = useState(''); // Estado pra controlar o valor exibido no input
  const [errors, setErrors] = useState({});

  // Função pra formatar o valor como moeda brasileira (R$)
  const formatarMoeda = (valor) => {
    if (!valor && valor !== 0) return '';
    const numero = Number(valor);
    if (isNaN(numero)) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numero);
  };

  // Função pra remover a formatação e converter pra número
  const parseMoeda = (valor) => {
    if (!valor) return '';
    // Remove tudo que não é número, vírgula ou ponto
    const apenasNumeros = valor
      .replace(/[^\d.,-]/g, '') // Remove tudo exceto números, vírgula, ponto e sinal de menos
      .replace(/\./g, '') // Remove pontos (separador de milhares)
      .replace(',', '.'); // Substitui vírgula por ponto (pra ser um número válido em JS)
    const numero = parseFloat(apenasNumeros);
    return isNaN(numero) ? '' : numero;
  };

  const validar = () => {
    let erros = {};
    if (!formData.nome) erros.nome = "Nome é obrigatório";
    if (!formData.numero_registro) erros.numero_registro = "Número é obrigatório";
    if (!formData.fabricante) erros.fabricante = "Fabricante é obrigatório";
    if (!formData.tipo) erros.tipo = "Tipo é obrigatório";
    if (formData.custo_unitario === '' || formData.custo_unitario === null) {
      erros.custo_unitario = "Custo unitário é obrigatório";
    } else if (isNaN(formData.custo_unitario) || Number(formData.custo_unitario) <= 0) {
      erros.custo_unitario = "Custo unitário deve ser um número maior que 0";
    }
    setErrors(erros);
    return Object.keys(erros).length === 0;
  };

  const handleCustoChange = (e) => {
    const valor = e.target.value;
    setInputValue(valor); // Atualiza o valor exibido no input enquanto o usuário digita
    const valorNumerico = parseMoeda(valor);
    setFormData({ ...formData, custo_unitario: valorNumerico }); // Armazena o valor numérico no formData
  };

  const handleCustoBlur = () => {
    if (formData.custo_unitario !== '' && !isNaN(formData.custo_unitario)) {
      setInputValue(formatarMoeda(formData.custo_unitario)); // Formata o valor como moeda quando o input perde o foco
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validar()) {
      try {
        await axios.post('http://localhost:8000/api/mercadorias', {
          ...formData,
          custo_unitario: Number(formData.custo_unitario), // Garante que o valor seja enviado como número
        });
        alert("Mercadoria cadastrada!");
        setFormData({
          nome: '',
          numero_registro: '',
          fabricante: '',
          tipo: '',
          descricao: '',
          custo_unitario: '',
        });
        setInputValue(''); // Reseta o valor exibido no input
        setErrors({});
      } catch (error) {
        alert("Erro ao cadastrar mercadoria: " + error.message);
      }
    }
  };

  return (
    <section className="form-section">
      <h2>Cadastrar Mercadoria</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div>
          <label>Nome</label>
          <input
            placeholder="Digite o nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          />
          {errors.nome && <span>{errors.nome}</span>}
        </div>
        <div>
          <label>Número de Registro</label>
          <input
            placeholder="Digite o número de registro"
            value={formData.numero_registro}
            onChange={(e) => setFormData({ ...formData, numero_registro: e.target.value })}
          />
          {errors.numero_registro && <span>{errors.numero_registro}</span>}
        </div>
        <div>
          <label>Fabricante</label>
          <input
            placeholder="Digite o fabricante"
            value={formData.fabricante}
            onChange={(e) => setFormData({ ...formData, fabricante: e.target.value })}
          />
          {errors.fabricante && <span>{errors.fabricante}</span>}
        </div>
        <div>
          <label>Tipo</label>
          <input
            placeholder="Digite o tipo"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
          />
          {errors.tipo && <span>{errors.tipo}</span>}
        </div>
        <div>
          <label>Descrição</label>
          <textarea
            placeholder="Digite a descrição"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          />
        </div>
        <div>
          <label>Custo Unitário (R$)</label>
          <input
            type="text"
            placeholder="Digite o custo unitário"
            value={inputValue} // Usa o inputValue pra exibir o valor
            onChange={handleCustoChange} // Atualiza enquanto o usuário digita
            onBlur={handleCustoBlur} // Formata o valor quando o input perde o foco
          />
          {errors.custo_unitario && <span>{errors.custo_unitario}</span>}
        </div>
        <button type="submit">
          <FaPlus style={{ marginRight: '8px' }} /> Cadastrar
        </button>
      </form>
    </section>
  );
}

export default CadastroMercadoria;