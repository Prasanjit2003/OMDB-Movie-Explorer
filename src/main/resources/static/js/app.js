const { useState, useEffect, useRef } = React;

// --- COMPONENTS ---

// 1. Navbar
const Navbar = ({ onSearch, onNavClick, view, goBack, goForward }) => {
    const [localQuery, setLocalQuery] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(localQuery);
        setMenuOpen(false);
    };

    return (
        <nav className="bg-gray-900/60 backdrop-blur-md border-b border-white/10 sticky top-0 z-40 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    
                    {/* Logo & Nav Controls */}
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNavClick('home')}>
                            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-gray-900 font-bold text-xl shadow-lg group-hover:bg-yellow-400 transition-colors">
                                <i className="fas fa-play"></i>
                            </div>
                            <span className="font-bold text-xl tracking-wider hidden md:block">OMDB<span className="text-yellow-500">Explorer</span></span>
                        </div>

                        {/* Browser Navigation Controls */}
                        <div className="flex items-center bg-white/10 rounded-lg p-1 border border-white/5">
                            <button 
                                onClick={goBack} 
                                className="w-8 h-8 rounded flex items-center justify-center transition-colors text-gray-300 hover:bg-white/20 hover:text-white"
                                title="Go Back"
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <button 
                                onClick={goForward} 
                                className="w-8 h-8 rounded flex items-center justify-center transition-colors text-gray-300 hover:bg-white/20 hover:text-white"
                                title="Go Forward"
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Controls (Favorites + Menu) */}
                    <div className="md:hidden flex items-center gap-3">
                        <button 
                            onClick={() => onNavClick('favorites')}
                            className={`p-2 rounded-full transition-colors ${view === 'favorites' ? 'text-yellow-500 bg-yellow-500/10' : 'text-gray-300 hover:text-white'}`}
                            title="Favorites"
                        >
                            <i className={`${view === 'favorites' ? 'fas' : 'far'} fa-heart text-xl`}></i>
                        </button>

                        <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-300 hover:text-white p-2">
                            <i className={`fas ${menuOpen ? 'fa-times' : 'fa-search'}`}></i>
                        </button>
                    </div>

                    {/* Desktop Search & Favorites */}
                    <div className="hidden md:flex items-center gap-4">
                        <form onSubmit={handleSearch} className="relative">
                            <input 
                                type="text" 
                                value={localQuery}
                                onChange={(e) => setLocalQuery(e.target.value)}
                                placeholder="Find movies..." 
                                className="bg-black/30 border border-white/10 text-gray-200 text-sm rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-yellow-500 focus:bg-black/50 transition-all placeholder-gray-400"
                            />
                            <i className="fas fa-search absolute left-3 top-2.5 text-gray-400"></i>
                        </form>

                        <button 
                            onClick={() => onNavClick('favorites')}
                            className={`relative p-2 rounded-full transition-colors ${view === 'favorites' ? 'text-yellow-500 bg-yellow-500/10' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                            title="Favorites"
                        >
                            <i className="fas fa-heart text-xl"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {menuOpen && (
                <div className="md:hidden bg-gray-900/95 border-b border-gray-800 p-4 absolute w-full backdrop-blur-xl animate-fade-in-up">
                    <form onSubmit={handleSearch}>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={localQuery}
                                onChange={(e) => setLocalQuery(e.target.value)}
                                placeholder="Search movies..." 
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                                autoFocus
                            />
                            <i className="fas fa-search absolute left-3 top-3.5 text-gray-500"></i>
                        </div>
                    </form>
                </div>
            )}
        </nav>
    );
};

// 2. Custom Share Modal
const ShareModal = ({ isOpen, onClose, title, text, url }) => {
    if (!isOpen) return null;

    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);
    const encodedTitle = encodeURIComponent(title);

    const copyToClipboard = async () => {
        const fullText = `${text} ${url}`;
        try {
            await navigator.clipboard.writeText(fullText);
            alert("Link copied!");
        } catch (e) {
            const textArea = document.createElement("textarea");
            textArea.value = fullText;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert("Link copied!");
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative bg-gray-900 w-full md:w-96 rounded-t-2xl md:rounded-2xl border border-white/10 p-6 animate-pop-in shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Share via</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <i className="fas fa-times text-lg"></i>
                    </button>
                </div>
                
                <div className="grid grid-cols-4 gap-4 mb-4">
                    {/* WhatsApp */}
                    <a href={`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`} target="_blank" className="flex flex-col items-center gap-2 group">
                        <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform shadow-lg">
                            <i className="fab fa-whatsapp"></i>
                        </div>
                        <span className="text-xs text-gray-300">WhatsApp</span>
                    </a>

                    {/* Twitter */}
                    <a href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`} target="_blank" className="flex flex-col items-center gap-2 group">
                        <div className="w-14 h-14 rounded-full bg-blue-400 flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform shadow-lg">
                            <i className="fab fa-twitter"></i>
                        </div>
                        <span className="text-xs text-gray-300">X / Twitter</span>
                    </a>

                    {/* Facebook */}
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" className="flex flex-col items-center gap-2 group">
                        <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform shadow-lg">
                            <i className="fab fa-facebook-f"></i>
                        </div>
                        <span className="text-xs text-gray-300">Facebook</span>
                    </a>

                    {/* Email */}
                    <a href={`mailto:?subject=${encodedTitle}&body=${encodedText}%20${encodedUrl}`} className="flex flex-col items-center gap-2 group">
                        <div className="w-14 h-14 rounded-full bg-gray-600 flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform shadow-lg">
                            <i className="fas fa-envelope"></i>
                        </div>
                        <span className="text-xs text-gray-300">Email</span>
                    </a>
                </div>
                
                {/* Copy Link Row */}
                <div className="mt-6 pt-4 border-t border-white/10">
                     <button onClick={copyToClipboard} className="w-full flex items-center justify-between bg-gray-800 hover:bg-gray-700 p-4 rounded-xl transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-700 group-hover:bg-gray-600 flex items-center justify-center text-white">
                                <i className="fas fa-link"></i>
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-semibold text-white">Copy Link</div>
                                <div className="text-xs text-gray-400 truncate w-48">{url}</div>
                            </div>
                        </div>
                        <i className="fas fa-copy text-gray-400"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

