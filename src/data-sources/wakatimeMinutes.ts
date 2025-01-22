import { DataSource } from '~/classes/DataSource';
import { config } from '~/config';
import got from 'got';

export const wakatimeMinutes = new DataSource('wakatimeMinutes', 'WakaTime Minutes', async () => {
  const result = await getWakatimeMinutes(config.wakatime);
  return result;
});
export default wakatimeMinutes;

async function getWakatimeMinutes(url: string) {
  const svg = await got(url);
  const matchGroups = svg.body.match(/(?<hours>[0-9,]+) hrs (?<minutes>[0-9]+) mins/)?.groups;
  if (!matchGroups) throw new Error('matchGroups is null');

  return Number(matchGroups['hours']?.replaceAll(',', '')) * 60 + Number(matchGroups['minutes']);
}
