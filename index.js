const fs = require('fs');

const getUserDownloads = require('@artginzburg/github-user-downloads');
const getMaintainerDownloads = require('@artginzburg/npmstalk');
const wakatime = require('./sources/wakatime');

const config = require('./config');

const { PERSONAL_ACCESS_TOKEN } = process.env;

function getInitialData(path, valueIfEmpty) {
  let data;
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
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

  const [
    githubDownloads,
    wakatimeMinutes,
    npmDownloads,
  ] = await Promise.all([
    getUserDownloads(config.github.username, PERSONAL_ACCESS_TOKEN),
    wakatime(config.wakatime),
    getMaintainerDownloads(config.github.username),
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
  fs.writeFileSync(file, JSON.stringify(data));
}

module.exports = async function updateData(path) {
  let data = getInitialData(path, {});
  data = await refreshData(data);
  writeData(path, data);
};

// updateData('./data.json');
