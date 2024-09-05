const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const filePath = path.join(__dirname, 'public/uszips.csv');

const csvWriter = createCsvWriter({
  path: filePath,
  header: [
    { id: 'zip', title: 'zip' },
    { id: 'lat', title: 'lat' },
    { id: 'lng', title: 'lng' },
    { id: 'city', title: 'city' },
    { id: 'state_id', title: 'state_id' }
  ]
});

const records = [];

fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', (row) => {
    if (row.state_id === 'NY') { 
      records.push({
        zip: row.zip,
        lat: row.lat,
        lng: row.lng,
        city: row.city,
        state_id: row.state_id
      });
    }
  })
  .on('end', () => {
    csvWriter.writeRecords(records)
      .then(() => console.log('CSV file was updated successfully.'));
  });
