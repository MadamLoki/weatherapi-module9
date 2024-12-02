import { Dayjs } from 'dayjs';
import dotenv from 'dotenv';

interface WeatherData {
  list: {
    dt: number;
    main: {
      temp: number;
      humidity: number;
    };
    wind: {
      speed: number;
    };
    weather: {
      icon: string;
      description: string;
    }[];
  }[];
}
dotenv.config();

// TO DO: Define an interface for the Coordinates object
interface Coordinates {
  name: string;
  lat: number;
  lon: number;
}

// TO DO: Define a class for the Weather object
class Weather {
  // baseURL: string;
  // apiKey: string;
  cityName: string;
  // coordinates: Coordinates;
  temperature: number;
  wind: number;
  humidity: number;
  icon: string;
  iconDescription: string;
  // daily: Weather[];
  date: Dayjs | string;

  constructor(
    // baseURL: string,
    // apiKey: string,
    cityName: string,
    // coordinates: Coordinates,
    temperature: number,
    wind: number,
    humidity: number,
    icon: string,
    iconDescription: string,
    // daily: Weather[] = []
    date: Dayjs | string,
  ) {
    // this.baseURL = baseURL;
    // this.apiKey = apiKey;
    this.cityName = cityName;
    // this.coordinates = coordinates;
    this.temperature = temperature;
    this.wind = wind;
    this.humidity = humidity;
    this.icon = icon;
    this.iconDescription = iconDescription;
    // this.daily = daily;
    this.date = date;
  }
}

// TO DO: Complete the WeatherService class
// reviewed and good to go
class WeatherService {
  // TO DO: Define the baseURL, API key, and city name properties
  private baseURL?: string;
  private apiKey?: string;
  private cityName = '';

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    //this.cityName = 'London'; // Example city name
  }

  // TO DO: Create fetchLocationData method
  // g2g
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
    // const response = await fetch(query);
    // const locationData = await response.json();
    // return locationData;
  }
  // TO DO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    if (!locationData) {
      throw new Error('Location data does not contain coordinates');
    }
    const { name, lat, lon } = locationData;
    // return { lat, lon };
    const coordinates: Coordinates = {
      name,
      lat,
      lon,
    };
    return coordinates;
  }
  // TO DO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const geoQuery = `https://api.openweathermap.org/geo/1.0/direct?q=${this.cityName}&limit=5&appid=${this.apiKey}`;
    return geoQuery;
  }
  // TO DO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const weatherQuery = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly&units=imperial&appid=${this.apiKey}`;
    return weatherQuery;
  }

  // TO DO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    //const locationData =
    return await this.fetchLocationData(this.buildGeocodeQuery()).then((data) =>
      this.destructureLocationData(data as Coordinates)
    );
  }
  // TO DO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      const response = await fetch(this.buildWeatherQuery(coordinates)).then((response) => response.json());
      console.log(response);
      if (!response) {
        throw new Error('Weather Data not found');
      }
      const forecast: Weather[] = this.buildForecastArray(response);
      return forecast;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return error;
    }
  }
  // TO DO: Build parseCurrentWeather method
  private async parseCurrentWeather(response: any) {
    if (!response.current) {
      console.error('API response does not contain current weather data:', response);
      throw new Error('API response does not contain current weather data');
    }
    // TO DO - bring in the date
    // to do bring in new instance of "new Weather" -- new class instance
    // https://openweathermap.org/forecast5
    // return variable that definese new instance
    // refer to line 142
    return response.list.daily.map((response: any) => {
      const { main, weather, dt } = response;
      const date = new Date(response.dt * 1000).toLocaleDateString();
      return {
        temp: main.temp,
        wind: main.wind_speed,
        humidity: main.humidity,
        icon: weather[0].icon,
        description: weather[0].description,
        forecast: [],
        date: date,
        dt,
        };
      });
    };
    // if (!response.current) {
    //   console.error('API response does not contain current weather data:', response);
    //   throw new Error('API response does not contain current weather data');
    // }

    // const { temp, wind_speed, humidity, weather } = response.current;
    // const { icon, description } = weather[0];
    // return {
    //   temperature: temp,
    //   wind: wind_speed,
    //   humidity,
    //   icon,
    //   iconDescription: description,
    // };

  // TO DO: Complete buildForecastArray method
  private buildForecastArray(weatherData: WeatherData): Weather[] {
    return weatherData.list.slice(1, 6).map((day: any) => {
      return new Weather(
      this.cityName,
      day.main.temp,
      day.wind.speed,
      day.main.humidity,
      day.weather[0].icon,
      day.weather[0].description,
      new Date(day.dt * 1000).toISOString()
      );
    });
  }

  // TO DO: Complete getWeatherForCity method
  public async getWeatherForCity() {
    try {
      const coordinates = await this.fetchAndDestructureLocationData();
      const weatherData = await this.fetchWeatherData(coordinates);
      const currentWeather = await this.parseCurrentWeather(weatherData);
      const forecastArray = this.buildForecastArray(weatherData as WeatherData);
      return { 
        currentWeather: currentWeather,
        forecastArray
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
    // this.cityName = city;
    // const locationData = await this.fetchAndDestructureLocationData();
    // const weatherData = await this.fetchWeatherData(locationData);
    // const currentWeather = this.parseCurrentWeather(weatherData);
    // const forecastArray: Weather[] = this.buildForecastArray(
    //   new Weather(
    //     this.baseURL,
    //     this.apiKey,
    //     this.cityName,
    //     locationData,
    //     currentWeather.temperature,
    //     currentWeather.wind,
    //     currentWeather.humidity,
    //     currentWeather.icon,
    //     currentWeather.iconDescription
    //   ),
    //   weatherData
    // );
    // return { currentWeather, forecastArray };
  }
}

export default WeatherService;
