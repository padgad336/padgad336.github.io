import { Grid, Card } from "@mui/joy";

import MyProfile from "../components/Profile";

export const MainContentLayout = () => {
  return (
    // <Main
    //   sx={{ flexGrow: 1, }}
    // >
    <>
      <Grid
        container
        spacing={3}
        sx={{
          flexGrow: 1,
          width: "100vw",
          height: "100vh",
          p: { xs: 5, md: 5 },
        }}
      >
        <Grid xs={12} md={12} sm={12} sx={{ backgroundColor: "tomato" }}>
          <Card sx={{ width: "100%", height: "100%" }}>
            <MyProfile />
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
