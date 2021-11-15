import { openDB } from 'idb';
import { EmulatorHubDB, initializeDatabase } from './storage';

const dbConnection = initializeDatabase().then(() => openDB<EmulatorHubDB>('emulator-hub'));

export default dbConnection;
