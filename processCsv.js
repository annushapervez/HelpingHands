const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { stringify } = require('csv-stringify');

// Define file paths
const inputFilePath = path.join(__dirname, 'public', 'volunteer-opportunities.csv');
const outputFilePath = path.join(__dirname, 'public', 'updated-volunteer-opportunities.csv');

// Define category mapping based on keywords in the Opportunity ID
const categoryKeywords = {
  'Education and Tutoring': [
    'Literacy', 'Tutor', 'Teacher', 'College Prep', 'ESL', 'Science', 'Math'
  ],
  'Arts and Crafts': [
    'Arts', 'Crafts', 'Create Birthday Cards', 'Decorate Costumes', 'Dance'
  ],
  'Sports and Recreation': [
    'Soccer', 'Basketball', 'Swim', 'Recreational', 'Coach', 'Yoga', 'Zumba'
  ],
  'Animal Care': [
    'Animal', 'Foster', 'Therapy', 'Horses', 'Pets'
  ],
  'Health and Wellness': [
    'Health', 'Wellness', 'Therapist', 'Mental Health', 'Crisis', 'Hospice', 'EMT'
  ],
  'Community and Outreach': [
    'Community', 'Serve Dinner', 'Hunger', 'Greeter', 'Outreach', 'Response Team'
  ],
  'Administrative and Support Roles': [
    'Administrative', 'Admin', 'Desk', 'Assistant'
  ],
  'Board and Leadership Roles': [
    'Board Member', 'Fundraiser', 'Leadership'
  ],
  'Environmental and Restoration': [
    'Environment', 'Restoration', 'Cleanup', 'Farming'
  ],
  'Creative and Media': [
    'Photographer', 'Videographer', 'Creative Director', 'Graphic Designer'
  ],
  'Mentoring and Guidance': [
    'Mentor', 'Guidance', 'Creative Lab'
  ],
  'Special Needs and Disabilities': [
    'Special Needs', 'Disabilities', 'GALLOP'
  ],
  'Legal and Advocacy': [
    'Court', 'Citizenship', 'Legal', 'Advocacy'
  ],
  'Event Coordination': [
    'Event', 'Coordinator'
  ],
  'Miscellaneous Opportunities': [
    'After-School', 'Community Organizer', 'Family Fun'
  ]
};

// Function to find the best category and keyword for a given opportunity ID
function categorizeOpportunity(opportunityID) {
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (opportunityID.includes(keyword)) {
        return { category, keyword };
      }
    }
  }
  return null;
}

// Function to process CSV and update categories
function processCsv() {
  const entries = [];

  fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on('data', (row) => {
      const opportunityID = row['opportunity_id'];
      const currentCategory = row['Category Description'];
      const { category: newCategory, keyword } = categorizeOpportunity(opportunityID) || {};

      // Determine the updated category description
      // Preserve existing categories, and only add new keywords and overarching categories if none exists
      let updatedCategory = currentCategory;
      if (!currentCategory && newCategory) {
        updatedCategory = newCategory; // Add new overarching category only if there's no existing category
      }

      // Add the updated category and keyword to the row
      row['Category Description'] = updatedCategory;
      row['Keyword'] = keyword || ''; // Add keyword if found

      entries.push(row);
    })
    .on('end', () => {
      console.log('CSV file successfully processed.');

      // Write the updated data to a new CSV file
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

// Call the function to process the CSV
processCsv();
