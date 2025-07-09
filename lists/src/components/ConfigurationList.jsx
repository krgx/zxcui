import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Skeleton,
  Grid
} from '@mui/material';

const ConfigurationList = () => {
  const { productId } = useParams();
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://212.193.27.132/fastapi/api/v1/products/${productId}/configurations`)
      .then(res => setConfigs(res.data))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) return (
    <Container sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h3" align="center" fontWeight={700} gutterBottom sx={{ letterSpacing: 2 }}>
        Конфигурации товара
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {[...Array(6)].map((_, i) => (
          <Grid item key={i} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', boxShadow: 6, borderRadius: 4 }}>
              <CardContent>
                <Skeleton variant="text" height={40} width="80%" sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={48} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={36} width="100%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );

  return (
    <Container sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h3" align="center" fontWeight={700} gutterBottom sx={{ letterSpacing: 2 }}>
        Конфигурации товара
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {configs.map(config => (
          <Grid item key={config.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                boxShadow: 6,
                borderRadius: 4,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.03)',
                  boxShadow: 12,
                },
                background: 'linear-gradient(135deg, #e8f5e9 0%, #fff 100%)',
              }}
            >
              <CardContent>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  {config.label}
                </Typography>
                <Button
                  sx={{ mt: 3, borderRadius: 2, fontWeight: 600, px: 4, py: 1.5 }}
                  size="large"
                  variant="contained"
                  color="success"
                  fullWidth
                  onClick={() => navigate(`/configurations/${config.id}/rules`)}
                >
                  Правила
                </Button>
                <Button
                  sx={{ mt: 1, borderRadius: 2, fontWeight: 600, px: 4, py: 1.5 }}
                  size="large"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => navigate(`/configurations/${config.id}/order`)}
                >
                  Рассчитать цену
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ConfigurationList;
