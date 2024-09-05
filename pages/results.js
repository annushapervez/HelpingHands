import Head from 'next/head';
import Navbar from '../components/Navbar'; // Import the Navbar component
import { useRouter } from 'next/router';
import styles from '../styles/Results.module.css'; // Your CSS file
import { parse } from 'csv-parse/sync'; // Correct import syntax

export default function Results({ csvData }) {
  const router = useRouter();
  const { categories, keywords, latitude, longitude } = router.query;
  const selectedCategories = JSON.parse(categories || '[]');
  const selectedKeywords = JSON.parse(keywords || '[]');

  // Convert latitude and longitude to numbers
  const userLat = parseFloat(latitude);
  const userLng = parseFloat(longitude);

  // Filter entries based on selected categories and keywords
  const filteredEntries = csvData.filter((entry) => {
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(entry.category);
    const keywordMatch =
      selectedKeywords.length === 0 ||
      entry.keywords.some((keyword) =>
        selectedKeywords.includes(keyword)
      );
    return categoryMatch && keywordMatch;
  });

      const uniqueKey = entry => `${entry.title.trim()}-${entry.summary.trim()}`;
  
      const uniqueEntries = Array.from(new Set(filteredEntries.map(entry => uniqueKey(entry))))
        .map(key => {
          return filteredEntries.find(entry => uniqueKey(entry) === key);
        });

  // Calculate distance between user and entry locations using the Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (deg) => (deg * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  // Sort entries by distance
  const sortedEntries = uniqueEntries
    .map((entry) => {
      // Assuming your CSV contains the latitude and longitude for each entry
      const entryLat = parseFloat(entry.latitude);
      const entryLng = parseFloat(entry.longitude);

      // Calculate distance if lat/lng is available
      const distance =
        userLat && userLng
          ? calculateDistance(userLat, userLng, entryLat, entryLng)
          : Infinity; // Set distance to Infinity if no user location is available

      return { ...entry, distance };
    })
    .sort((a, b) => a.distance - b.distance);

    return (
        <div className={styles.container}>
        <Navbar /> {/* Use the Navbar component */}
          <main className={styles.main}>
            <h1 className={styles.header}>Filtered Results</h1>
            {sortedEntries.length === 0 ? (
              <p>No results found</p>
            ) : (
              sortedEntries.map((entry, index) => (
                <div key={index} className={styles.entrySection}>
                  <h2 className={styles.categoryTitle}>{entry.title}</h2>
                  <p>{entry.summary}</p>
                  <p>
                    <a href={entry.website} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  </p>
                  <p>{entry.streetAddress}</p>
                  <p>{entry.city}, {entry.state} {entry.postcode}</p>
                  <p>Distance: {entry.distance.toFixed(2)} km</p>
                  <div className={styles.keywords}>
                    {entry.keywords.map((keyword, idx) => (
                      <button key={idx} className={styles.keywordButton}>
                        {keyword}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </main>
        </div>
      );
    }

// Fetch CSV data at build time
export async function getStaticProps() {
  const fs = require('fs'); // Import fs module server-side
  const path = require('path'); // Import path module for resolving file paths

  const filePath = path.join(process.cwd(), 'public', 'updated-volunteer-opportunities.csv'); // Adjust the path to your CSV file
  const fileContent = fs.readFileSync(filePath, 'utf-8'); // Read the CSV file content
  const csvData = parseCSV(fileContent); // Parse CSV content into an array of objects

  return {
    props: {
      csvData, // Pass the CSV data to the page component as props
    },
  };
}

// Function to parse CSV content into an array of objects
function parseCSV(csvContent) {
  try {
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    return records.map((record) => ({
      requirements: record.Requirements,
      opportunity_id: record.opportunity_id,
      content_id: record['content_id:'],
      summary: record.Summary,
      category: record['Category Description'],
      title: record.Title,
      website: record.Website,
      streetAddress: record['Street Address'],
      city: record.City,
      state: record.State,
      postcode: record.Postcode,
      latitude: record.Latitude, // Ensure the latitude is available in the CSV
      longitude: record.Longitude, // Ensure the longitude is available in the CSV
      keywords: record.Keyword
        ? record.Keyword.split(',').map((kw) => kw.trim())
        : [],
    }));
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return [];
  }
}
