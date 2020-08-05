import React, { useState, useEffect } from "react";
import axios from "./axios";
import requests from "./request";
import "./Banner.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

function Banner() {
  const [movie, setMovie] = useState([]);
  const [bannerTrailerUrl, setBannerTrailerUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchNetflixOrignals);
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length - 1)
        ]
      );
      // console.log(request.data);
      return request;
    }
    fetchData();
  }, []);

  // console.log(movie);

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  const handleButtonClick = (movie) => {
    if (bannerTrailerUrl) {
      setBannerTrailerUrl("");
    } else {
      movieTrailer(movie?.name || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setBannerTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div>
      <header
        className="banner"
        style={{
          backgroundSize: "cover",
          backgroundImage: `url(
          "https://image.tmdb.org/t/p/original${movie?.backdrop_path}"
        )`,
          backgroundPosition: "center center",
        }}
      >
        <div className="banner__contents">
          <h1 className="banner__title">
            {movie?.title || movie?.name || movie?.orignal_name}
          </h1>
          <div classNam="banner__buttons">
            <button
              onClick={() => handleButtonClick(movie)}
              className="banner__button"
            >
              Play
            </button>
            <button className="banner__button">My List</button>
          </div>
          <h1 className="banner__description">
            {truncate(movie?.overview, 150)}
          </h1>
        </div>
        <div className="banner--fadeBottom" />
      </header>
      {bannerTrailerUrl && <YouTube videoId={bannerTrailerUrl} opts={opts} />}
    </div>
  );
}

export default Banner;
