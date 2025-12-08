import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../features/auth/authSlice';
import { Box, Button, TextField, Paper, Typography, Divider, Link, InputAdornment, IconButton } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Logo from "../../assets/logo_icon_remove.png";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !pw) {
      alert('אנא מלאי את כל השדות');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3001/users/login', {
        email,
        password: pw
      });

      const jwtToken = res.data.token;
      const userData = JSON.parse(atob(jwtToken.split('.')[1]));

      localStorage.setItem('token', jwtToken);
      dispatch(login({ token: jwtToken, user: userData }));

      navigate('/', { replace: true });
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        alert('אימייל או סיסמה לא נכונים');
      } else {
        alert('שגיאה בשרת, נסה שוב מאוחר יותר');
      }
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:3001/users/google-login', {
        token: credentialResponse.credential,
      });

      const jwtToken = res.data.token;
      const userData = res.data.user;

      localStorage.setItem('token', jwtToken);
      dispatch(login({ token: jwtToken, user: userData }));
      navigate('/', { replace: true });

    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 404) {
        alert('משתמש לא רשום במערכת');
      } else {
        alert('שגיאה בשרת, התחברות נכשלה');
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight:'100vh',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        bgcolor:'#ededed',
        p:2
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width:430,
          p:5,
          borderRadius:4,
          backgroundColor:'#fff',
          boxShadow:'0 8px 20px rgba(0,0,0,0.15)'
        }}
      >
       <Box sx={{ display:'flex', justifyContent:'center', mb:3 }}>
  <Box
    sx={{
      width: 80,
      height: 80,
      borderRadius: '50%',
      bgcolor: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <img 
      src={Logo} 
      alt="Logo" 
      style={{ width: '50%', height: '50%', objectFit: 'contain' }} 
    />
  </Box>
</Box>
        <Typography variant="h5" align="center" sx={{ fontWeight:700, mb:1, color:'#000' }}>חברים בוועד</Typography>
        <Typography variant="body2" align="center" sx={{ mb:3, color:'#555' }}>היכנסי כדי להמשיך</Typography>

       

          <Box
            sx={{
              mt:2,
              p:2,
              bgcolor:'#f5f5f5',
              borderRadius:3,
              border:'1px solid #ccc',
              display:'flex',
              justifyContent:'center'
            }}
          >
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => alert("שגיאה בהתחברות")}
              ux_mode="popup"
            />
          </Box>
        {/* )} */}

        <Divider sx={{ mb:3, mt:3, color:'#777' }}>או</Divider>

        <form onSubmit={handleLogin}>
          <TextField
            label="אימייל"
            fullWidth
            value={email}
            onChange={e=>setEmail(e.target.value)}
            sx={{
              mb:2,
              '& .MuiOutlinedInput-root': {
                borderRadius:3,
                '& fieldset': { borderColor:'#999' },
                '&:hover fieldset': { borderColor:'#555' }
              }
            }}
          />

          <TextField
            label="סיסמה"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            value={pw}
            onChange={e=>setPw(e.target.value)}
            sx={{
              mb:3,
              '& .MuiOutlinedInput-root': {
                borderRadius:3,
                '& fieldset': { borderColor:'#999' },
                '&:hover fieldset': { borderColor:'#555' }
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              py:1.5,
              mb:2,
              borderRadius:3,
              backgroundColor:'#565656ff',
              '&:hover': { backgroundColor:'#969595ff' }
            }}
          >
            התחבר
          </Button>
        </form>

        <Box sx={{ mt:3, display:'flex', justifyContent:'space-between' }}>
          <Link
            component={RouterLink}
            to="/forgot"
            sx={{
              fontSize:14,
              color:'#444',
              textDecoration:'none',
              '&:hover': { color:'#000', textDecoration:'underline' }
            }}
          >
            שכחת סיסמה?
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}
