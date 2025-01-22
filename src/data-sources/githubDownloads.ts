import getUserDownloads from '@artginzburg/github-user-downloads';
import { DataSource } from '~/classes/DataSource';
import { config } from '~/config';

export const githubDownloads = new DataSource('githubDownloads', 'GitHub Downloads', async () => {
  const result = await getUserDownloads(config.github.username);
  return result.total;
});
export default githubDownloads;
