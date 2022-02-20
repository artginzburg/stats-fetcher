require('dotenv').config();
const fs = require('fs');

const wakatime = require('./sources/wakatime');
const getUserDownloads = require('@artginzburg/github-user-downloads');

const config = require('./config');

const { PERSONAL_ACCESS_TOKEN } = process.env;

function getInitialData(path, valueIfEmpty) {
  let data;
  try {
    data = require(path);
  } catch (e) {
    if (e instanceof Error && e.code === 'MODULE_NOT_FOUND') {
      data = valueIfEmpty;
    } else throw e;
  }
  return data;
}

async function refreshData(currentData) {
  const data = currentData;
  console.log('Fetching Wakatime stats...');
  data.wakatimeMinutes = (await wakatime(config.wakatime)) ?? data.wakatimeMinutes;
  console.log('Wakatime stats loaded!');
  console.log('Fetching GitHub downloads stats...');
  data.githubDownloads = (await getUserDownloads(config.github.username, PERSONAL_ACCESS_TOKEN))?.total ?? data.githubDownloads;
  console.log('GitHub downloads loaded!');
  return data;
}

function writeData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data));
}

async function updateData(path) {
  let data = getInitialData(path, {});
  data = await refreshData(data);
  writeData(path, data);
}

updateData('./data.json');
