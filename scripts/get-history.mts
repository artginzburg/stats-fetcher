/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

getHistoryForStats();

// type Stat = {
//   githubDownloads?: number;
//   wakatimeMinutes?: number;
//   npmDownloads?: number;
//   mustappHours?: number;
// };

export async function getHistoryForStats() {
  const stdout = await getHistory('data.json');
  const parsedStdout = parseStdOutForGitLogOneFile(stdout);

  console.log(parsedStdout);

  return parsedStdout;
}

export async function getHistory(file: string) {
  const { stdout } = await execPromise(`git log -p -- ${file}`);

  return stdout;
}

function parseStdOutForGitLogOneFile(stdout: string) {
  const datesInput = new StdOutInput(
    'date',
    'Date: {3}',
    (dateString: string) => new Date(dateString),
    function matcher() {
      return `${this.replacer}(.*)` as const;
    },
    stdout,
  );
  const addedChangesInput = new StdOutInput(
    'stats',
    '^\\+',
    // eslint-disable-next-line no-unused-vars
    JSON.parse as (text: string) => object | null,
    function matcher() {
      return `${this.replacer}{(.*)` as const;
    },
    stdout,
  );

  if (!(datesInput.processed && addedChangesInput.processed)) {
    throw new Error("Couldn't parse historical data");
  }
  if (!(datesInput.processed.length === addedChangesInput.processed.length)) {
    throw new Error('Parsed data is inconsistent (dates quantity is different from data quantity)');
  }

  const outputAsArray = datesInput.processed.map((dateProcessed, dateProcessedIndex) => ({
    [datesInput.name]: dateProcessed,
    [addedChangesInput.name]: addedChangesInput.processed![dateProcessedIndex],
  }));

  return outputAsArray;
}

class StdOutInput<
  Name extends string,
  // eslint-disable-next-line no-unused-vars
  Matcher extends string | ((this: StdOutInput<Name, Matcher, Replacer, Parser>) => string),
  Replacer extends string,
  // eslint-disable-next-line no-unused-vars
  Parser extends (text: string) => unknown,
> {
  public processed: ReturnType<Parser>[] | undefined;

  constructor(
    // eslint-disable-next-line no-unused-vars
    public name: Name,
    // eslint-disable-next-line no-unused-vars
    public replacer: Replacer,
    // eslint-disable-next-line no-unused-vars
    public parser: Parser,
    // eslint-disable-next-line no-unused-vars
    public matcher: Matcher,
    public stdout?: string,
  ) {
    if (stdout) {
      this.processed = this.process(stdout);
    }
  }

  process(stdout: string) {
    if (!this.matcher) return undefined;

    const matcherAsRegExp = new RegExp(
      typeof this.matcher === 'string' ? this.matcher : this.matcher(),
      'gm',
    );
    const matches = stdout.match(matcherAsRegExp);

    const replacerAsRegExp = new RegExp(this.replacer);

    return matches?.map((match) => {
      const replaced = match.replace(replacerAsRegExp, '');
      const parsed = this.parser(replaced) as ReturnType<Parser>;
      return parsed;
    });
  }
}
