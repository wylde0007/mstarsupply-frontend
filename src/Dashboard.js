import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FaBox, FaArrowDown, FaArrowUp, FaEye, FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Dashboard.css';

// Registra os componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    total_mercadorias: 0,
    entradas_recentes: [],
    saidas_recentes: [],
  });
  const [mercadorias, setMercadorias] = useState({});
  const [movimentacoesUltimosDias, setMovimentacoesUltimosDias] = useState({ entradas: [], saidas: [], labels: [] });
  const [resumoMensal, setResumoMensal] = useState({ entradas: 0, saidas: 0 });
  const [disponibilidade, setDisponibilidade] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark-mode'));

  useEffect(() => {
    // Carrega dados do dashboard
    axios.get('http://localhost:8000/api/dashboard').then(res => {
      setDashboardData(res.data);
    });

    // Carrega lista de mercadorias
    axios.get('http://localhost:8000/api/mercadorias').then(res => {
      const mercadoriasMap = {};
      res.data.forEach(m => {
        mercadoriasMap[m.id] = m.nome;
      });
      setMercadorias(mercadoriasMap);
    });

    // Carrega movimentações dos últimos 7 dias pra o gráfico
    const hoje = new Date();
    const mes = hoje.getMonth() + 1; // Mês atual (1-12)
    const ano = hoje.getFullYear();
    axios.get(`http://localhost:8000/api/movimentacoes/${mes}/${ano}`).then(res => {
      const { entradas, saidas } = res.data;

      // Filtra movimentações dos últimos 7 dias
      const seteDiasAtras = new Date(hoje);
      seteDiasAtras.setDate(hoje.getDate() - 7);

      const entradasFiltradas = entradas.filter(e => new Date(e.data_hora) >= seteDiasAtras);
      const saidasFiltradas = saidas.filter(s => new Date(s.data_hora) >= seteDiasAtras);

      // Agrupa por dia
      const entradasPorDia = Array(7).fill(0);
      const saidasPorDia = Array(7).fill(0);
      const labels = [];

      for (let i = 6; i >= 0; i--) {
        const dia = new Date(hoje);
        dia.setDate(hoje.getDate() - i);
        labels.push(dia.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));

        const entradasDoDia = entradasFiltradas.filter(e => {
          const data = new Date(e.data_hora);
          return data.toLocaleDateString('pt-BR') === dia.toLocaleDateString('pt-BR');
        });
        const saidasDoDia = saidasFiltradas.filter(s => {
          const data = new Date(s.data_hora);
          return data.toLocaleDateString('pt-BR') === dia.toLocaleDateString('pt-BR');
        });

        entradasPorDia[6 - i] = entradasDoDia.reduce((sum, e) => sum + e.quantidade, 0);
        saidasPorDia[6 - i] = saidasDoDia.reduce((sum, s) => sum + s.quantidade, 0);
      }

      setMovimentacoesUltimosDias({ entradas: entradasPorDia, saidas: saidasPorDia, labels });

      // Calcula resumo mensal
      const totalEntradas = entradas.reduce((sum, e) => sum + e.quantidade, 0);
      const totalSaidas = saidas.reduce((sum, s) => sum + s.quantidade, 0);
      setResumoMensal({ entradas: totalEntradas, saidas: totalSaidas });
    });

    // Carrega disponibilidade detalhada
    axios.get('http://localhost:8000/api/disponibilidade').then(res => {
      setDisponibilidade(res.data);
    });

    // Listener pra detectar mudança de tema
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark-mode'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // Dados do gráfico
  const chartData = {
    labels: movimentacoesUltimosDias.labels || [],
    datasets: [
      {
        label: 'Entradas',
        data: movimentacoesUltimosDias.entradas || [],
        borderColor: '#007aff',
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Saídas',
        data: movimentacoesUltimosDias.saidas || [],
        borderColor: '#ff3b30',
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Permite ajustar a proporção do gráfico
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: 'Inter',
          },
          color: isDarkMode ? '#ffffff' : '#1d1d1f', // Cor das legendas
          boxWidth: 20,
          padding: 10,
        },
      },
      title: {
        display: true,
        text: 'Movimentações (Últimos 7 Dias)',
        font: {
          size: 18,
          family: 'Inter',
          weight: '600',
        },
        color: isDarkMode ? '#ffffff' : '#1d1d1f', // Cor do título
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? '#d2d2d7' : '#6e6e73',
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: isDarkMode ? '#d2d2d7' : '#6e6e73',
        },
        grid: {
          color: isDarkMode ? '#3a3a3c' : '#e5e5ea',
        },
      },
    },
  };

  return (
    <section className="dashboard-section">
      <h2>Dashboard</h2>
      <div className="dashboard-cards">
        <div className="card">
          <FaBox className="card-icon" />
          <h3>{dashboardData.total_mercadorias}</h3>
          <p>Total de Mercadorias</p>
        </div>
        <div className="card">
          <FaArrowDown className="card-icon" style={{ color: '#007aff' }} />
          <h3>{resumoMensal.entradas}</h3>
          <p>Entradas (Mês Atual)</p>
        </div>
        <div className="card">
          <FaArrowUp className="card-icon" style={{ color: '#ff3b30' }} />
          <h3>{resumoMensal.saidas}</h3>
          <p>Saídas (Mês Atual)</p>
        </div>
      </div>

      <div className="dashboard-chart">
        <div style={{ height: '300px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="dashboard-lists">
        <div className="list-section">
          <h3>
            <FaArrowDown style={{ marginRight: '8px', color: '#007aff' }} />
            Entradas Recentes
          </h3>
          <ul>
            {dashboardData.entradas_recentes.map((e, index) => (
              <li key={index}>
                <span>{mercadorias[e.mercadoria_id] || 'Desconhecido'}</span>
                <span>{e.quantidade} unidades</span>
                <span>{new Date(e.data_hora).toLocaleString('pt-BR')}</span>
              </li>
            ))}
          </ul>
          <Link to="/entradas" className="view-more">
            <FaEye style={{ marginRight: '8px' }} /> Ver Todas as Entradas
          </Link>
        </div>

        <div className="list-section">
          <h3>
            <FaArrowUp style={{ marginRight: '8px', color: '#ff3b30' }} />
            Saídas Recentes
          </h3>
          <ul>
            {dashboardData.saidas_recentes.map((s, index) => (
              <li key={index}>
                <span>{mercadorias[s.mercadoria_id] || 'Desconhecido'}</span>
                <span>{s.quantidade} unidades</span>
                <span>{new Date(s.data_hora).toLocaleString('pt-BR')}</span>
              </li>
            ))}
          </ul>
          <Link to="/saidas" className="view-more">
            <FaEye style={{ marginRight: '8px' }} /> Ver Todas as Saídas
          </Link>
        </div>
      </div>

      <div className="list-section">
        <h3>Disponibilidade de Mercadorias</h3>
        <ul>
          {disponibilidade.length > 0 ? (
            disponibilidade.map((item, index) => (
              <li key={index}>
                <span>{item.nome}</span>
                <span>{item.disponibilidade} unidades</span>
                <span>
                  {item.alerta === "Estoque Baixo" ? (
                    <span style={{ color: '#ff3b30', display: 'flex', alignItems: 'center' }}>
                      <FaExclamationTriangle style={{ marginRight: '5px' }} />
                      Estoque Baixo
                    </span>
                  ) : (
                    "Normal"
                  )}
                </span>
              </li>
            ))
          ) : (
            <li>Nenhuma mercadoria encontrada.</li>
          )}
        </ul>
      </div>
    </section>
  );
}

export default Dashboard;