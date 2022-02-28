import { writeFileSync } from 'fs';

import getUserDownloads from '@artginzburg/github-user-downloads';
import getMaintainerDownloads from '@artginzburg/npmstalk';
import getWakatimeMinutes from './sources/wakatime';
import dataJson from './data.json';

import { github, wakatime } from './config';

async function refreshData(currentData) {
  const data = currentData;

  const [
    githubDownloads,
    wakatimeMinutes,
    npmDownloads,
  ] = await Promise.all([
    getUserDownloads(github.username),
    getWakatimeMinutes(wakatime),
    getMaintainerDownloads(github.username),
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

  return data;
}

function writeData(file, data) {
  writeFileSync(file, JSON.stringify(data));
}

export default async function updateData(path) {
  let data = dataJson;
  data = await refreshData(data);
  writeData(path, data);
}
