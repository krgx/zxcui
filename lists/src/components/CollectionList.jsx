import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Skeleton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const sortFields = [
  { value: 'label', label: 'Название' },
];
const orderFields = [
  { value: 'asc', label: 'По возрастанию' },
  { value: 'desc', label: 'По убыванию' },
];

const CollectionList = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('id');
  const [order, setOrder] = useState('asc');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://212.193.27.132/fastapi/api/v1/collections`, {
      params: { sort_by: sortBy, order }
    })
      .then(res => setCollections(res.data))
      .finally(() => setLoading(false));
  }, [sortBy, order]);

  if (loading) return (
    <Container sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h3" align="center" fontWeight={700} gutterBottom sx={{ letterSpacing: 2 }}>
        Коллекции
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
        Коллекции
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Сортировать по</InputLabel>
            <Select value={sortBy} label="Сортировать по" onChange={e => setSortBy(e.target.value)}>
              {sortFields.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Порядок</InputLabel>
            <Select value={order} label="Порядок" onChange={e => setOrder(e.target.value)}>
              {orderFields.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={4} justifyContent="center">
        {collections.map(col => (
          <Grid item key={col.id} xs={12} sm={6} md={4}>
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
                background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)',
              }}
            >
              <CardContent>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  {col.label}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ minHeight: 48 }}>
                  {col.category?.label}
                </Typography>
                <Button
                  sx={{ mt: 3, borderRadius: 2, fontWeight: 600, px: 4, py: 1.5 }}
                  size="large"
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => navigate(`/collections/${col.id}/categories`)}
                >
                  Смотреть категории
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CollectionList;
