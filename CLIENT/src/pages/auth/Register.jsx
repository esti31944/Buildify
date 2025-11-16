import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Paper, Typography, Divider } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import GoogleIcon from '@mui/icons-material/Google';
import axios from 'axios';

export default function Register() {
  const [name, setName] = useState('');
  const [apartment, setApartment] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5173/users/register', { fullName: name, apartment, email, password: pw });
      alert('הרשמה הצליחה!');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('הרשמה נכשלה');
    }
  };

  const handleGoogleRegisterSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:5173/users/google-login", {
        token: credentialResponse.credential,
      });
      localStorage.setItem("token", res.data.token);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert("התחברות נכשלה");
    }
  };

  const handleGoogleRegisterError = () => {
    alert("שגיאה בהתחברות עם גוגל");
  };

  return (
    <Box sx={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', bgcolor:'#f9f9f9', p:2 }}>
      <Paper elevation={8} sx={{ width:430, p:5, borderRadius:4, boxShadow:'0 8px 20px rgba(0,0,0,0.15)' }}>
        <Box sx={{ display:'flex', justifyContent:'center', mb:3 }}>
          <Box sx={{ width:80, height:80, borderRadius:'50%', bgcolor:'#000', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Typography variant="h5" color="white" sx={{ fontWeight:700 }}>C</Typography>
          </Box>
        </Box>

        <Typography variant="h5" align="center" sx={{ fontWeight:700, mb:1 }}>הרשמה</Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb:3 }}>צור חשבון חדש או התחבר עם Google</Typography>

        <GoogleLogin
          onSuccess={handleGoogleRegisterSuccess}
          onError={handleGoogleRegisterError}
          useOneTap
          render={renderProps => (
            <Button
              variant="outlined"
              fullWidth
              startIcon={<GoogleIcon />}
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              sx={{ py:1.5, mb:3, textTransform:'none', borderColor:'#000', color:'#000', '&:hover': { borderColor:'#333' } }}
            >
              התחבר/י עם Google
            </Button>
          )}
        />

        <Divider sx={{ mb:3 }}>או</Divider>

        <form onSubmit={handleRegister}>
          <TextField label="שם מלא" fullWidth value={name} onChange={e=>setName(e.target.value)} sx={{ mb:2, '& .MuiOutlinedInput-root': { borderRadius:3 } }} />
          <TextField label="דירה" fullWidth value={apartment} onChange={e=>setApartment(e.target.value)} sx={{ mb:2, '& .MuiOutlinedInput-root': { borderRadius:3 } }} />
          <TextField label="אימייל" fullWidth value={email} onChange={e=>setEmail(e.target.value)} sx={{ mb:2, '& .MuiOutlinedInput-root': { borderRadius:3 } }} />
          <TextField label="סיסמה" type="password" fullWidth value={pw} onChange={e=>setPw(e.target.value)} sx={{ mb:3, '& .MuiOutlinedInput-root': { borderRadius:3 } }} />

          <Button type="submit" variant="contained" fullWidth sx={{ py:1.5, mb:2, borderRadius:3, backgroundColor:'#000', '&:hover': { backgroundColor:'#333' } }}>
            שלח בקשה
          </Button>
          <Button variant="text" fullWidth onClick={()=>navigate('/login')} sx={{ py:1.5, textTransform:'none' }}>
            חזור
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
