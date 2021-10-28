const fs = require('fs');

const wakatime = require('./sources/wakatime');

const config = require('./config');

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
  data.wakatimeMinutes = (await wakatime(config.wakatime)) ?? data.wakatimeMinutes;
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
