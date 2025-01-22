import { writeFile } from 'node:fs/promises';

import type { DataSource } from './classes/DataSource';
import { githubDownloads } from './data-sources/githubDownloads';
import { mustappHours } from './data-sources/mustappHours';
import { npmDownloads } from './data-sources/npmDownloads';
import { wakatimeMinutes } from './data-sources/wakatimeMinutes';
import { githubContributors } from './data-sources/githubContributors';

import dataJson from '../data.json' assert { type: 'json' };

const allDataSources = [
  githubDownloads,
  wakatimeMinutes,
  npmDownloads,
  mustappHours,
  githubContributors,
] satisfies DataSource[];

updateData('data.json');

type DataSourceName = (typeof allDataSources)[number]['name'];

async function updateData(path: string) {
  await refreshData(dataJson);
  await writeData(path, dataJson);
}

async function refreshData(currentData: Partial<Record<DataSourceName, number>>) {
  const asyncFuntions = allDataSources.map(async (source) => {
    try {
      const num = await source.getData();
      currentData[source.name] = num;
      console.log(`${source.description}: success`);
    } catch (error) {
      console.error(`${source.description} failed, reason:\n`, (error as Error).message);
      throw error;
    }
  });
  if (process.env['NODE_ENV'] === 'test') await Promise.all(asyncFuntions);
  else await Promise.allSettled(asyncFuntions);
}

async function writeData(file: string, data: typeof dataJson) {
  await writeFile(file, `${JSON.stringify(data, undefined, 2)}\n`);
}