// 3. Share Button Container
const ShareButton = ({ title, text, url }) => {
    const [showModal, setShowModal] = useState(false);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: text,
                    url: url,
                });
                return;
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setShowModal(true);
                }
            }
        } else {
            setShowModal(true);
        }
    };

    return (
        <>
            <button 
                onClick={handleShare}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-sm border border-white/10"
                title="Share"
            >
                <i className="fas fa-share-alt"></i>
            </button>
            
            <ShareModal 
                isOpen={showModal} 
                onClose={() => setShowModal(false)}
                title={title}
                text={text}
                url={url}
            />
        </>
    );
};

// 4. Movie Card
const MovieCard = ({ movie, onSelect, isFavorite, toggleFavorite }) => {
    return (
        <div className="card-hover group relative bg-gray-800/40 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 transition-all duration-300 hover:border-yellow-500/50">
            <div className="relative aspect-[2/3] overflow-hidden cursor-pointer" onClick={() => onSelect(movie)}>
                <img 
                    src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'} 
                    alt={movie.Title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                    <button className="bg-yellow-500 text-black font-bold py-2 px-6 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:bg-yellow-400">
                        View Details
                    </button>
                </div>
                
                {/* Top Buttons */}
                <div className="absolute top-2 right-2 flex gap-2 z-20">
                     <button 
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(movie); }}
                        className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-white hover:text-red-500 transition-all flex items-center justify-center"
                    >
                        <i className={`${isFavorite ? 'fas text-red-500' : 'far'} fa-heart`}></i>
                    </button>
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-white font-semibold truncate text-lg" title={movie.Title}>{movie.Title}</h3>
                <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                    <span>{movie.Year}</span>
                    <span className="bg-white/10 px-2 py-0.5 rounded text-xs text-gray-300 border border-white/5">{movie.Type}</span>
                </div>
            </div>
        </div>
    );
};

