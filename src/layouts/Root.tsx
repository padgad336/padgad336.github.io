import * as React  from 'react';
import { Root } from '../components/Layout';

type RootContentLayoutProps ={
    drawerOpen:boolean,
    children?: React.ReactNode;
   
}

export const RootContentLayout:React.FunctionComponent<RootContentLayoutProps>=({children,drawerOpen})=>{
    return (
        <Root
        sx={{
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'minmax(64px, 200px) minmax(450px, 1fr)',
              md: 'minmax(160px, 300px) minmax(600px, 1fr) minmax(300px, 420px)',
            },
            ...(drawerOpen && {
              height: '100vh',
              overflow: 'hidden',
            }),
          }}
        >
          {children}
        </Root>
    )
}
