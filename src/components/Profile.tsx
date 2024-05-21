import * as React from "react";

import {
  Box,
  Avatar,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemContent,
  ListItemDecorator,
  Sheet,
  Typography,
  Breadcrumbs,
  Link,
  Stack,
  Card,
  AspectRatio,
  IconButton,
  FormLabel,
  FormControl,
  Input,
  Select,
  Option,
  Textarea,
  FormHelperText,
  CardContent,
} from "@mui/joy";

import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

export default function MyProfile() {
  const meData = [
    {
      name: "Phairat Kaewkandee",
      position: "Full-Stack Developer ",
      avatar2x: "https://avatars.githubusercontent.com/u/67619755?v=4",
      companyData: [
        {
          role: "Developer",
          name: "Thaidotrun",
          logo: "https://yt3.googleusercontent.com/ytc/AIdro_n1HPgLzBjXqLMh0p3qakdMFJm2mVDfFImrPPqcSnOs7eY=s900-c-k-c0x00ffffff-no-rj",
          years: "2019-2020",
        },
        {
          role: "Senior Developer",
          name: "aheadall co. ltd",
          logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOYoUsMWbqZdGH4A_x1I0nN2DO9j0si9xvNCmlYBQ_8Q&s",
          years: "2020-2021",
        },
        {
          role: "Senior Developer",
          name: "Stream South Technology co. ltd",
          logo: "https://streamsouth.tech/wp-content/uploads/2023/04/ss_logo.png",
          years: "2020-2024",
        },
        {
          role: "Senior Developer",
          name: "A Dot co. ltd",
          logo: "",
          years: "2024-now",
        },
      ],
      skills: ["Javascript", "Flutter", "Django", "React", "Next"],
    },
  ];
  const profileData = {
    firstName: "Phairat",
    lastName: "Kaewkandee",
    aka: "PadGad",
    image: "https://avatars.githubusercontent.com/u/67619755?v=4",
    role: "Full-Stack Developer",
    email: "phairat101039@gmail.com",
    github: "https://github.com/padgad336",
  };
  return (
    <Box sx={{ flex: 1, width: "100%" }}>
      <Box
        sx={{
          position: "sticky",
          top: { sm: -100, md: -110 },
          bgcolor: "background.body",
          zIndex: 9995,
        }}
      >
        <Box sx={{ px: { xs: 2, md: 6 } }}>
          <Breadcrumbs
            size="sm"
            aria-label="breadcrumbs"
            separator={<ChevronRightRoundedIcon />}
            sx={{ pl: 0 }}
          >
            <Link
              underline="none"
              color="neutral"
              href="#some-link"
              aria-label="Home"
            >
              <HomeRoundedIcon />
            </Link>
            <Link
              underline="hover"
              color="neutral"
              href="#some-link"
              fontSize={12}
              fontWeight={500}
            >
              Users
            </Link>
            <Typography color="primary" fontWeight={500} fontSize={12}>
              Me
            </Typography>
          </Breadcrumbs>
          <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
            My profile
          </Typography>
        </Box>
      </Box>
      <Stack
        spacing={4}
        sx={{
          display: "flex",
          maxWidth: "800px",
          mx: "auto",
          px: { xs: 2, md: 6 },
          py: { xs: 2, md: 3 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            position: "relative",
            overflow: { xs: "auto", sm: "initial" },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              display: "block",
              width: "1px",

              left: "500px",
              top: "-24px",
              bottom: "-24px",
              "&::before": {
                top: "4px",
                content: '""',
                display: "block",
                position: "absolute",
                right: "0.5rem",
                color: "text.tertiary",
                fontSize: "sm",
                fontWeight: "lg",
              },
              "&::after": {
                top: "4px",
                content: '""',
                display: "block",
                position: "absolute",
                left: "0.5rem",
                color: "text.tertiary",
                fontSize: "sm",
                fontWeight: "lg",
              },
            }}
          />
          <Card
            sx={{
              width: "100%",
              flexWrap: "wrap",
              [`& > *`]: {
                "--stack-point": "500px",
                minWidth:
                  "clamp(0px, (calc(var(--stack-point) - 2 * var(--Card-padding) - 2 * var(--variant-borderWidth, 0px)) + 1px - 100%) * 999, 100%)",
              },
              // make the card resizable for demo
              overflow: "auto",
              resize: "horizontal",
            }}
          >
            <AspectRatio flex ratio="1" maxHeight={182} sx={{ minWidth: 182 }}>
              <img
                src={`${profileData.image}`}
                srcSet={`${profileData.image} 2x`}
                loading="lazy"
                alt=""
              />
            </AspectRatio>
            <CardContent>
              <Typography fontSize="xl" fontWeight="lg">
                {`${profileData?.firstName} ${profileData?.lastName}`}
              </Typography>
              <Typography
                level="body-sm"
                fontWeight="lg"
                textColor="text.tertiary"
              >
                {profileData?.role}
              </Typography>
              <Sheet
                sx={{
                  bgcolor: "background.level1",
                  borderRadius: "sm",
                  p: 1.5,
                  my: 1.5,
                  display: "flex",
                  gap: 2,
                  "& > div": { flex: 1 },
                }}
              >
                <div>
                  <Typography level="body-xs" fontWeight="lg">
                    Articles
                  </Typography>
                  <Typography fontWeight="lg">34</Typography>
                </div>
                <div>
                  <Typography level="body-xs" fontWeight="lg">
                    Followers
                  </Typography>
                  <Typography fontWeight="lg">980</Typography>
                </div>
                <div>
                  <Typography level="body-xs" fontWeight="lg">
                    Rating
                  </Typography>
                  <Typography fontWeight="lg">8.9</Typography>
                </div>
              </Sheet>
              <Box
                sx={{ display: "flex", gap: 1.5, "& > button": { flex: 1 } }}
              >
                <Button
                  fullWidth
                  component={"a"}
                  href={profileData?.github}
                  variant="outlined"
                  color="primary"
                >
                  Follow
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Card>
          <Box sx={{ mb: 1 }}>
            <Typography level="title-md">Bio</Typography>
          </Box>
          <Divider />
          <Stack spacing={2} sx={{ my: 1 }}>
            <Textarea
              size="sm"
              minRows={4}
              sx={{ mt: 1.5 }}
              disabled
              defaultValue="I'm a Human"
            />
            <FormHelperText sx={{ mt: 0.75, fontSize: "xs" }}>
              Loading ....
            </FormHelperText>
          </Stack>
        </Card>
        <Card>
          <Box sx={{ mb: 1 }}>
            <Typography level="title-md" gutterBottom>
              tech stack :
            </Typography>

            <img src="https://skillicons.dev/icons?i=html,css,mui," />
            <img
              src="https://skillicons.dev/icons?i=js,ts,react,electron,nodejs,nextjs,redis,regex,flutter,django,threejs,php"
              alt="padgad-tech"
            />
            <img
              src="https://skillicons.dev/icons?i=mongodb,postgres,mysql,graphql,apollo,sqlite"
              alt="padgad-tech1"
            />
            <img
              src="https://skillicons.dev/icons?i=py,git,github,gitlab,vscode,linux,postman,babel,docker"
              alt="padgad-tech2"
            />
            <br />
          </Box>
          <Divider />
        </Card>
        <Card>
          <Box sx={{ mb: 1 }}>
            <List
            // sx={{
            //   display: "grid",
            //   gridTemplateColumns: "repeat(auto-fill, minmax(000px, 1fr))",
            //   gap: 2,
            // }}
            >
              {meData.map((person, index) => (
                <Sheet
                  key={index}
                  component="li"
                  variant="outlined"
                  sx={{
                    borderRadius: "sm",
                    p: 2,
                    listStyle: "none",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Avatar
                      variant="outlined"
                      src={person.avatar2x}
                      srcSet={`${person.avatar2x} 2x`}
                      sx={{ borderRadius: "50%" }}
                    />
                    <div>
                      <Typography level="title-md">{person.name}</Typography>
                      <Typography level="body-xs">{person.position}</Typography>
                    </div>
                  </Box>
                  <Divider component="div" sx={{ my: 2 }} />
                  <List sx={{ "--ListItemDecorator-size": "40px", gap: 2 }}>
                    {person.companyData.map((company, companyIndex) => (
                      <ListItem
                        key={companyIndex}
                        sx={{ alignItems: "flex-start" }}
                      >
                        <ListItemDecorator
                          sx={{
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              height: "100%",
                              width: "1px",
                              bgcolor: "divider",
                              left: "calc(var(--ListItem-paddingLeft) + 12px)",
                              top: "50%",
                            },
                          }}
                        >
                          <Avatar
                            src={company.logo}
                            sx={{ "--Avatar-size": "24px" }}
                          />
                        </ListItemDecorator>
                        <ListItemContent>
                          <Typography level="title-sm">
                            {company.role}
                          </Typography>
                          <Typography level="body-xs">
                            {company.name}
                          </Typography>
                        </ListItemContent>
                        <Typography level="body-xs">{company.years}</Typography>
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    size="sm"
                    variant="plain"
                    endDecorator={
                      <KeyboardArrowRightRoundedIcon fontSize="small" />
                    }
                    sx={{ px: 1, mt: 1 }}
                  >
                    Expand
                  </Button>
                  <Divider component="div" sx={{ my: 2 }} />
                  <Typography level="title-sm">Skills tags:</Typography>
                  <Box sx={{ mt: 1.5, display: "flex", gap: 1 }}>
                    {person.skills.map((skill, skillIndex) => (
                      <Chip
                        key={skillIndex}
                        variant="outlined"
                        color="neutral"
                        size="sm"
                      >
                        {skill}
                      </Chip>
                    ))}
                  </Box>
                </Sheet>
              ))}
            </List>
          </Box>
        </Card>
      </Stack>
    </Box>
  );
}
