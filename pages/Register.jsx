import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Notyf } from "notyf";
import 'notyf/notyf.min.css';
import axios from 'axios';
function Register(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if(data.get('Username')==''){
        notyf.open({
            type: "error",
            message: "Username is required",
          });
    }else if(data.get('Phone')==''){
        notyf.open({
            type: "error",
            message: "Phone is required",
          });
    }else if(data.get('email')==''){
        notyf.open({
            type: "error",
            message: "Email is required",
          });
    }else{
        axios.post(process.env.REACT_APP_API_URL+'users',{
            name:data.get('Username'),
            email:data.get('email'),
            phone: data.get('Phone')
        }).then((res)=>{
            if(res.data.check==false){
                if(res.data.msg){
                    notyf.open({
                        type: "error",
                        message: res.data.msg,
                      });
                }
            }else if(res.data.check==true){
                localStorage.setItem('id',res.data.data);
                notyf.open({
                    type: "success",
                    message: "Thank you. Let's play",
                  });
                  setTimeout(() => {
                    window.location.replace('/flappy-bird');
                }, 2000);
            }
        })
    }
  };
  const notyf = new Notyf({
    duration: 1000,
    position: {
      x: "right",
      y: "top",
    },
    types: [
      {
        type: "warning",
        background: "orange",
        icon: {
          className: "material-icons",
          tagName: "i",
          text: "warning",
        },
      },
      {
        type: "error",
        background: "indianred",
        duration: 2000,
        dismissible: true,
      },
    ],
  });
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Flappy Bird
          </Typography>
          <Box  component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="Username"
                  required
                  fullWidth
                  id="Username"
                  label="Username"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="Phone"
                  label="Phone"
                  name="Phone"
                  autoComplete="Phone"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}