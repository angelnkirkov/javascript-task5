import { EventEmitter } from 'eventemitter3';
import Planet from './Planet';
import Film from './Film';

export default class StarWarsUniverse extends EventEmitter {
  constructor() {
    super();
    this.films = [];
    this.planet = null;
  }

  static get events() {
    return { FILM_ADDED: 'film_added', UNIVERSE_POPULATED: 'universe_populated' };
  }

  async init() {
    try {
      let currentURL = 'https://swapi.boom.dev/api/planets?page=1';
      let planetName = '';

      while (currentURL) {
        const response = await fetch(currentURL);
        const data = await response.json();

        if (data) {
          currentURL = data.next ? data.next : '';
          for (const planet of data.results) {
            if (planet.population !== 'unknown' && Number(planet.population) === 0) {
              // eslint-disable-next-line no-console
              console.log(`Planet ${planet.name} has 0 population`);
              planetName = planet.name;
              break;
            }
          }
        } else {
          currentURL = '';
        }
      }

      const peopleResponse = await fetch('https://swapi.boom.dev/api/people/');
      const peopleData = await peopleResponse.json();

      this.planet = new Planet(planetName, { populationDelay: 1 }, peopleData.results);
      this.planet.addListener(Planet.events.POPULATING_COMPLETED, this._populationDone.bind(this));
      this.planet.addListener(Planet.events.PERSON_BORN, this._onPersonBorn.bind(this));
      await this.planet.populate();
    } catch (e) {
      console.error('Error while fetching planets');
      throw new Error(e);
    }
  }

  _populationDone() {
    // eslint-disable-next-line no-console
    console.log('Planet.events.POPULATING_COMPLETED event received');
    // eslint-disable-next-line no-console
    console.log('StarWarsUniverse.events.UNIVERSE_POPULATED event emitted');
    this.emit(StarWarsUniverse.events.UNIVERSE_POPULATED);
  }

  _onPersonBorn(payload) {
    // eslint-disable-next-line no-console
    console.log('Planet.events.PERSON_BORN event received');
    // eslint-disable-next-line no-console
    for (const filmUrl of payload.filmUrls) {
      const found = this.films.find((film) => film.filmUrl === filmUrl);

      if (!found) {
        this.films.push(new Film(filmUrl));
        this.emit(StarWarsUniverse.events.FILM_ADDED);
        // eslint-disable-next-line no-console
        console.log('StarWarsUniverse.events.FILM_ADDED event emitted');
      }
    }
  }
}
