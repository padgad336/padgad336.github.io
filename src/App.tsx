import * as React from 'react';

import { MainContentLayout } from './pages/main-layout';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { MapContentLayout } from './pages/map-layout';

export default function App() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainContentLayout />} />
          {/* <Route path='map' element={<MapContentLayout />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}
