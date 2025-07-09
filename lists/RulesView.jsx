import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Paper, CircularProgress, Skeleton } from '@mui/material';

const RulesView = () => {
  const { configId } = useParams();
  const [rules, setRules] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/rules/${configId}`)
      .then(res => setRules(res.data))
      .catch(() => setRules(null))  // обработка ошибок, если id не найден
      .finally(() => setLoading(false));
  }, [configId]);
  
  if (loading) return (
    <Container sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h3" align="center" fontWeight={700} gutterBottom sx={{ letterSpacing: 2 }}>
        Правила конфигурации
      </Typography>
      <Paper sx={{
        p: 4,
        background: 'linear-gradient(135deg, #f3e5f5 0%, #fff 100%)',
        boxShadow: 8,
        borderRadius: 4,
        maxWidth: 900,
        mx: 'auto'
      }}>
        <Skeleton variant="rectangular" height={200} />
      </Paper>
    </Container>
  );

  return (
    <Container sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h3" align="center" fontWeight={700} gutterBottom sx={{ letterSpacing: 2 }}>
        Правила конфигурации
      </Typography>
      <Paper sx={{
        p: 4,
        background: 'linear-gradient(135deg, #f3e5f5 0%, #fff 100%)',
        overflow: 'auto',
        boxShadow: 8,
        borderRadius: 4,
        maxWidth: 900,
        mx: 'auto'
      }}>
        <pre style={{
          margin: 0,
          fontSize: 16,
          fontFamily: 'Fira Mono, monospace',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all'
        }}>
          {JSON.stringify(rules, null, 2)}
        </pre>
      </Paper>
    </Container>
  );
};

export default RulesView;
