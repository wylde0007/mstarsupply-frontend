import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { FaHome, FaBox, FaArrowDown, FaArrowUp, FaChartBar, FaFileAlt, FaMoon, FaSun, FaSearch } from 'react-icons/fa';
import './App.css';
import CadastroMercadoria from './CadastroMercadoria';
import CadastroEntrada from './CadastroEntrada';
import CadastroSaida from './CadastroSaida';
import Grafico from './Grafico';
import Relatorio from './Relatorio';
import Dashboard from './Dashboard';
import TodasEntradas from './TodasEntradas';
import TodasSaidas from './TodasSaidas';
import Busca from './Busca';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Router>
      <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
        <header className="app-header">
          <nav className="app-nav">
            <div className="nav-center">
              <Link to="/">
                <FaHome className="nav-icon" /> Dashboard
              </Link>
              <Link to="/mercadoria">
                <FaBox className="nav-icon" /> Cadastrar Mercadoria
              </Link>
              <Link to="/entrada">
                <FaArrowDown className="nav-icon" /> Registrar Entrada
              </Link>
              <Link to="/saida">
                <FaArrowUp className="nav-icon" /> Registrar Saída
              </Link>
              <Link to="/grafico">
                <FaChartBar className="nav-icon" /> Gráfico
              </Link>
              <Link to="/relatorio">
                <FaFileAlt className="nav-icon" /> Relatório
              </Link>
            </div>
            <div className="nav-right">
              <Link to="/search">
                <FaSearch className="nav-icon-right" />
              </Link>
              <button
                className="theme-toggle"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>
            </div>
          </nav>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/mercadoria" element={<CadastroMercadoria />} />
            <Route path="/entrada" element={<CadastroEntrada />} />
            <Route path="/saida" element={<CadastroSaida />} />
            <Route path="/grafico" element={<Grafico />} />
            <Route path="/relatorio" element={<Relatorio />} />
            <Route path="/search" element={<Busca />} />
            <Route path="/entradas" element={<TodasEntradas />} />
            <Route path="/saidas" element={<TodasSaidas />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;