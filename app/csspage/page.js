'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [displayedImageUrl, setDisplayedImageUrl] = useState(''); // Store the currently displayed image
  const [storedUrls, setStoredUrls] = useState([]);
  const [error, setError] = useState('');
  const [imageIndex, setImageIndex] = useState(0); // Start with the first image
  const [searchTerm, setSearchTerm] = useState(''); // Search term state for filtering
  const [filteredUrls, setFilteredUrls] = useState([]); // To store filtered media items

  // List of images for sequential selection
  const imageUrls = [
    {url: '/cssimage.png', link:'https://en.wikipedia.org/wiki/CSS'},
    //{url: '/Data Fetching.png', link:'https://nextjs.org/docs/app/building-your-application/data-fetching'},
    //{url:'/Server Actions.png', link:'https://nextjs.org/docs/app/building-your-application/data-fetching/forms-and-mutations'},
    // '/jakeymoo.JPG',
  ];

  // Define size mapping for each image
  const imageSizes = {
    '/cssimage.png': { width: 100, height: 100 },
    //'/Data Fetching.png': { width: 350, height: 110 },
    //'/Server Actions.png': { width: 350, height: 110 },
    // Add other images and their dimensions if needed
  };

  // Function to get image size based on the image name
  const getImageSize = (imageName) => {
    return imageSizes[imageName] || { width: 100, height: 100 }; // Default size if not found
  };

  // Function to select the next image sequentially
  const selectNextImage = () => {
    setImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length); // Increment and wrap around
  };

  // Detect when the <details> is toggled (expanded)
  const handleToggle = (event) => {
    if (event.target.open) {
      selectNextImage(); // Select the next sequential image when expanded
    }
  };

  const getContentType = (url) => {
    const extension = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return 'image';
    } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
      return 'video';
    } else {
      return 'webpage';
    }
  };

  const fetchUrls = async () => {
    const res = await fetch('/api/urlcss');
    const data = await res.json();
    setStoredUrls(data.urls);
    setFilteredUrls(data.urls); // Initialize filteredUrls with the full list
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      setError('Please enter a title.');
      return;
    }

    if (!url) {
      setError('Please enter a URL.');
      return;
    }

    const res = await fetch('/api/urlcss', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, title }),
    });

    if (res.ok) {
      setUrl('');
      setTitle('');
      setError('');
      fetchUrls();
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch('/api/urlcss', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      fetchUrls();
    }
  };

  const handleImageClick = (storedUrl) => {
    const contentType = getContentType(storedUrl.url);

    if (contentType === 'image') {
      setDisplayedImageUrl(storedUrl.url); // Update displayed image if it's an image
    } else {
      setDisplayedImageUrl(''); // Clear displayed image for non-image URLs
    }
  };

  const renderPreview = (storedUrl) => {
    const contentType = getContentType(storedUrl.url);

    switch (contentType) {
      case 'image':
        return (
          <Image
            src={storedUrl.url}
            alt={storedUrl.title}
            style={styles.previewImage}
            onClick={() => handleImageClick(storedUrl)} // Clickable for images
          />
        );
      case 'video':
        return (
          <div style={styles.videoContainer}>
            <video controls style={styles.previewVideo}>
              <source src={storedUrl.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      default:
        return (
          <div style={styles.webpagePreview}>
            <p>{storedUrl.title}</p>
            <a href={storedUrl.url} target="_blank" rel="noopener noreferrer" style={styles.previewLink}>
              Open Website
            </a>
          </div>
        );
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter the storedUrls based on search term
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredUrls(storedUrls); // Reset to full list when search is empty
    } else {
      const filtered = storedUrls.filter((storedUrl) =>
        storedUrl.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUrls(filtered); // Set filtered URLs
    }
  }, [searchTerm, storedUrls]);

  // Handle reset search
  const handleReset = () => {
    setSearchTerm(''); // Clear search input
    setFilteredUrls(storedUrls); // Reset to full list
  };

  return (
    <div style={styles.container}>
      <div style={{ marginTop: '10px', marginBottom: '20px', fontWeight: 'lighter' }}>
        <p>
            <Link href='/'><span className='link'>Next.js</span></Link>
            <Link href='/htmlpage'><span className='link'>HTML</span></Link>
            <Link href='/csspage'><span className='link'>CSS</span></Link>
            <Link href='/javascriptpage'><span className='link'>JavaScript</span></Link> {/* Added href */}
            <Link href='/reactpage'><span className='link'>React</span></Link> {/* Added href */}
        </p>
      </div>
      <h2 style={styles.title}>LWJ&apos;s <span style={{fontSize:'1.7rem', color:'grey'}}>CSS</span> Media Repository</h2>
      <details onToggle={handleToggle} style={{ textAlign: 'left', marginBottom: '10px' }}>
        <summary style={{ color: 'grey', cursor: 'pointer', fontFamily: 'arial', fontSize: '1rem' }}>
          CSS 🖥️
        </summary>
        <div style={{ marginLeft: '0px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Link to the URL associated with the current image */}
          <a href={imageUrls[imageIndex].link} target="_blank" rel="noopener noreferrer">
            <Image
              className='uk-pic'
              src={imageUrls[imageIndex].url} // Use the sequential image URL
              alt="Portfolio Image"
              width={getImageSize(imageUrls[imageIndex].url).width} // Dynamically set width
              height={getImageSize(imageUrls[imageIndex].url).height} // Dynamically set height
              priority={true}
              style={{
                marginLeft: '5px',
                marginRight: '5px',
                marginBottom: '15px',
                borderRadius: '10px',
                border: '2px solid black',
              }}
            />
          </a>
        </div>
      </details>

      {displayedImageUrl && (
        <Image
          src={displayedImageUrl}
          alt="Displayed Media"
          style={styles.image}
        />
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Enter a title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Enter media URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}

        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
          <button type="submit" style={styles.button}>Add Media</button>
        </div>
      </form>

      {/* Search functionality */}
      <input className='search-input'
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={styles.input}
      />
      <button onClick={handleReset} style={styles.resetbutton}>Reset</button>

      <div style={{marginTop:'25px'}}>
        <h2 style={styles.subtitle}>Stored Media:</h2>
        <ul style={styles.urlList}>
          {filteredUrls.map((storedUrl) => (
            <li key={storedUrl._id} style={styles.urlItem}>
              <div style={styles.previewContainer}>
                {renderPreview(storedUrl)}
                <button
                  onClick={() => handleDelete(storedUrl._id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '0 20px',
    textAlign: 'left',
  },
  title: {
    fontSize: '1.4rem',
    marginTop:'10px',
    marginBottom: '10px',
    textAlign:'left',
    color:'grey',
  },
  subtitle: {
    fontSize: '1.4rem',
    marginTop:'10px',
    marginBottom: '10px',
    textAlign:'left',
    color:'grey',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    width: '100%',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize:'17px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  resetbutton:{
    padding: '10px 20px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  image: {
    width: '100%',
    maxHeight: '400px',
    objectFit: 'contain',
    marginBottom: '20px',
  },
  previewImage: {
    width: '100%',
    maxHeight: '200px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginBottom: '10px',
    cursor: 'pointer', // Change cursor to pointer
  },
  previewVideo: {
    width: '100%',
    maxHeight: '200px',
    borderRadius: '4px',
    marginBottom: '10px',
  },
  webpagePreview: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '10px',
    textAlign: 'left',
  },
  previewLink: {
    color: '#0070f3',
    textDecoration: 'none',
  },
  urlList: {
    listStyleType: 'none',
    padding: 0,
    marginTop: '10px',
  },
  urlItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #eaeaea',
    wordBreak: 'break-word',
  },
  previewContainer: {
    display: 'flex',
    flexDirection: 'column', // Stack items vertically
    alignItems: 'flex-start', // Left align items
    marginBottom: '10px', // Space between items
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: 'red',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginBottom: '10px',
  },
  links: {
    color: 'grey',
    fontSize: '1rem',
    marginTop:'10',
    marginBottom: '15px',
    marginRight:'10px',
  },
};

