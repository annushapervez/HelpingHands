// pages/api/zipcodes.js
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const filePath = path.join(process.cwd(), 'public', 'uszips.csv');

export default async function handler(req, res) {
  const { zipCode } = req.query;

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const records = parse(fileContent, { columns: true, skip_empty_lines: true });

    const result = records.find(record => record.zip === zipCode);

    if (result) {
      res.status(200).json({
        lat: result.lat,
        lng: result.lng,
        city: result.city,
        state_id: result.state_id
      });
    } else {
      res.status(404).json({ error: 'Zip code not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error reading the file' });
  }
}
