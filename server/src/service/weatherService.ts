import { Dayjs } from 'dayjs';
import dotenv from 'dotenv';
dotenv.config();
interface Coordinates {
  name: string;
  lat: number;
  lon: number;
}
class Weather {
  cityName: string;
  temperature: number;
  wind: number;
  humidity: number;
  icon: string;
  iconDescription: string;
  date: Dayjs | string;

  constructor(
    cityName: string,
    temperature: number,
    wind: number,
    humidity: number,
    icon: string,
    iconDescription: string,
    date: Dayjs | string,
  ) {
    this.cityName = cityName;
    this.temperature = temperature;
    this.wind = wind;
    this.humidity = humidity;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.date = date;
  }
}
class WeatherService {
  private baseURL?: string;
  private apiKey?: string;
  private cityName = '';

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  }

  private async fetchLocationData(query: string) {
    try {
      if (!this.baseURL || !this.apiKey) {
        throw new Error('No query provided');
      } {
        return await fetch(query).then((response) => response.json());
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
      return error;
    }
  }
  private destructureLocationData(locationData: Coordinates): Coordinates {
    if (!locationData || !locationData.lat || !locationData.lon) {
      throw new Error('Location data does not contain coordinates');
    }
    const coord: Coordinates = {
      name: locationData.name,
      lat: locationData.lat,
      lon: locationData.lon,
    };
    return { name: coord.name, lat: coord.lat, lon: coord.lon };
  }
  // TO DO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const geoQuery = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(this.cityName)}&limit=5&appid=${this.apiKey}`;
    return geoQuery;
  }
  // TO DO: Create buildWeatherQuery method
  private buildWeatherQuery(coord: Coordinates): string {
    const weatherQuery = `https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely,hourly&units=imperial&appid=${this.apiKey}`;
    return weatherQuery;
  }

  // TO DO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    //const locationData =
    return await this.fetchLocationData(this.buildGeocodeQuery()).then((data) =>
      this.destructureLocationData(data[0])
    );
  }
  // TO DO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      const response = await fetch(this.buildWeatherQuery(coordinates)).then((response) => response.json());
      // console.log(response);
      if (!response) {
        throw new Error('Weather Data not found');
      }
      const forecast: Weather[] = await this.parseCurrentWeather(response);
      const forecastArray: Weather[] = this.buildForecastArray(response);
      console.log(forecast);
      return forecastArray;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return error;
    }
  }
  // TO DO: Build parseCurrentWeather method
  private async parseCurrentWeather(response: any) {
    if (!response.list || !Array.isArray(response.list)) {
      console.error('API response does not contain valid weather data:', response);
      throw new Error('API response does not contain valid weather data');
    }
    return response.list.map((item: any) => {
      const { main, weather, dt } = item;
      const date = new Date(dt * 1000).toLocaleDateString();
        return new Weather(
          this.cityName,
          main.temp,
          item.wind.speed,
          main.humidity,
          weather[0].icon,
          weather[0].description,
          date,
        );
      });
    };

  // TO DO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any): Weather[] {
    const filterweather = weatherData.list.filter((weather: any) => {
      return weather.dt_txt.includes('12:00:00');
    })
    return filterweather.map((weather: any) => {
      return new Weather(
        this.cityName,
        weather.main.temp,
        weather.wind.speed,
        weather.main.humidity,
        weather.weather[0].icon,
        weather.weather[0].description,
        new Date(weather.dt * 1000).toLocaleDateString(),
      )
    });
  }

  // TO DO: Complete getWeatherForCity method
  public async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    return await this.fetchWeatherData(coordinates);
  }
}

export default WeatherService;
