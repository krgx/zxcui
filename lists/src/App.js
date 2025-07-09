import React, { useMemo, useState } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import CollectionList from './components/CollectionList';
import ProductList from './components/ProductList';
import ConfigurationList from './components/ConfigurationList';
import RulesView from './components/RulesView';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, IconButton, Box, Switch, Container, Button } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import logo from './logo.svg';
import OrderCalculator from './components/OrderCalculator';
import Login from './components/Login';
import CategoryList from './components/CategoryList';

const OrderCalculatorWrapper = () => {
  const { configId } = useParams();
  console.log('OrderCalculatorWrapper: configId from params:', configId, 'type:', typeof configId);
  return <OrderCalculator configId={configId} />;
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();
  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode
          ? 'linear-gradient(135deg, #232526 0%, #414345 100%)'
          : 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
      },
    },
    typography: {
      fontFamily: 'Montserrat, Roboto, Arial',
    },
  }), [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', background: theme.palette.background.default }}>
        <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 4, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }}>
          <Toolbar>
            <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', mr: 2 }}>
              <img src={logo} alt="logo" style={{ width: 40, height: 40, marginRight: 12 }} />
              <Typography variant="h6" fontWeight={700} letterSpacing={2}>Каталог</Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            {token ? (
              <Button color="inherit" onClick={handleLogout}>Выйти</Button>
            ) : (
              <Button color="inherit" component={Link} to="/login">Войти</Button>
            )}
            <IconButton color="inherit" onClick={() => setDarkMode(m => !m)}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <Switch checked={darkMode} onChange={() => setDarkMode(m => !m)} color="default" />
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl" disableGutters>
          <Routes>
            <Route path="/" element={<CollectionList />} />
            <Route path="/collections/:collectionId/categories" element={<CategoryList />} />
            <Route path="/collections/:collectionId/products/:categoryId" element={<ProductList />} />
            <Route path="/products/:productId/configurations" element={<ConfigurationList />} />
            <Route path="/configurations/:configId/rules" element={<RulesView />} />
            <Route path="/configurations/:configId/order" element={
              token ? <OrderCalculatorWrapper /> : <Login onLogin={t => { setToken(t); navigate(-1); }} />
            } />
            <Route path="/login" element={<Login onLogin={t => { setToken(t); navigate('/'); }} />} />
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
