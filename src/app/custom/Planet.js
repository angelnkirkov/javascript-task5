import { EventEmitter } from 'eventemitter3';
import { delay } from '../utils';
import Person from './Person';

export default class Planet extends EventEmitter {
  constructor(name, config, peopleData) {
    super();
    this.name = name;
    this.config = config;
    this.peopleData = peopleData;
    this.population = [];
  }

  static get events() {
    return { PERSON_BORN: 'person_born', POPULATING_COMPLETED: 'populating_completed' };
  }

  get populationCount() {
    return this.population.length;
  }

  async populate() {
    const peopleData = [...this.peopleData];

    async function populateEx(peopleData) {
      if (!peopleData || peopleData.length === 0) {
        this.emit(Planet.events.POPULATING_COMPLETED);
      } else {
        const person = peopleData[0];

        await delay(this.config.populationDelay);
        this.population.push(new Person(person.name, person.height, person.mass));
        this.emit(Planet.events.PERSON_BORN, { filmUrls: person.films });

        await populateEx.call(this, peopleData.slice(1));
      }
    }

    await populateEx.call(this, peopleData);
  }
}
