const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { stringify } = require('csv-stringify');

const inputFilePath = path.join(__dirname, 'public', 'volunteer-opportunities.csv');
const outputFilePath = path.join(__dirname, 'public', 'updated-volunteer-opportunities.csv');

const categoryKeywords = {
  'Education': ['Literacy', 'Tutor', 'Teacher', 'College Prep', 'ESL', 'Science', 'Education', 'Math'],
  'Arts and Crafts': ['Arts', 'Crafts', 'Create Birthday Cards', 'Decorate Costumes', 'Art', 'Dance'],
  'Sports and Recreation': ['Soccer', 'Basketball', 'Swim', 'Recreational', 'Coach', 'Yoga', 'Zumba'],
  'Animal Care': ['Animal', 'Foster', 'Therapy', 'Horses', 'Pets'],
  'Health and Well-Being': ['Health', 'Wellness', 'Therapist', 'Mental Health', 'Crisis', 'Hospice', 'EMT', "Seniors"],
  'Community and Outreach': ['Community', 'Serve Dinner', 'Hunger', 'Greeter', 'Outreach', 'Response Team', 'Event', 'Coordinator', 'Community Organizer'],
  'Administrative and Support Roles': ['Administrative', 'Admin', 'Desk', 'Assistant'],
  'Board and Leadership Roles': ['Board Member', 'Fundraiser', 'Leadership'],
  'Environment': ['Environment', 'Restoration', 'Cleanup', 'Farming'],
  'Creative and Media': ['Photographer', 'Videographer', 'Creative Director', 'Graphic Designer', 'Social Media'],
  'Mentoring and Guidance': ['Mentor', 'Guidance', 'Creative Lab'],
  'Special Needs and Disabilities': ['Special Needs', 'Disabilities', 'GALLOP'],
  'Legal and Advocacy': ['Court', 'Citizenship', 'Legal', 'Advocacy'],
};

function categorizeOpportunity(opportunityID) {
  const opportunityIDLower = opportunityID.toLowerCase();
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (opportunityIDLower.includes(keyword.toLowerCase())) {
        return { category, keyword };
      }
    }
  }
  return null;
}

function processCsv() {
  const entries = [];

  fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on('data', (row) => {
      const opportunityID = row['opportunity_id'];
      const currentCategory = row['Category Description'];
      const { category: newCategory, keyword } = categorizeOpportunity(opportunityID) || {};

      let updatedCategory = currentCategory;
      if (newCategory) {
        updatedCategory = newCategory;
      }

      row['Category Description'] = updatedCategory;
      row['Keyword'] = keyword || ''; 

      entries.push(row);
    })
    .on('end', () => {
      console.log('CSV file successfully processed.');

      stringify(entries, { header: true }, (err, output) => {
        if (err) {
          console.error('Error writing CSV:', err);
          return;
        }

        fs.writeFileSync(outputFilePath, output);
        console.log(`Updated CSV file written to ${outputFilePath}`);
      });
    });
}

processCsv();
