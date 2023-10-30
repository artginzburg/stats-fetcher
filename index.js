import { writeFileSync } from 'fs';

import getUserDownloads from '@artginzburg/github-user-downloads';
import getMaintainerDownloads from '@artginzburg/npmstalk';
import getWakatimeMinutes from './sources/wakatime';
import { getMustappUser } from './sources/mustapp';
import dataJson from './data.json' assert { type: 'json' };

import { sumArray } from './utils';
import { github, wakatime, mustapp } from './config';

async function refreshData(currentData) {
  const data = currentData;

  const [
    githubDownloads,
    wakatimeMinutes,
    npmDownloads,
    mustappUser,
  ] = await Promise.allSettled([
    getUserDownloads(github.username),
    getWakatimeMinutes(wakatime),
    getMaintainerDownloads(github.username),
    getMustappUser(mustapp.username),
  ]);

  [
    [githubDownloads, 'GitHub Downloads'],
    [wakatimeMinutes, 'WakaTime Minutes'],
    [npmDownloads, 'NPM Downloads'],
    [mustappUser, 'MustApp User'],
  ].forEach(([promiseSettledResult, name]) => {
    console.log(`${name}: ${promiseSettledResult.status}`);
    if (promiseSettledResult.status === 'rejected') {
      console.error(`${name} fail reason:\n`, promiseSettledResult.reason);
    }
  });

  if (githubDownloads.value?.total) {
    data.githubDownloads = githubDownloads.value.total;
  }

  if (wakatimeMinutes.value) {
    data.wakatimeMinutes = wakatimeMinutes.value;
  }

  if (npmDownloads.value?.total) {
    data.npmDownloads = npmDownloads.value.total;
  }

  if (mustappUser.value?.hours_spent) {
    data.mustappHours = Object.values(mustappUser.value.hours_spent).reduce(sumArray);
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
