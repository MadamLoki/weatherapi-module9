import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

router.post('/', (req, res) => {
  const city = req.body.cityName;
  const weatherService = new WeatherService();
  const weatherData = weatherService.getWeatherForCity(city);
  res.json(weatherData);

  HistoryService.addCity(city);
});

router.get('/history', async (_req, res) => {
  const cities = await HistoryService.getCities();
  res.json(cities);
});

router.delete('/history/:id', async (req, res) => {
  await HistoryService.removeCity(req.params.id);
  res.sendStatus(200);
});

export default router;
