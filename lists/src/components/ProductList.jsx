import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Skeleton,
  Grid
} from '@mui/material';

const ProductList = () => {
  const { collectionId, categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://212.193.27.132/fastapi/api/v1/collections/${collectionId}/products?subcategory_id=${categoryId}`)
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false));
  }, [collectionId, categoryId]);

  if (loading) return (
    <Container sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h3" align="center" fontWeight={700} gutterBottom sx={{ letterSpacing: 2 }}>
        Товары коллекции
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {[...Array(6)].map((_, i) => (
          <Grid item key={i} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', boxShadow: 6, borderRadius: 4 }}>
              <Skeleton variant="rectangular" height={220} sx={{ borderRadius: '16px 16px 0 0' }} />
              <CardContent>
                <Skeleton variant="text" height={40} width="80%" sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={32} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={28} width="60%" sx={{ mb: 2 }} />
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
        Товары коллекции
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {products.map(product => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
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
                background: 'linear-gradient(135deg, #fce4ec 0%, #fff 100%)',
              }}
            >
              {product.image && (
                <CardMedia
                  component="img"
                  height="220"
                  image={product.image}
                  alt={product.label}
                  sx={{ objectFit: 'cover', borderRadius: '16px 16px 0 0' }}
                />
              )}
              <CardContent>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  {product.label}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ minHeight: 32 }}>
                  {product.subcategory?.label}
                </Typography>
                <Button
                  sx={{ mt: 2, borderRadius: 2, fontWeight: 600, px: 4, py: 1.5 }}
                  size="large"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => navigate(`/products/${product.id}/configurations`)}
                >
                  Конфигурации
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductList;
