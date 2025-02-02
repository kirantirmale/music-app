import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { 
  FaPlay, 
  FaPause, 
  FaSearch, 
  FaStepForward, 
  FaStepBackward, 
  FaVolumeUp 
} from "react-icons/fa";


const MusicApp = () => {
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("Hindi");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  // Fetch songs when search term changes
  useEffect(() => {
    fetchSongs();
  }, [search]);

  // Play or pause the audio when isPlaying or currentIndex changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentIndex]);

  const fetchSongs = async () => {
    try {
      const response = await axios.get(
        `https://itunes.apple.com/search?term=${search}&media=music&limit=100`
      );
      setSongs(response.data.results);
      setCurrentIndex(0);
      setIsPlaying(false);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  const playSong = (index) => {
    if (currentIndex === index) {
      // Toggle play/pause if clicking the same song
      setIsPlaying(!isPlaying);
    } else {
      setCurrentIndex(index);
      setIsPlaying(true);
    }
  };

  const nextSong = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % songs.length);
    setIsPlaying(true);
  };

  const prevSong = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="container">
    <h1 className="header">Music App 🎵</h1>

    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Search Songs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button className="search-button" onClick={fetchSongs}>
        <FaSearch />
      </button>
    </div>

    <div className="song-card">
      {songs.length > 0 ? (
        <div className="card">
          <img
            src={songs[currentIndex]?.artworkUrl100}
            alt={songs[currentIndex]?.trackName}
            className="song-image"
          />
          <div className="song-info">
            <h2 className="song-name">{songs[currentIndex]?.trackName}</h2>
            <p className="artist-name">{songs[currentIndex]?.artistName}</p>
            <div className="controls">
              <button className="control-button" onClick={prevSong}>
                <FaStepBackward />
              </button>
              <button
                className="control-button"
                onClick={() => playSong(currentIndex)}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button className="control-button" onClick={nextSong}>
                <FaStepForward />
              </button>
            </div>
            <div className="volume-control">
              <FaVolumeUp />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
              />
            </div>
          </div>
        </div>
      ) : (
        <div>Loading songs...</div>
      )}
    </div>

    {songs.length > 0 && (
      <audio
        ref={audioRef}
        src={songs[currentIndex]?.previewUrl}
        autoPlay={isPlaying}
        controls
        className="audio-player"
      ></audio>
    )}
  </div>
  );
};

export default MusicApp;
