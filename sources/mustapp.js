// @ts-check
import got from 'got';

const baseUrl = 'https://mustapp.com';
const apiUrl = `${baseUrl}/api`;

export function getMustappUser(
  /** @type {number | string} */
  usernameOrId,
) {
  if (isId(usernameOrId)) {
    return mustappById(usernameOrId);
  }
  return mustappByUsername(usernameOrId);
}
export default getMustappUser;

export async function mustappByUsername(
  /** @type {string} */
  username,
) {
  /** @type {MustappSearchUsersResponse} */
  const searched = await got
    .post(`${apiUrl}/search`, {
      json: {
        query: username,
        types: ['users'],
      },
    })
    .json();

  const userId = searched.users[0];

  const user = await mustappById(userId);

  if (user.uri !== username) {
    throw new MustappSourceError(`Could not find user @${username}. Closest match: @${user.uri}`);
  }

  return user;
}

/** @returns {Promise<MustappUserByIdResponseIncomplete>} */
export function mustappById(
  /** @type {number} */
  id,
) {
  return got(`${apiUrl}/users/id/${id}`).json();
}

/** @returns {usernameOrId is number} */
function isId(
  /** @type {string | number} */
  usernameOrId,
) {
  return Number.isInteger(Number(usernameOrId));
}

class MustappSourceError extends Error {}
