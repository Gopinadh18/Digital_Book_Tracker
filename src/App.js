import './App.css'
import { ClipLoader } from 'react-spinners'
import { useEffect, useState } from 'react'

function App() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState(null)

 
  const fetchBooks = async (query) => {
    if (!query) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`https://openlibrary.org/search.json?title=${query}`)
      if (!res.ok) throw new Error('Failed to fetch data')
      const data = await res.json()
      setBooks(data.docs)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

 
  const onChangeInput = (event) => {
    setSearchTerm(event.target.value)
  }

  
  const onSearchSubmit = (e) => {
    e.preventDefault()
    fetchBooks(searchTerm)
  }

  
  useEffect(() => {
    fetchBooks('Science')
  }, [])

  return (
    <div className="App">
      <h1 className="book-finder-heading">Book Finder App</h1>

      {/* Search Bar */}
      <form onSubmit={onSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search by Title..."
          className="input"
          value={searchTerm}
          onChange={onChangeInput}
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {/* Loading, Error, and Books Display */}
      <div className="books-grid">
        {loading ? (
          <ClipLoader color="#123abc" loading={true} size={50} />
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : books.length === 0 ? (
          <p className="no-books-text">No Books Available</p>
        ) : (
          books.map((book, index) => (
            <div className="Card" key={book.key || index}>
              <div className="book-container">
                <img
                  src={
                    book.cover_edition_key
                      ? `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`
                      : 'https://via.placeholder.com/150x200?text=No+Cover'
                  }
                  alt={book.title}
                  className="image"
                />
                <h2 className="title">Title: {book.title}</h2>
                <h3 className="author">
                  {book.author_name ? book.author_name.join(', ') : 'Unknown Author'}
                </h3>
                <p><strong>First Published:</strong> {book.first_publish_year || 'N/A'}</p>
                <p><strong>Books Count:</strong> {book.edition_count || 'N/A'}</p>
                <p><strong>Language:</strong> {book.language ? book.language.join(', ') : 'N/A'}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
