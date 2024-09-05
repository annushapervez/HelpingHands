import { useRouter } from 'next/router';
import Navbar from '../components/Navbar'; // Import the Navbar component

import { useEffect, useState } from 'react';
import styles from '../styles/Keywords.module.css'; // Create a new CSS file for this page

const sampleEntries = [
  { category: 'Education', keywords: ['Literacy', 'Tutor', 'Teacher', 'College Prep', 'ESL', 'Science', 'Math'] },
  { category: 'Arts and Crafts', keywords: ['Create Birthday Cards', 'Decorate Costumes', 'Dance'] },
  { category: 'Sports and Recreation', keywords: ['Soccer', 'Basketball', 'Swim', 'Coach', 'Yoga', 'Zumba'] },
  { category: 'Animal Care', keywords: ['Foster', 'Therapy', 'Horses', 'Pets'] },
  { category: 'Health and Well-Being', keywords: ['Health', 'Wellness', 'Therapist', 'Mental Health', 'Crisis', 'Hospice', 'EMT', 'Seniors'] },
  { category: 'Community and Outreach', keywords: ['Community', 'Serve Dinner', 'Hunger', 'Greeter', 'Outreach', 'Response Team', 'Event', 'Coordinator', 'Community Organizer'] },
  { category: 'Administrative and Support Roles', keywords: ['Administrative', 'Admin', 'Desk', 'Assistant'] },
  { category: 'Board and Leadership Roles', keywords: ['Board Member', 'Fundraiser', 'Leadership'] },
  { category: 'Environment', keywords: ['Environment', 'Restoration', 'Cleanup', 'Farming'] },
  { category: 'Creative and Media', keywords: ['Photographer', 'Videographer', 'Creative Director', 'Graphic Designer', 'Social Media'] },
  { category: 'Mentoring and Guidance', keywords: ['Mentor', 'Guidance', 'Creative Lab'] },
  { category: 'Special Needs and Disabilities', keywords: ['Special Needs', 'Disabilities', 'GALLOP'] },
  { category: 'Legal and Advocacy', keywords: ['Court', 'Citizenship', 'Legal', 'Advocacy'] },
];

export default function Keywords() {
  const router = useRouter();
  const { categories } = router.query;
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);

  useEffect(() => {
    if (categories) {
      const selectedCategories = JSON.parse(categories);
      // Filter entries based on the selected categories
      const entries = sampleEntries.filter(entry => selectedCategories.includes(entry.category));
      setFilteredEntries(entries);
    }
  }, [categories]);

  const handleKeywordClick = (keyword) => {
    // Add or remove the keyword from selectedKeywords
    setSelectedKeywords(prevKeywords =>
      prevKeywords.includes(keyword)
        ? prevKeywords.filter(k => k !== keyword)
        : [...prevKeywords, keyword]
    );
  };

  const handleNext = () => {
    // Navigate to the location page with selected categories and keywords
    const query = {
      categories: JSON.stringify(router.query.categories),
      keywords: JSON.stringify(selectedKeywords),
    };
    router.push({ pathname: '/location', query });
  };

  return (
    <div className={styles.container}>
      <Navbar /> {/* Use the Navbar component */}

      <main className={styles.main}>
        <h1 className={styles.header}>Select Your Interests Further</h1>
        {filteredEntries.map((entry, index) => (
          <div key={index} className={styles.categorySection}>
            <h2 className={styles.categoryTitle}>{entry.category}</h2>
            <div className={styles.keywords}>
              {entry.keywords.map((keyword, idx) => (
                <button
                  key={idx}
                  className={`${styles.keywordButton} ${selectedKeywords.includes(keyword) ? styles.selected : ''}`}
                  onClick={() => handleKeywordClick(keyword)}
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button className={styles.nextButton} onClick={handleNext}>
          Next
        </button>
      </main>
    </div>
  );
}
