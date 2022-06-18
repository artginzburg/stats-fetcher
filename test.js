/* eslint-disable no-console */
import 'dotenv/config';
import updateData from '.';

const oldData = await import('./data.json', {
  assert: { type: 'json' },
});
const oldKeys = Object.keys(oldData);

console.time();
await updateData('data.json');
console.timeEnd();

const newData = await import('./data.json', {
  assert: { type: 'json' },
});

const assert = oldKeys.every((newKey) => {
  const oldValue = oldData[newKey];
  const newValue = newData[newKey];

  return newValue >= oldValue;
});

if (assert) {
  console.log('Test passed: every new stat is equal or greater than the old one.');
} else {
  console.log('Test failed!');
  process.exit(1);
}
