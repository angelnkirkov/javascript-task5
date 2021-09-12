import config from '../config';
import EventEmitter from 'eventemitter3';
import StarWarsUniverse from './custom/StarWarsUniverse';

const EVENTS = {
  APP_READY: 'app_ready',
};

/**
 * App entry point.
 * All configurations are described in src/config.js
 */
export default class Application extends EventEmitter {
  constructor() {
    super();

    this.config = config;
    this.data = {};

    this.init();
  }

  static get events() {
    return EVENTS;
  }

  onUniversePopulated(payload) {
    // eslint-disable-next-line no-console
    console.log(`StarWarsUniverse.events.UNIVERSE_POPULATED event received`);
    // eslint-disable-next-line no-console
    console.log(payload);
    this.data.universe = payload;
  }

  /**
   * Initializes the app.
   * Called when the DOM has loaded. You can initiate your custom classes here
   * and manipulate the DOM tree. Task data should be assigned to Application.data.
   * The APP_READY event should be emitted at the end of this method.
   */
  async init() {
    // Initiate classes and wait for async operations here.
    const starWarsUniverse = new StarWarsUniverse();

    // eslint-disable-next-line max-len
    starWarsUniverse.addListener(StarWarsUniverse.events.UNIVERSE_POPULATED, this.onUniversePopulated.bind(this, starWarsUniverse));
    await starWarsUniverse.init();
    this.emit(Application.events.APP_READY);
  }
}

