import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { Opportunity } from '../types/types';

export function parseCSV(filePath: string): Promise<Opportunity[]> {
  return new Promise((resolve, reject) => {
    const results: Opportunity[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data as Opportunity))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}