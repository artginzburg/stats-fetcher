import path from 'path';
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';

export async function GET(req: Request, res: Response) {
  //Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), '../scripts/data');
  //Read the json data file data.json
  const fileContents = await fs.readFile(jsonDirectory + '/history.json', 'utf8');
  //Return the content of the data file in json format
  // res.status(200).json(fileContents);
  return NextResponse.json(JSON.parse(fileContents));
}
