import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Main from './components/Main'
import Page01 from './components/Page01'
import Page02 from './components/Page02'
import Page03 from './components/Page03'

const App = () => {
  return (
    <>
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path="/Page01" element={<Page01 />} />
          <Route path="/Page02" element={<Page02 />} />
          <Route path="/Page03" element={<Page03 />} />
        </Routes>
    </>
  )
}

export default App;