import { readdir, writeFile } from 'node:fs/promises';

import { DataSource } from './classes/DataSource';

import dataJson from '../data.json' assert { type: 'json' };
import { join } from 'node:path';

const dataSourcesRelativePath = './data-sources/';
const dataRelativePath = './data.json';

const allDataSources = await getAllDataSources();

updateData(dataRelativePath);

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

async function getAllDataSources() {
  const { dirname } = import.meta;

  const dirContents = await readdir(join(dirname, dataSourcesRelativePath));
  const imported = await Promise.all(
    dirContents.map(async (pathName) => {
      const imported = await import(`${dataSourcesRelativePath}/${pathName}`);
      const defaultExport = imported.default;
      if (defaultExport instanceof DataSource) return defaultExport;
      else throw new TypeError(`The default export of ${pathName} is not a ${DataSource.name}!`);
    }),
  );
  return imported;
}
