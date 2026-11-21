import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { CurrencyProvider } from './context/CurrencyContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <CurrencyProvider>
    <App />
  </CurrencyProvider>
)