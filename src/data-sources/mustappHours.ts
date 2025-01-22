import got from 'got';
import { DataSource } from '~/classes/DataSource';
import { config } from '~/config';
import { sumArray } from '~/utils/sumArray';

export const mustappHours = new DataSource('mustappHours', 'MustApp Hours', async () => {
  const result = await getMustappUser(config.mustapp.username);

  return Object.values(result.hours_spent).reduce(sumArray);
});

const baseUrl = 'https://mustapp.com';
const apiUrl = `${baseUrl}/api`;

function getMustappUser(usernameOrId: number | string) {
  if (isId(usernameOrId)) {
    return mustappById(usernameOrId);
  }
  return mustappByUsername(usernameOrId);
}

async function mustappByUsername(username: string) {
  const searched: MustappSearchUsersResponse = await got
    .post(`${apiUrl}/search`, {
      json: {
        query: username,
        types: ['users'],
      },
    })
    .json();

  const userId = searched.users[0];
  if (!userId) {
    throw new MustappSourceError(
      `No users returned by query @${username}. Maybe your account is private?`,
    );
  }

  const user = await mustappById(userId);

  if (user.uri !== username) {
    throw new MustappSourceError(`Could not find user @${username}. Closest match: @${user.uri}`);
  }

  return user;
}

function mustappById(id: number): Promise<MustappUserByIdResponseIncomplete> {
  return got(`${apiUrl}/users/id/${id}`).json();
}

function isId(usernameOrId: string | number): usernameOrId is number {
  return Number.isInteger(Number(usernameOrId));
}

class MustappSourceError extends Error {}
