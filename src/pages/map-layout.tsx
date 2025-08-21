import React, { useEffect, useState } from 'react';
import { Card, Grid } from '@mui/joy';
import { MapLayout } from '../components/Map';
import axios from 'axios';
const records = require('../records.json');
export const MapContentLayout = () => {
  const [markers, setMarkers] = useState<any>([]);
  const [place, setPlace] = useState<{
    id?: number | null;
    name?: string;
    type?: string;
    lat?: any;
    long?: any;
  }>();
  const [fetch, setFetch] = React.useState(false);

  const getData = async () => {
    try {
      setMarkers(records);
    } catch (e) {
      setMarkers([]);
    }
  };
  useEffect(() => {
    getData();
    setFetch(false);
  }, [fetch]);
  console.log(markers);

  const handleSubmit = async (e: any) => {
    try {
      const response = await axios.post('http://localhost:7000/api/places/', {
        ...place,
        lat: parseFloat(place?.lat),
        long: parseFloat(place?.long),
      });
      if (response) {
        console.log(response?.data);
        setPlace({
          id: null,
          name: '',
          type: '',
          lat: '',
          long: '',
        });
        setFetch(true);
        alert('success');
      }
    } catch (e) {
      console.error(e);
    }
  };
  console.log(markers);

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
          width: '100vw',
          height: '100vh',
          p: { xs: 5, md: 5 },
        }}
      >
        {/* <Grid xs={12} md={4} sm={12} sx={{ mt: { xs: -5, md: 2 }, height: { xs: '10vh', md: 'none' } }} >
          <Typography sx={{ display: { xs: 'none', md: 'grid' } }}>Number of Places: {markers?.length}</Typography>
          <Card >
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

            />
          </Card>
          <Card sx={{ display: { xs: 'none', md: 'grid' } }}>
            <Grid container>
              <Grid xs={12} md={12}>
                <Typography level='h4'>
                  add Places
                </Typography>

              </Grid>
              <Grid xs={12} md={6}>
                <FormControl
                  id="id"
                  required
                  size="sm"
                  color="primary">
                  <FormLabel>
                    id
                  </FormLabel>
                  <Input
                    placeholder="id"
                    name="id"
                    type="number"
                    autoComplete="on"
                    autoFocus
                    fullWidth
                    value={place?.id !== null ? place?.id : 0}
                    onChange={(e) => {
                      const regex = /^[0-9\b]+$/;
                      if (e.target.value === "" || regex.test(e.target.value)) {
                        setPlace({
                          ...place,
                          id: parseInt(e.target.value)
                        })
                      }

                    }}
                    variant="outlined" />
                </FormControl>
              </Grid>
              <Grid xs={12} md={6}>
                <FormControl
                  id="name"
                  required
                  size="sm"
                  color="primary">
                  <FormLabel>
                    name
                  </FormLabel>
                  <Input
                    placeholder="name"
                    name="name"
                    autoComplete="on"
                    autoFocus
                    fullWidth
                    value={place?.name}
                    onChange={(e) => {
                      setPlace({
                        ...place,
                        name: e.target.value
                      })

                    }}
                    variant="outlined" />
                </FormControl>
              </Grid>
              <Grid xs={12} md={6}>
                <FormControl
                  id="type"
                  required
                  size="sm"
                  color="primary">
                  <FormLabel>
                    type
                  </FormLabel>
                  <Input
                    placeholder="type"
                    name="type"
                    autoComplete="on"
                    autoFocus
                    fullWidth
                    value={place?.type}
                    onChange={(e) => {
                      setPlace({
                        ...place,
                        type: e.target.value
                      })
                    }}
                    variant="outlined" />
                </FormControl>
              </Grid>
              <Grid xs={12} md={12}>
                <FormControl
                  id="lat"
                  required
                  size="sm"
                  color="primary">
                  <FormLabel>
                    lat
                  </FormLabel>
                  <Input
                    placeholder="lat"
                    name="lat"
                    autoComplete="on"
                    autoFocus
                    fullWidth
                    value={place?.lat}
                    onChange={(e) => {

                      setPlace({
                        ...place,
                        lat: e.target.value
                      })


                    }}
                    variant="outlined" />
                </FormControl>
              </Grid>
              <Grid xs={12} md={12}>
                <FormControl
                  id="long"
                  required
                  size="sm"
                  color="primary">
                  <FormLabel>
                    long
                  </FormLabel>
                  <Input
                    placeholder="long"
                    name="long"
                    autoComplete="on"
                    autoFocus
                    fullWidth
                    value={place?.long}
                    onChange={(e) => {

                      setPlace({
                        ...place,
                        long: e.target.value
                      })


                    }}
                    variant="outlined" />
                </FormControl>
              </Grid>
              <Grid xs={12} md={6}>
                <Button
                  fullWidth
                  onClick={handleSubmit}
                >
                  Submit
                </Button>

              </Grid>
            </Grid>
          </Card>
        </Grid> */}
        <Grid xs={12} md={12} sm={12} sx={{ backgroundColor: 'purple' }}>
          <Card sx={{ width: '100%', height: '100%' }}>
            <MapLayout markers={markers} />
          </Card>
        </Grid>
      </Grid>
    </>
    // </Main>
  );
};
