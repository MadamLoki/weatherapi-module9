import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TO DO: POST Request with city name to retrieve weather data
router.post('/', (req, res) => {
  // TO DO: GET weather data from city name
  const city = req.body.cityName;
  const weatherService = new WeatherService();
  const weatherData = weatherService.getWeatherForCity(city);
  res.json(weatherData);

  // TO DO: save city to search history
  //const historyService = new HistoryService();
  HistoryService.addCity(city);
});

// TO DO: GET search history
router.get('/history', async (_req, res) => {
  //const historyService = new HistoryService();
  const cities = await HistoryService.getCities();
  res.json(cities);
});

// BONUS TO DO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  //const historyService = new HistoryService();
  await HistoryService.removeCity(req.params.id);
  res.sendStatus(200);
});

export default router;
