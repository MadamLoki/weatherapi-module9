import fs from 'node:fs/promises';

// TO DO: Define a City class with name and id properties
class City {
  name: string;
  id: string;
  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

// TO DO: Complete the HistoryService class
class HistoryService {
  // TO DO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile('db/db.json', 'utf-8');
      const cities: City[] = JSON.parse(data);
      return cities;
    } catch (error) {
      console.error('Error reading search history:', error);
      throw error; // Rethrow the error for handling in the calling function
    }
  }

  // TO DO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile('db/db.json', JSON.stringify(cities, null, 2));
    } catch (error) {
      console.error('Error writing search history:', error);
      throw error; // Rethrow the error for handling in the calling function
    }
  }

  // TO DO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    const cities = await this.read();
    return cities;
  }

  // TO DO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string): Promise<void> {
    const cities = await this.read();
    const newCity = new City(cityName, (cities.length + 1).toString());
    cities.push(newCity);
    await this.write(cities);
  }

  // BONUS TO DO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const updatedCities = cities.filter((city: City) => city.id !== id);
    await this.write(updatedCities);
  }
}

export default new HistoryService();
