import Head from 'next/head';
import Navbar from '../components/Navbar'; // Import the Navbar component
import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Location.module.css'; // Your CSS file

export default function Location() {
  const [zipCode, setZipCode] = useState('');
  const [locationError, setLocationError] = useState('');
  const [apiError, setApiError] = useState('');
  const router = useRouter();

  // Extract keywords and categories from the query
  const { keywords, categories } = router.query;

  const handleZipCodeChange = (e) => setZipCode(e.target.value);

  const handleLocationSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    console.log('Zip Code when using location:', zipCode); // Debugging line

    // Redirect to results page with location parameters and the existing keywords and categories
    router.push({
      pathname: '/results',
      query: { latitude, longitude, zipCode, keywords, categories },
    });
  };

  const handleLocationError = (error) => {
    setLocationError('Unable to retrieve location.');
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationError);
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    try {
      // Fetch coordinates from the API route
      const response = await fetch(`/api/zipcodes?zipCode=${zipCode}`);
      if (!response.ok) {
        throw new Error('Zip code not found');
      }

      const data = await response.json();
      const { lat, lng } = data;

      // Redirect to results page with coordinates and the existing keywords and categories
      router.push({
        pathname: '/results',
        query: { latitude: lat, longitude: lng, zipCode, keywords, categories },
      });
    } catch (error) {
      setApiError('Error fetching coordinates. Please check the zip code.');
    }
  };

  return (
    <div className={styles.container}>
       <Navbar /> {/* Use the Navbar component */}

      <main className={styles.main}>
        <h1 className={styles.header}>Enter Your Location</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="zipCode">Zip Code:</label>
            <input
              type="text"
              id="zipCode"
              value={zipCode}
              onChange={handleZipCodeChange}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Get Results by Zip Code
          </button>
        </form>
        <button onClick={handleLocationClick} className={styles.locationButton}>
          Use My Location
        </button>
        {locationError && <p className={styles.error}>{locationError}</p>}
        {apiError && <p className={styles.error}>{apiError}</p>}
      </main>
    </div>
  );
}
