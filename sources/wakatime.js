const got = require('got');

async function wakatime(url) {
  const svg = await got(url);
  const match = svg.body.match(/(?<hours>[0-9]+) hrs (?<minutes>[0-9]+) mins/).groups;
  return Number(match.hours) * 60 + Number(match.minutes);
}

module.exports = wakatime;
