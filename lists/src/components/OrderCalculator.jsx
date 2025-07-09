import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Alert, Paper, Stack, IconButton, Table, TableBody, TableCell, TableRow, TableHead, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const OrderCalculator = ({ configId }) => {
  console.log('OrderCalculator: received configId:', configId, 'type:', typeof configId);
  
  const [params, setParams] = useState(null); // pricing_strategy.parameters.parameters
  const [extras, setExtras] = useState([]); // [{key, count, price}]
  const [fields, setFields] = useState([]); // [{key, value}]
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Таблица категорий ткани и процентов
  const fabricCategories = [
    { label: '1 категория', value: 0 },
    { label: '2 категория', value: 9 },
    { label: '3 категория', value: 14 },
    { label: '4 категория', value: 19 },
    { label: '5 категория', value: 24 },
    { label: '6 категория', value: 29 },
    { label: '7 категория', value: 37 },
    { label: '8 категория', value: 45 },
    { label: '9 категория', value: 55 },
    { label: '10 категория', value: 65 },
    { label: '11 категория', value: 75 },
    { label: '12 категория', value: 85 },
    { label: '13 категория', value: 100 },
    { label: '14 категория', value: 115 },
    { label: '15 категория', value: 130 },
    { label: '16 категория', value: 145 },
  ];

  // Маппинг для русских названий опций
  const extrasLabels = {
    ottomanFlat: 'Отоманка',
    pantograf: 'Пантограф',
    mechanismFlat: 'Механизм',
  };

  // Получаем параметры конфигурации
  useEffect(() => {
    if (!configId) return;
    console.log('OrderCalculator: configId', configId);
    setParams(null);
    setExtras([]);
    setFields([]);
    
    // Получаем все коллекции и ищем ту, которая содержит нужную конфигурацию
    axios.get(`http://212.193.27.132/fastapi/api/v1/collections?sort_by=id&order=asc`)
      .then(res => {
        console.log('OrderCalculator: API response', res.data);
        
        // Ищем коллекцию, которая содержит конфигурацию с нужным id
        // Пока используем первую коллекцию как fallback, так как структура API не ясна
        const collection = res.data[0];
        if (!collection) {
          setError('Коллекция не найдена');
          return;
        }
        
        const p = collection.pricing_strategy?.parameters?.parameters;
        if (!p) {
          setError('Параметры ценообразования не найдены');
          return;
        }
        
        setParams(p);
        
        // extras
        if (p?.extras) {
          setExtras(Object.entries(p.extras).map(([key, val]) => ({
            key,
            count: val.count || 0,
            price: val.price || 0
          })));
        }
        
        // остальные параметры (кроме marginPct и pricePerMeter)
        setFields(Object.entries(p || {}).filter(([k]) => k !== 'extras' && k !== 'marginPct' && k !== 'pricePerMeter').map(([key, val]) => {
          if (key === 'fabricPct') {
            // Если fabricPct — объект с category, то ищем подходящее значение
            let defaultValue = 0;
            if (typeof val === 'object' && val !== null && 'category' in val) {
              defaultValue = val.category;
            } else if (typeof val === 'number') {
              defaultValue = val;
            }
            return { key, value: defaultValue };
          }
          return {
            key,
            value: typeof val === 'object' && val !== null && 'category' in val ? val.category : val
          };
        }));
      })
      .catch(err => {
        console.log('OrderCalculator: API error', err);
        setError('Ошибка загрузки параметров конфигурации');
      });
  }, [configId]);

  const handleFieldChange = (key, value) => {
    setFields(fields => fields.map(f => f.key === key ? { ...f, value } : f));
  };
  const handleExtrasChange = (key, delta) => {
    setExtras(prev => prev.map(e => e.key === key ? { ...e, count: Math.max(0, e.count + delta) } : e));
  };
  const handleExtrasPriceChange = (key, value) => {
    setExtras(prev => prev.map(e => e.key === key ? { ...e, price: Number(value) } : e));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // Собираем параметры для запроса
      const body = { ...Object.fromEntries(fields.map(f => [f.key, typeof params[f.key] === 'object' ? { category: Number(f.value) } : Number(f.value)])) };
      // Добавляем обязательные поля, даже если их нет в fields
      if (params.marginPct !== undefined) body.marginPct = params.marginPct;
      if (params.pricePerMeter !== undefined) body.pricePerMeter = params.pricePerMeter;
      body.extras = extras.reduce((acc, e) => {
        acc[e.key] = { count: Number(e.count), price: Number(e.price) };
        return acc;
      }, {});
      const res = await axios.post('http://212.193.27.132/fastapi/api/v1/prices/sum', {
        parameters: body
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при расчете цены');
    } finally {
      setLoading(false);
    }
  };

  // Фронтовый расчет итоговой цены
  const calculateTotal = () => {
    if (!params) return 0;
    // Получаем значения
    const marginPct = params.marginPct ?? 0;
    const pricePerMeter = params.pricePerMeter ?? 0;
    let fabricPct = 0;
    if (params.fabricPct && typeof params.fabricPct === 'object' && 'category' in params.fabricPct) {
      fabricPct = Number(fields.find(f => f.key === 'fabricPct')?.value ?? params.fabricPct.category);
    } else if ('fabricPct' in params) {
      fabricPct = Number(fields.find(f => f.key === 'fabricPct')?.value ?? params.fabricPct);
    }
    // Сумма по extras
    const extrasSum = extras.reduce((sum, e) => sum + (e.count * e.price), 0);
    // Формула: (pricePerMeter * (1 + marginPct/100)) * (1 + fabricPct/100) + extrasSum
    const base = pricePerMeter * (1 + marginPct / 100);
    const total = base * (1 + fabricPct / 100) + extrasSum;
    return Math.round(total);
  };

  if (!params) return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4, boxShadow: 8, borderRadius: 4 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>Калькулятор цены дивана</Typography>
      <Typography>Загрузка параметров...</Typography>
    </Paper>
  );

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4, boxShadow: 8, borderRadius: 4 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>Калькулятор цены дивана</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {fields.map(f => (
            f.key === 'fabricPct' ? (
              <TextField
                key={f.key}
                select
                label="Категория ткани"
                value={f.value}
                onChange={e => handleFieldChange(f.key, e.target.value)}
                required
              >
                {fabricCategories.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label} ({opt.value}%)</MenuItem>

                ))}
              </TextField>
            ) : (
              <TextField
                key={f.key}
                label={f.key}
                type="number"
                value={f.value}
                onChange={e => handleFieldChange(f.key, e.target.value)}
                required
              />
            )
          ))}
          {extras.length > 0 && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Дополнительные опции</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Опция</TableCell>
                    <TableCell>Цена</TableCell>
                    <TableCell>Кол-во</TableCell>
                    <TableCell>Сумма</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {extras.map(e => (
                    <TableRow key={e.key}>
                      <TableCell>{extrasLabels[e.key] || e.key}</TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={e.price}
                          onChange={ev => handleExtrasPriceChange(e.key, ev.target.value)}
                          size="small"
                          sx={{ width: 90 }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleExtrasChange(e.key, -1)}><RemoveIcon fontSize="small" /></IconButton>
                        {e.count}
                        <IconButton size="small" onClick={() => handleExtrasChange(e.key, 1)}><AddIcon fontSize="small" /></IconButton>
                      </TableCell>
                      <TableCell>{e.count * e.price} ₽</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
          <Button type="submit" variant="contained" color="primary" disabled={loading} size="large">
            {loading ? 'Расчет...' : 'Рассчитать цену'}
          </Button>
        </Stack>
      </Box>
      {result && (
        <Alert severity="success" sx={{ mt: 3 }}>
          Итоговая цена: <b>{result.price} ₽</b>
        </Alert>
      )}
      <Alert severity="success" sx={{ mt: 3 }}>
        Итоговая цена (фронт): <b>{calculateTotal()} ₽</b>
      </Alert>
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>
      )}
    </Paper>
  );
};

export default OrderCalculator; 