import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import { Layout } from './components/Layout';
import { Executions } from './components/Executions';
import { WebRecords } from './components/records/WebRecords';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/crawler/" element={<Layout />}>
          <Route index element={<WebRecords />} />
          <Route path="exec" element={<Executions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
