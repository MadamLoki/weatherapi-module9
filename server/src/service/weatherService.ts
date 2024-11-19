import dotenv from 'dotenv';
dotenv.config();

// TO DO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TO DO: Define a class for the Weather object
class Weather {
  baseURL: string;
  apiKey: string;
  cityName: string;
  coordinates: Coordinates;
  temperature: number;
  wind: number;
  humidity: number;
  icon: string;
  iconDescription: string;
  daily: Weather[];

  constructor(
    baseURL: string,
    apiKey: string,
    cityName: string,
    coordinates: Coordinates,
    temperature: number,
    wind: number,
    humidity: number,
    icon: string,
    iconDescription: string,
    daily: Weather[] = []
  ) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
    this.cityName = cityName;
    this.coordinates = coordinates;
    this.temperature = temperature;
    this.wind = wind;
    this.humidity = humidity;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.daily = daily;
  }
  
}

interface WeatherData {
  daily: {
    temp: {
      day: number;
    };
    wind_speed: number;
    humidity: number;
    weather: {
      icon: string;
      description: string;
    }[];
  }[];
}
// TO DO: Complete the WeatherService class
class WeatherService {
  // TO DO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;
  constructor() {
    this.baseURL = 'process.env.API_BASE_URL';
    this.apiKey = 'process.env.API_KEY';
    this.cityName = '';
  }

  // TO DO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response = await fetch(query);
    const locationData = await response.json();
    return locationData;
  }
  // TO DO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }
  // TO DO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}geocode?city=${this.cityName}&apiKey=${this.apiKey}`;
  }
  // TO DO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}weather?lat=${coordinates.lat}&lon=${coordinates.lon}&apiKey=${this.apiKey}`;
  }
  // TO DO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    return this.destructureLocationData(locationData);
  }
  // TO DO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    const weatherData = await response.json();
    return weatherData;
  }
  // TO DO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const { temp, wind_speed, humidity, weather } = response.current;
    const { icon, description } = weather[0];
    return {
      temperature: temp,
      wind: wind_speed,
      humidity,
      icon,
      iconDescription: description,
    };
  }
  
  // TO DO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: WeatherData): Weather[] {
    const forecastArray = weatherData.daily.map((day) => {
      const { temp, wind_speed, humidity, weather } = day;
      const { icon, description } = weather[0];
      return new Weather(
        currentWeather.baseURL,
        currentWeather.apiKey,
        currentWeather.cityName,
        currentWeather.coordinates,
        temp.day,
        wind_speed,
        humidity,
        icon,
        description,
        []
      );
    });
    return forecastArray;
  }
  // TO DO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const locationData = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(locationData);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray: Weather[] = this.buildForecastArray(
      new Weather(
        this.baseURL,
        this.apiKey,
        this.cityName,
        locationData,
        currentWeather.temperature,
        currentWeather.wind,
        currentWeather.humidity,
        currentWeather.icon,
        currentWeather.iconDescription
      ),
      weatherData
    );
    return { currentWeather, forecastArray };
  }
}

export default new WeatherService();
