import * as React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/home-page';
import { MainContentLayout } from './pages/main-layout';
import { MapContentLayout } from './pages/map-layout';
import { SipAnalyzerLayout } from './pages/sip-layout';
import { HarToSipLayout } from './pages/har-to-sip-layout';
import { TreeContentLayout } from './pages/tree-layout';
import { ToolsLayout } from './pages/tools-layout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path='resume' element={<MainContentLayout />} />
          <Route path='map' element={<MapContentLayout />} />
          <Route path='sip' element={<SipAnalyzerLayout />} />
          <Route path='har-to-sip' element={<HarToSipLayout />} />
          <Route path='tree' element={<TreeContentLayout />} />
          <Route path='tools' element={<ToolsLayout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
