import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { TextSizeProvider } from './context/fontGlobal'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <TextSizeProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </TextSizeProvider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
