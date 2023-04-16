import { writeFileSync } from 'fs';

import getUserDownloads from '@artginzburg/github-user-downloads';
import getMaintainerDownloads from '@artginzburg/npmstalk';
import getWakatimeMinutes from './sources/wakatime';
import getMustappUser from './sources/mustapp';
import dataJson from './data.json' assert { type: 'json' };

import { sumArray } from './utils';
import { github, wakatime, mustapp } from './config';

async function refreshData(currentData) {
  const data = currentData;

  const [
    githubDownloads,
    wakatimeMinutes,
    npmDownloads,
    mustappUser
  ] = await Promise.all([
    getUserDownloads(github.username),
    getWakatimeMinutes(wakatime),
    getMaintainerDownloads(github.username),
    getMustappUser(mustapp.username),
  ]);

  if (githubDownloads?.total) {
    data.githubDownloads = githubDownloads.total;
  }

  if (wakatimeMinutes) {
    data.wakatimeMinutes = wakatimeMinutes;
  }

  if (npmDownloads?.total) {
    data.npmDownloads = npmDownloads.total;
  }

  if (mustappUser?.hours_spent) {
    data.mustappHours = Object.values(mustappUser.hours_spent).reduce(sumArray);
  }

  return data;
}

function writeData(file, data) {
  writeFileSync(file, `${JSON.stringify(data, undefined, 2)}\n`);
}

export default async function updateData(path) {
  let data = dataJson;
  data = await refreshData(data);
  writeData(path, data);
}
