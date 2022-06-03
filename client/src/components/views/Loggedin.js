import { Button, Typography, Container, Box } from "@mui/material"
import { useTheme } from "@mui/material/styles"
//import styled from "styled-components";
import Logo from "../Logo"

//////////////////////////////////////

const Loggedin = ({ setAuth }) => {
  const theme = useTheme()

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Box sx={{ mb: 5, mt: -10 }}>
        <Logo />
      </Box>
      <Typography
        sx={{
          textAlign: "center",
          marginTop: "-4rem",
          fontSize: "5rem",
          fontWeight: 700,
          letterSpacing: "-0.5rem",
          display: "inline-block",
          whiteSpace: "nowrap",
          [theme.breakpoints.down("sm")]: {
            fontSize: "4rem",
            letterSpacing: "-0.4rem",
          },
        }}
        gutterBottom
      >
        Välkommen tillbaka
      </Typography>

      <Button size="large" variant="contained" onClick={() => setAuth(false)}>
        Logga Ut.
      </Button>
    </Container>
  )
}

export default Loggedin
