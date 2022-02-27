/* eslint-disable no-console */
import 'dotenv/config';
import updateData from '.';

console.time();
updateData('data.json').then(console.timeEnd);
