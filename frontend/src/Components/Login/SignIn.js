import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
  Stack,
  Alert
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../JS/action/authActions";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alertMessage = useSelector((state) => state.auth.Alert);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const loginData = { email, password }; // ✅ Correction ici
    dispatch(login(loginData, navigate));
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f7fc"
      }}
    >
      <Paper
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: 3,
          borderRadius: 3,
          backgroundColor: "white",
          width: "100%",
          maxWidth: 400
        }}
      >
        {alertMessage && (
          <Stack sx={{ width: "100%" }} spacing={2}>
            <Alert variant="filled" severity="success">
              {alertMessage}, vous pouvez vous connecter à votre compte maintenant
            </Alert>
          </Stack>
        )}

        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Connexion
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
            sx={{
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
            }}
          />
          <TextField
            label="Mot de passe"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
            sx={{
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
            }}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#007BFF",
              color: "white",
              "&:hover": {
                backgroundColor: "#0056b3"
              },
              width: "100%",
              marginTop: 2,
              padding: "10px",
              borderRadius: "8px"
            }}
          >
            Se connecter
          </Button>
        </form>

        <Box sx={{ textAlign: "center", marginTop: 2 }}>
          <Typography variant="body2">
            Vous n'avez pas de compte ?{" "}
            <Link to="/signup" style={{ color: "#007BFF", fontWeight: "bold" }}>
              S'inscrire ici
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignIn;
