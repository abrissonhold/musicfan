import './Index.css'
import type { CardProps } from "../../components/Card/Card"
import type { PeekProps } from "../../components/Peek/Peek"
import { Header } from "../../components/Header/Header"
import { CardGallery, type CardGalleryProps } from "../../components/CardGallery/CardGallery"
import { PeekGallery, type PeekGalleryProps } from "../../components/PeekGallery/PeekGallery"
import { Footer } from "../../components/Footer/Footer"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

interface TrackResponse {
  tracks: TrackResponseObject;
}
interface TrackResponseObject {
  '@attr': TrackAttribute;
  track: Array<Track>;
}
interface TrackAttribute {
  page: string;
  perPage: string;
  totalPages: string;
  total: string;
}
interface Track {
  artist: Artist;
  duration: string;
  image: string;
  listeners: string;
  mbid: string;
  name: string;
  playcount: string;
  streamable: Streamable;
  url: string;
}
interface Artist {
  name: string;
  mbid: string;
  url: string;
}
interface Streamable {
  fulltrack: string;
  '#text': string;
}

interface ArtistPeek {
  name: string;
  image: string;
  listeners: string;
  mbid: string;
}

function injectParams(baseUrl: URL, params: Object){
  const newUrl = new URL(baseUrl.toString());
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      newUrl.searchParams.append(key, String(value));
    }
  });
  return newUrl;
}

function Index() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<ArtistPeek[]>([]);
  const navigate = useNavigate();
  const baseUrl = new URL('https://ws.audioscrobbler.com/2.0/?');
  const API_KEY = '38c33b10c98373d07e536e89fee77c1e';  

  // Navigation functions
  const navigateToTrack = (mbid: string) => {
    navigate(`/track?q=${mbid}`);
  };

  const navigateToArtist = (mbid: string) => {
    navigate(`/artist?q=${mbid}`);
  };

  useEffect(() => {
    const fetchTracks = async () => {
      try{
        const topTracksParams = {
          method: 'chart.gettoptracks',
          api_key: API_KEY,
          limit: 5,
          format: 'json'
        };
        let topTracksUrl = injectParams(baseUrl, topTracksParams);
        const response = await fetch(topTracksUrl);
        if(!response.ok){
          throw new Error("Network error");
        }
        const topTracksResponse: TrackResponse = await response.json();    
        for(const currentTrack of topTracksResponse.tracks.track){
          const trackInfoParams = {
            method: 'track.getInfo',
            api_key: API_KEY,
            mbid: currentTrack.mbid,
            format: 'json'
          }
          let trackInfoUrl = injectParams(baseUrl, trackInfoParams);            
          const trackInfo = await fetch(trackInfoUrl);
          if(!trackInfo.ok) throw new Error("Track info retrieval Error");
          const retrievedTrackInfo = await trackInfo.json();
          currentTrack.image = retrievedTrackInfo?.track?.album?.image[3]['#text'] ? 
          retrievedTrackInfo?.track?.album?.image[3]['#text'] :
          'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
        }                
        setTracks(topTracksResponse.tracks.track);
      }
      catch(e){
        console.error("Error fetching top tracks: ", e);
      }
    }
    fetchTracks();
  }, [])

  useEffect(() => {
    const fetchTopArtists = async () => {
      try{
        const topArtistParams = {
          method: 'chart.gettopartists',
          api_key: API_KEY,
          limit: 4,
          format: 'json'
        }
        let topArtistUrl = injectParams(baseUrl, topArtistParams);      
        const response = await fetch(topArtistUrl);
        if(!response.ok) throw new Error("Network Error");
        const topArtistResponse = await response.json();
        for(const currentArtist of topArtistResponse.artists.artist){
          const artistTopAlbumsParams = {
            method: 'artist.gettopalbums',
            api_key: API_KEY,
            mbid: currentArtist.mbid,
            limit: 1,
            format: 'json'
          }
          let artistTopAlbumsUrl = injectParams(baseUrl, artistTopAlbumsParams);
          const responseArtist = await fetch(artistTopAlbumsUrl);
          if(!responseArtist.ok) throw new Error('Artists top albums retrieval Error');
          const artistTopAlbumsResponse = await responseArtist.json();
          currentArtist.image = artistTopAlbumsResponse.topalbums?.album[0]?.image[2]['#text'];
        }
        setArtists(topArtistResponse.artists.artist);
      }
      catch(e){
        console.error('Error fetching top artists: ', e)
      }    
    }
    fetchTopArtists();
  }, []);

  const trackGalleryProps = generateTrackGallery(tracks, navigateToTrack);  
  const artistGalleryProps = generateArtistGallery(artists, navigateToArtist);
  return (
    <>
      <div className="index">
        <Header></Header>
        <CardGallery {...trackGalleryProps}></CardGallery>
        <PeekGallery {...artistGalleryProps}></PeekGallery>
        <Footer></Footer>
      </div>
    </>
  )
}

function generateTrackGallery(tracks: Track[], navigateToTrack: (mbid: string) => void){
  const trackData: CardProps[] = [];
  tracks.forEach((currentTrack) => {
    const track: CardProps = {
      imageUrl: currentTrack.image,
      artistName: currentTrack.artist.name,
      songName: currentTrack.name,
      listenersAmount: `Listeners: ${currentTrack.listeners}`,
      onClick: () => {
        if (currentTrack.mbid && currentTrack.mbid.trim() !== '') {
          navigateToTrack(currentTrack.mbid);
        } else {
          console.warn('No valid MBID for track:', currentTrack.name);
        }
      }
    }
    trackData.push(track);
  })
  const trackGalleryProps: CardGalleryProps = {
    cardPropsArray: trackData,
    galleryTitle: "Exitos",
    gallerySubtitle: "Los mejores éxitos del momento"
  }
  return trackGalleryProps;
}

function generateArtistGallery(artists: ArtistPeek[], navigateToArtist: (mbid: string) => void){
  const peekData: PeekProps[] = [];
  artists.forEach((currentArtist) => {
    const artist: PeekProps = {
      imageUrl: currentArtist.image,
      title: currentArtist.name,
      description: `Listeners: ${currentArtist.listeners}`,
      onClick: () => {
        if (currentArtist.mbid && currentArtist.mbid.trim() !== '') {
          navigateToArtist(currentArtist.mbid);
        } else {
          console.warn('No valid MBID for artist:', currentArtist.name);
        }
      }
    }
    peekData.push(artist);
  })
  const artistGalleryProps: PeekGalleryProps = {
    peekPropsArray: peekData,
    upperSubtitle: 'Estos son los artistas más populares',
    title: "Descubrí los mejores artistas",
    lowerSubtitle: "Conoce a quienes están en tendencia, te invitamos a leer un poco mas de tus futuros artistas favoritos"
  }
  return artistGalleryProps;
}

export default Index