 import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Grid,
  Typography,
  Box,
  InputAdornment,
  Checkbox
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { register } from "../../JS/action/authActions";
const SignUp = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    adresse: "",
    birthDate: "",
    role: "client" // Initialisation à "off"
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, role: e.target.checked ? "seller" : "client" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = {};

    if (!formData.firstname) formErrors.firstname = "Le prénom est requis";
    if (!formData.lastName) formErrors.lastName = "Le nom est requis";
    if (!formData.email) formErrors.email = "L'email est requis";
    if (!formData.password) formErrors.password = "Le mot de passe est requis";
    if (!formData.phone) formErrors.phone = "Le numéro de téléphone est requis";
    if (!formData.adresse) formErrors.adresse = "L'adresse est requise";
    if (!formData.birthDate)
      formErrors.birthDate = "La date de naissance est requise";

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      // Vous pouvez envoyer les données au backend ici
      console.log("Données utilisateur:", formData);
      dispatch(register(formData, navigate));
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 8
        }}
      >
        <Typography component="h1" variant="h5">
          Créer un compte
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstname"
                label="Prénom"
                fullWidth
                value={formData.firstname}
                onChange={handleChange}
                error={!!errors.firstname}
                helperText={errors.firstname}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastName"
                label="Nom"
                fullWidth
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="phone"
                label="Numéro de téléphone"
                type="tel"
                fullWidth
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">+216</InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="adresse"
                label="Adresse"
                fullWidth
                value={formData.adresse}
                onChange={handleChange}
                error={!!errors.adresse}
                helperText={errors.adresse}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="birthDate"
                label="Date de naissance"
                type="date"
                fullWidth
                value={formData.birthDate}
                onChange={handleChange}
                error={!!errors.birthDate}
                helperText={errors.birthDate}
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                label="Mot de passe"
                type="password"
                fullWidth
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Checkbox
                color="primary"
                name="role"
                checked={formData.role === "seller"}
                onChange={handleCheckboxChange}
              />
              Etes-vous vendeur ?
              {errors.role && (
                <Typography variant="body2" color="error" align="left">
                  {errors.role}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                S'inscrire
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography align="center">
                Déjà un compte ? <a href="/signin">Se connecter</a>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
