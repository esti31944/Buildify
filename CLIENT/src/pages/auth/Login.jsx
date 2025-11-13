import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../features/auth/authSlice';
import { Box, Button, TextField, Paper, Typography, Divider, Link } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');

  // -------------------------------
  // Demo Login
  // -------------------------------
  const handleDemo = (e) => {
    e.preventDefault();
    const demoUser = { fullName: email || 'משתמש דמו', email, role: 'tenant' };
    const token = 'demo.' + btoa(JSON.stringify(demoUser)) + '.sig';
    dispatch(login({ token, user: demoUser }));
    localStorage.setItem('token', token);
    navigate('/', { replace: true });
  };

  // -------------------------------
  // Google OAuth Login
  // -------------------------------
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      // שולח את הטוקן של Google לשרת שלך (לשרת backend אמיתי)
      const res = await axios.post('http://localhost:3001/users/google-login', {
        token: credentialResponse.credential,
      });

      const jwtToken = res.data.token;
      const userData = JSON.parse(atob(jwtToken.split('.')[1]));

      localStorage.setItem('token', jwtToken);
      dispatch(login({ token: jwtToken, user: userData }));
      navigate('/', { replace: true });
    } catch (err) {
      console.error(err);
      alert('התחברות נכשלה');
    }
  };

  const handleGoogleLoginError = () => {
    alert('שגיאה בהתחברות עם גוגל');
  };

  return (
    <Box sx={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', bgcolor:'#f9f9f9', p:2 }}>
      <Paper elevation={8} sx={{ width:430, p:5, borderRadius:4, boxShadow:'0 8px 20px rgba(0,0,0,0.15)' }}>
        <Box sx={{ display:'flex', justifyContent:'center', mb:3 }}>
          <Box sx={{ width:80, height:80, borderRadius:'50%', bgcolor:'#000', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Typography variant="h5" color="white" sx={{ fontWeight:700 }}>C</Typography>
          </Box>
        </Box>

        <Typography variant="h5" align="center" sx={{ fontWeight:700, mb:1 }}>חברים בוועד</Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb:3 }}>היכנסי כדי להמשיך</Typography>

        {/* Google Login */}
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginError}
          clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
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

        {/* Demo Login */}
        <form onSubmit={handleDemo}>
          <TextField 
            label="אימייל" 
            fullWidth 
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            sx={{ mb:2, '& .MuiOutlinedInput-root': { borderRadius:3 } }}
          />
          <TextField 
            label="סיסמה" 
            type="password" 
            fullWidth 
            value={pw} 
            onChange={e=>setPw(e.target.value)} 
            sx={{ mb:3, '& .MuiOutlinedInput-root': { borderRadius:3 } }}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ py:1.5, mb:2, borderRadius:3, backgroundColor:'#000', '&:hover': { backgroundColor:'#333' } }}>
            התחבר
          </Button>
          <Button variant="text" fullWidth component={RouterLink} to="/register" sx={{ py:1.5, textTransform:'none' }}>
            הרשם
          </Button>
        </form>

        <Box sx={{ mt:3, display:'flex', justifyContent:'space-between' }}>
          <Link component={RouterLink} to="/forgot" sx={{ fontSize:14 }}>שכחת סיסמה?</Link>
          <Link component={RouterLink} to="/register" sx={{ fontSize:14 }}>צריך חשבון?</Link>
        </Box>
      </Paper>
    </Box>
  );
}
