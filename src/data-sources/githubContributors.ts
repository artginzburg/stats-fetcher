import { Octokit } from '@octokit/rest';
import { DataSource } from '~/classes/DataSource';
import { config } from '~/config';

/** Shows the number of users that contributed to my work */
export const githubContributors = new DataSource(
  'githubContributors',
  'GitHub Collaborators',
  async () => {
    const result = await getUserContributors(config.github.username);

    return Object.keys(result).length;
  },
);

async function getUserContributors(username: string, auth = process.env['GITHUB_TOKEN']) {
  const { rest } = new Octokit({ auth });

  const { data: repos } = await rest.repos.listForUser({
    username,
    per_page: 100,
  });

  const userContributors = {
    total: 0,
    data: [] as {
      name: string;
      contributors: (ContributorStripped &
        MakeOptionalRequiredButUndefined<Pick<Contributor, 'id'>>)[];
    }[],
  };

  type Contributor = Awaited<ReturnType<typeof rest.repos.listContributors>>['data'][number];
  type ContributorStripped = MakeOptionalRequiredButUndefined<
    Pick<Contributor, 'login' | 'html_url' | 'type' | 'contributions'>
  >;
  const contributorsRecord: Record<number, ContributorStripped & { repos: string[] }> = {};

  const allowedForks = new Set([
    'MiddleClick-Sonoma',
    'next-ym',
    'AntiCollision',
    'use-scroll-sync',
  ]);

  async function mapRepos(repo: (typeof repos)[number]) {
    const { data: contributors } = await rest.repos.listContributors({
      owner: repo.owner.login,
      repo: repo.name,
      per_page: 100,
      anon: String(true),
    });

    if (repo.fork && !allowedForks.has(repo.name)) {
      // console.log(`repo ${repo.name} is a fork - skipping.`);
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
      if (contributor.id === undefined) return;

      if (!contributorsRecord[contributor.id]) {
        contributorsRecord[contributor.id] = {
          login: contributor.login,
          html_url: contributor.html_url,
          type: contributor.type,
          contributions: 0,
          repos: [],
        };
      }

      contributorsRecord[contributor.id]!.contributions += contributor.contributions;
      contributorsRecord[contributor.id]!.repos.push(repo.name);
    });

    userContributors.data.push({ name: repo.name, contributors: mappedContributors });
  }

  await Promise.all(repos.map(mapRepos));

  return contributorsRecord;
}

type MakeOptionalRequiredButUndefined<T> = {
  [K in keyof T as undefined extends T[K] ? K : never]-?: T[K] | undefined;
} & {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};
