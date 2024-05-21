import * as React from "react";

// import AspectRatio from '@mui/joy/AspectRatio';
// import Avatar from '@mui/joy/Avatar';
// import AvatarGroup from '@mui/joy/AvatarGroup';
// import Box from '@mui/joy/Box';
// import Button from '@mui/joy/Button';

// import Typography from '@mui/joy/Typography';

// import IconButton from '@mui/joy/IconButton';
// import Divider from '@mui/joy/Divider';
// import Sheet from '@mui/joy/Sheet';

// Icons import

// import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

// custom

import { HeaderContentLayout } from "./layouts/Header";
import { SideNavContentLayout } from "./layouts/SideNav";
import { MainContentLayout } from "./pages/main-layout";
import { RootContentLayout } from "./layouts/Root";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { MapContentLayout } from "./pages/map-layout";

export default function App() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  return (
    <>
      <BrowserRouter>
        <RootContentLayout drawerOpen={drawerOpen}>
          <Routes>
            <Route path="/" element={<MainContentLayout />} />
            <Route path="map" element={<MapContentLayout />} />
          </Routes>
          {/* <HeaderContentLayout /> */}
        </RootContentLayout>
      </BrowserRouter>
    </>
  );
}