// 5. Modal
const MovieModal = ({ movie, onClose, isFavorite, toggleFavorite }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    if (!movie) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose}></div>
            
            <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl border border-white/10 animate-fade-in-up">
                <div className="absolute top-4 right-4 z-10 flex gap-3">
                     <ShareButton 
                        title={movie.Title} 
                        text={`Check out ${movie.Title} (${movie.Year})!`} 
                        url={`https://www.imdb.com/title/${movie.imdbID}`} 
                    />
                    <button 
                        onClick={onClose} 
                        className="w-10 h-10 bg-black/50 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors border border-white/10"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Poster Side */}
                <div className="w-full md:w-2/5 relative shrink-0">
                    <img 
                        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450'} 
                        className="w-full h-full object-cover md:rounded-l-2xl" 
                        alt={movie.Title}
                    />
                </div>

                {/* Info Side */}
                <div className="w-full md:w-3/5 p-8 md:p-10 flex flex-col text-left">
                    <div className="flex justify-between items-start mb-4 pr-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">{movie.Title}</h2>
                            <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-300 font-medium">
                                <span className="border border-gray-500 px-2 py-0.5 rounded">{movie.Rated}</span>
                                <span>{movie.Year}</span>
                                <span>{movie.Runtime}</span>
                                <span className="text-yellow-400"><i className="fas fa-star mr-1"></i>{movie.imdbRating}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {movie.Genre && movie.Genre.split(',').map(g => (
                            <span key={g} className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                                {g.trim()}
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mb-8">
                        <button 
                            onClick={() => toggleFavorite(movie)}
                            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-all flex-1 ${isFavorite ? 'bg-red-500/10 text-red-400 border border-red-500/50' : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'}`}
                        >
                            <i className={`${isFavorite ? 'fas' : 'far'} fa-heart`}></i>
                            {isFavorite ? 'Remove' : 'Add to Favorites'}
                        </button>
                        <a 
                            href={`https://www.imdb.com/title/${movie.imdbID}`} 
                            target="_blank" 
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold transition-colors flex-1 shadow-lg shadow-yellow-500/20"
                        >
                            IMDB <i className="fas fa-external-link-alt text-sm"></i>
                        </a>
                    </div>

                    <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <p className="text-gray-300 text-lg leading-relaxed font-light">{movie.Plot}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                            <div>
                                <h4 className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">Director</h4>
                                <p className="text-white">{movie.Director}</p>
                            </div>
                            <div>
                                <h4 className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">Writers</h4>
                                <p className="text-white">{movie.Writer}</p>
                            </div>
                            <div className="md:col-span-2">
                                <h4 className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">Cast</h4>
                                <p className="text-white">{movie.Actors}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 6. Main App
const App = () => {
    const [movies, setMovies] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // State for the view 
    const [view, setView] = useState('home'); 
    const [currentQuery, setCurrentQuery] = useState('');

    // --- INITIALIZATION ---
    useEffect(() => {
        const saved = localStorage.getItem('omdb_favorites');
        if (saved) setFavorites(JSON.parse(saved));
        
        handleLocationChange();

        // Listen for Browser Back/Forward buttons (and mobile swipe)
        window.addEventListener('popstate', handleLocationChange);
        return () => window.removeEventListener('popstate', handleLocationChange);
    }, []);

    // --- NAVIGATION LOGIC ---

    const handleLocationChange = () => {
        const params = new URLSearchParams(window.location.search);
        const q = params.get('q');
        const v = params.get('view');

        if (v === 'favorites') {
            setView('favorites');
            setMovies([]);
        } else if (q) {
            setView('search');
            setCurrentQuery(q);
            fetchMovies(q);
        } else {
            setView('home');
            fetchMovies('2024'); 
        }
    };

    const navigate = (newView, query = '') => {
        const url = new URL(window.location);
        if (newView === 'home') {
            url.search = '';
        } else if (newView === 'favorites') {
            url.searchParams.set('view', 'favorites');
            url.searchParams.delete('q');
        } else if (newView === 'search') {
            url.searchParams.set('view', 'search');
            url.searchParams.set('q', query);
        }
        
        window.history.pushState({}, '', url);
        handleLocationChange();
    };

    const goBack = () => window.history.back();
    const goForward = () => window.history.forward();

    // --- API LOGIC ---

    const fetchMovies = async (query) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            
            if (data.Response === 'True') {
                setMovies(data.Search);
            } else {
                setMovies([]);
                if(query !== '2024') setError(data.Error || 'No results found');
            }
        } catch (err) {
            setError('Connection error. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    const getFullDetails = async (imdbID) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/movie/${imdbID}`);
            const data = await res.json();
            setSelectedMovie(data);
        } catch (err) {
            alert("Failed to load details");
        } finally {
            setLoading(false);
        }
    };

    // --- FAVORITES LOGIC ---

    const toggleFavorite = (movie) => {
        let newFavs;
        const id = movie.imdbID;
        if (favorites.some(f => f.imdbID === id)) {
            newFavs = favorites.filter(f => f.imdbID !== id);
        } else {
            newFavs = [...favorites, movie];
        }
        setFavorites(newFavs);
        localStorage.setItem('omdb_favorites', JSON.stringify(newFavs));
    };

    const isFavorite = (id) => favorites.some(f => f.imdbID === id);

    // --- RENDER ---

    return (
        <div className="min-h-screen flex flex-col relative fade-in">
            
            {/* Fixed Fullscreen Background */}
            <div className="fixed-bg">
                <div className="bg-overlay"></div>
            </div>

            <Navbar 
                onSearch={(q) => navigate('search', q)} 
                onNavClick={(v) => navigate(v)}
                view={view}
                goBack={goBack}
                goForward={goForward}
            />

            <main className="flex-grow z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-white/10 pb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white drop-shadow-md">
                            {view === 'favorites' ? 'Your Favorites' : 
                                view === 'search' ? `Results for "${currentQuery}"` : 
                                'Recently Added'}
                        </h1>
                        <p className="text-gray-300 mt-1 font-light">
                            {view === 'favorites' ? 'Movies you have collected.' : 
                                view === 'search' ? 'Best matches from the OMDB database.' : 
                                'Trending movies from 2024.'}
                        </p>
                    </div>
                    
                    {/* Share App Button */}
                    <div className="mt-4 md:mt-0 self-start md:self-auto">
                        <ShareButton 
                            title="OMDB Explorer" 
                            text="Check out this cool movie explorer app!" 
                            url={window.location.href} 
                        />
                    </div>
                </div>

                {/* Loading / Error */}
                {loading && (
                    <div className="flex justify-center py-20">
                        <i className="fas fa-circle-notch fa-spin text-4xl text-yellow-500"></i>
                    </div>
                )}

                {error && !loading && (
                    <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-200 p-4 rounded-lg text-center shadow-lg">
                        {error}
                    </div>
                )}

                {/* Content Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {view === 'favorites' ? (
                        favorites.length > 0 ? (
                            favorites.map(m => (
                                <MovieCard 
                                    key={m.imdbID} 
                                    movie={m} 
                                    onSelect={() => getFullDetails(m.imdbID)}
                                    isFavorite={true}
                                    toggleFavorite={toggleFavorite}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-gray-400">
                                <i className="far fa-heart text-6xl mb-4 opacity-30"></i>
                                <p>No favorites yet. Search for movies to add them!</p>
                            </div>
                        )
                    ) : (
                        movies.map(m => (
                            <MovieCard 
                                key={m.imdbID} 
                                movie={m} 
                                onSelect={() => getFullDetails(m.imdbID)}
                                isFavorite={isFavorite(m.imdbID)}
                                toggleFavorite={toggleFavorite}
                            />
                        ))
                    )}
                </div>
            </main>

            {/* Detail Modal */}
            {selectedMovie && (
                <MovieModal 
                    movie={selectedMovie} 
                    onClose={() => setSelectedMovie(null)} 
                    isFavorite={isFavorite(selectedMovie.imdbID)}
                    toggleFavorite={toggleFavorite}
                />
            )}

            <footer className="bg-gray-900/80 backdrop-blur-md border-t border-white/10 py-8 text-center text-gray-400 text-sm z-10 mt-auto">
                <p>&copy; 2025 OMDB Explorer. Powered by Java Spring Boot & React.</p>
            </footer>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);