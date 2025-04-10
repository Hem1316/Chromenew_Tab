import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'

const container = document.getElementById('twixt_chrome_new')
const root = createRoot(container)
root.render(<App />)
