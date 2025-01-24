import { exec } from 'child_process';
import { promises as fs } from 'fs';
import { promisify } from 'util';

const execAsync = promisify(exec);

type HistoryPoint = { date: number; content: Record<string, number> };
type HistoryFileFormat = HistoryPoint[];

// Function to run shell commands asynchronously
async function runCommand(command: string): Promise<string> {
  const { stdout } = await execAsync(command);
  return stdout.trim();
}

// Function to get all versions of data.json since the last run
async function getDataJsonVersions(
  repoPath: string,
  historyFilePath: string,
): Promise<HistoryFileFormat> {
  let lastProcessedDate = 0;

  // Read the last processed timestamp from the history file, if it exists
  try {
    const historyData: HistoryFileFormat = JSON.parse(await fs.readFile(historyFilePath, 'utf8'));
    if (Array.isArray(historyData) && historyData.length > 0) {
      lastProcessedDate = historyData[historyData.length - 1]!.date;
    }
  } catch {
    console.log(`No history file found at ${historyFilePath}. Processing all commits.`);
  }

  console.log(`Last processed date: ${new Date(lastProcessedDate).toISOString()}`);

  // Get all commits that modified data.json
  const logOutput = await runCommand(
    `git -C ${repoPath} log --format="%H %ad" --date=iso -- data.json`,
  );

  const commits = logOutput.split('\n').map((line) => {
    const [hash, ...dateParts] = line.split(' ');
    const date = Number(new Date(dateParts.join(' ')));
    return { hash, date };
  });

  // Filter commits to only include those after the last processed date
  const newCommits = commits.filter(({ date }) => date > lastProcessedDate);

  console.log(`Found ${newCommits.length} new commits.`);

  // Fetch the contents of data.json for new commits concurrently
  const versions = await Promise.all(
    newCommits.map(async ({ hash, date }) => {
      try {
        const contents = await runCommand(`git -C ${repoPath} show ${hash}:data.json`);
        return { date: date, content: JSON.parse(contents) } satisfies HistoryPoint;
      } catch (error) {
        console.error(`Error fetching data.json for commit ${hash}:`, error);
        return null;
      }
    }),
  );

  return versions.filter((version): version is HistoryPoint => version !== null);
}

// Function to merge new versions with the history file
async function updateHistoryFile(
  newVersions: HistoryFileFormat,
  historyFilePath: string,
): Promise<void> {
  let existingHistory: HistoryFileFormat = [];

  try {
    const historyContent = await fs.readFile(historyFilePath, 'utf8');
    existingHistory = JSON.parse(historyContent);
  } catch {
    console.log(`Creating new history file at ${historyFilePath}.`);
  }

  const updatedHistory = [...existingHistory, ...newVersions].sort((a, b) => a.date - b.date);

  await fs.writeFile(historyFilePath, JSON.stringify(updatedHistory, null, 2));
}

// Example usage
(async () => {
  const repoPath = './'; // Path to your Git repository
  const historyFilePath = 'dataHistory.json'; // History file path

  try {
    const newVersions = await getDataJsonVersions(repoPath, historyFilePath);
    await updateHistoryFile(newVersions, historyFilePath);
    console.log(`Processed ${newVersions.length} new versions of data.json.`);
  } catch (error) {
    console.error('Error during execution:', error);
  }
})();
