import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert, Paper, Stack } from '@mui/material';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Хардкодим авторизацию для zxc/zxc
    if (username === 'zxc' && password === 'zxc') {
      localStorage.setItem('token', 'test-token');
      onLogin && onLogin('test-token');
      setLoading(false);
      return;
    } else {
      setError('Неверный логин или пароль');
      setLoading(false);
      return;
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 8, boxShadow: 8, borderRadius: 4 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>Вход</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Логин"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Пароль"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" disabled={loading} size="large">
            {loading ? 'Вход...' : 'Войти'}
          </Button>
        </Stack>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>
      )}
    </Paper>
  );
};

export default Login; 