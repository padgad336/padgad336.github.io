import React from "react";
import { Header } from '../components/Layout'
import {
  Box,
  IconButton,
  Typography
} from "@mui/joy";

//import icon
import { Menu as MenuIcon, FindInPageRounded as FindInPageRoundedIcon } from '@mui/icons-material'

//import  custom
import { ColorSchemeToggle } from "../components/ColorSchemaColor";

export const HeaderContentLayout = () => {
  return (
    <Header>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 1.5,
          flexGrow: 1
        }}
      >
        {/* <IconButton
          variant="outlined"
          size="sm"
          // onClick={() => setDrawerOpen(true)}
          sx={{ display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton> */}
        <IconButton
          size="sm"
          variant="solid"
          // sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          sx={{ display: { sm: 'inline-flex' } }}
        >
          <FindInPageRoundedIcon />
        </IconButton>
        <Typography component="h1" fontWeight="xl" sx={{ flexGrow: 1 }}>
          cluster
        </Typography>
        {/* </Box> */}
        {/* 
    <Input
      size="sm"
      placeholder="Search anything…"
      startDecorator={<SearchRoundedIcon color="primary" />}
      endDecorator={
        <IconButton variant="outlined" size="sm" color="neutral">
          <Typography fontWeight="lg" fontSize="sm" textColor="text.tertiary">
            /
          </Typography>
        </IconButton>
      }
      sx={{
        flexBasis: '500px',
        display: {
          xs: 'none',
          sm: 'flex',
        },
      }}
    />
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5 }}>
      <IconButton
        size="sm"
        variant="outlined"
        color="primary"
        sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
      >
        <SearchRoundedIcon />
      </IconButton>
      <IconButton
        size="sm"
        variant="outlined"
        color="primary"
        component="a"
        href="/blog/first-look-at-joy/"
      >
        <BookRoundedIcon />
      </IconButton>
      <Menu
        id="app-selector"
        control={
          <IconButton
            size="sm"
            variant="outlined"
            color="primary"
            aria-label="Apps"
          >
            <GridViewRoundedIcon />
          </IconButton>
        }
        menus={[
          {
            label: 'Email',
            href: '/joy-ui/getting-started/templates/email/',
          },
          {
            label: 'Team',
            href: '/joy-ui/getting-started/templates/team/',
          },
          {
            label: 'Files',
            active: true,
            href: '/joy-ui/getting-started/templates/files/',
            'aria-current': 'page',
          },
        ]}
      /> */}
        <ColorSchemeToggle />
      </Box>
    </Header>
  )
}
