import { Box, LinearProgress, Stack } from "@mui/material";
import Branding from "./Branding";

export default function LoadingScreen() {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        backgroundColor: "#fbfaf8",
        display : "flex",
        alignItems: "center",
      }}
    >
      <Stack sx={{
        maxWidth: "400px",
        width:'100%',
        margin: "0 auto",
      }} spacing={8}  >
        <Branding justifyContent="center" />
        <>
        <LinearProgress />
        </>
      </Stack>
    </Box>
  );
}
