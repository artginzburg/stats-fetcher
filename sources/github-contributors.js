import { Octokit } from '@octokit/rest';

export default async function getUserContributors(
  /** @type {string} */
  username,
  auth = process.env.GITHUB_TOKEN,
) {
  const { rest } = new Octokit({ auth });

  const { data: repos } = await rest.repos.listForUser({
    username,
    per_page: 100,
  });

  const userContributors = {
    total: 0,
    data: [],
  };

  /** @type {Record<number, string>} */
  const contributorsRecord = {};

  const allowedForks = new Set(['MiddleClick-Sonoma']);

  async function mapRepos(
    /** @type {typeof repos[number]} */
    repo,
  ) {
    const { data: contributors } = await rest.repos.listContributors({
      owner: repo.owner.login,
      repo: repo.name,
      per_page: 100,
      anon: true,
    });

    if (repo.fork && !allowedForks.has(repo.name)) {
      console.log(`repo ${repo.name} is a fork - skipping.`);
      return;
    }

    const mappedContributors = contributors.map((contributor) => ({
      login: contributor.login,
      id: contributor.id,
      html_url: contributor.html_url,
      type: contributor.type,
      contributions: contributor.contributions,
    }));

    mappedContributors.forEach((contributor) => {
      if (contributor.type === 'Bot') return;
      if (contributor.login === username) return;

      if (!contributorsRecord[contributor.id]) {
        contributorsRecord[contributor.id] = {
          login: contributor.login,
          html_url: contributor.html_url,
          type: contributor.type,
          contributions: 0,
          repos: [],
        };
      }

      contributorsRecord[contributor.id].contributions += contributor.contributions;
      contributorsRecord[contributor.id].repos.push(repo.name);
    });

    userContributors.data.push({ name: repo.name, contributors: mappedContributors });
  }

  await Promise.all(repos.map(mapRepos));

  console.log('contributorsRecord', contributorsRecord);
}
