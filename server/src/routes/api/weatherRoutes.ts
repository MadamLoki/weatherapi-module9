import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TO DO: POST Request with city name to retrieve weather data
router.post('/', (req, res) => {
  // TO DO: GET weather data from city name
  req.body.cityName;
  const weatherService = new WeatherService();
  const weatherData = weatherService.getWeatherData(req.body.cityName);
  res.json(weatherData);

  // TO DO: save city to search history
  const historyService = new HistoryService();
  historyService.saveCity(req.body.cityName);
});

// TO DO: GET search history
router.get('/history', async (req, res) => {
  const historyService = new HistoryService();
  const cities = await historyService.getCities();
  res.json(cities);
});

// BONUS TO DO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const historyService = new HistoryService();
  await historyService.removeCity(req.params.id);
  res.sendStatus(200);
});

export default router;
