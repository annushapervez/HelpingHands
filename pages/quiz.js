import Head from 'next/head';
import Navbar from '../components/Navbar'; // Import the Navbar component
import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Quiz.module.css';

export default function Quiz() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const router = useRouter();

  const categories = [
    'Education',
    'Health and Well-Being',
    'Environment',
    'Arts and Crafts',
    'Sports and Recreation',
    'Animal Care',
    'Community and Outreach',
    'Administrative and Support Roles',
    'Board and Leadership Roles',
    'Creative and Media',
    'Mentoring and Guidance',
    'Special Needs and Disabilities',
    'Legal and Advocacy'
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Navigate to the next page with selected categories
    router.push({
      pathname: '/keywords', // New page for displaying keywords
      query: { categories: JSON.stringify(selectedCategories) }
    });
  };

  return (
    <div className={styles.container}>
      <Navbar /> {/* Use the Navbar component */}
      <main className={styles.main}>
        <h1 className={styles.header}>Choose Your Interests</h1>
        <form className={styles.quizForm} onSubmit={handleSubmit}>
          <fieldset className={styles.fieldset}>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`${styles.optionButton} ${
                  selectedCategories.includes(category) ? styles.selected : ''
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))}
          </fieldset>
          <button type="submit" className={styles.submitButton}>Next</button>
        </form>
      </main>
    </div>
  );
}
