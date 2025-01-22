import { DataSource } from '~/classes/DataSource';
import getMaintainerDownloads from '@artginzburg/npmstalk';
import { config } from '~/config';

export const npmDownloads = new DataSource('npmDownloads', 'NPM Downloads', async () => {
  const result = await getMaintainerDownloads(config.github.username);
  return result.total;
});
export default npmDownloads;
