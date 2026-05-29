import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './lib/i18n.js'

// Apply saved theme before first render to avoid flash
const savedTheme = localStorage.getItem('hl_theme');
if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
}

// Apply RTL for Arabic
const savedLang = localStorage.getItem('hl_language');
if (savedLang === 'ar') {
  document.documentElement.setAttribute('dir', 'rtl');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
