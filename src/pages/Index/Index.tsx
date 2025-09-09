import './Index.css'
import type { CardProps } from "../../components/Card/Card"
import type { PeekProps } from "../../components/Peek/Peek"
import { Header } from "../../components/Header/Header"
import { CardGallery, type CardGalleryProps } from "../../components/CardGallery/CardGallery"
import { PeekGallery ,type PeekGalleryProps } from "../../components/PeekGallery/PeekGallery"
import { Peek } from "../../components/Peek/Peek"
import { Footer } from "../../components/Footer/Footer"
import { useEffect, useState } from "react"


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
  const baseUrl = new URL('https://ws.audioscrobbler.com/2.0/?');
  const API_KEY = '38c33b10c98373d07e536e89fee77c1e'
  const navItems = [
    "item1",
    "item2",
    "item3"
  ] 
  const footerItems = [
    "item1",
    "item2",
    "item3",
    "item4",
    "item5",
  ]
  useEffect(() => {
    const fetchTracks = async () => {
      try{
        const topTracksParams = {
          method: 'chart.gettoptracks',
          api_key: API_KEY,
          limit: 4,
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
          if(!response.ok) throw new Error("Track info retrieval Error");
          const retrievedTrackInfo = await trackInfo.json();
          currentTrack.image = retrievedTrackInfo?.track?.album?.image[3]['#text'];
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

  const trackGalleryProps = generateTrackGallery(tracks);  
  const artistGalleryProps = generateArtistGallery(artists);
  return (
    <>
      <div className="index">
        <Header navItems={navItems}></Header>
        <CardGallery {...trackGalleryProps}></CardGallery>
        <PeekGallery {...artistGalleryProps}></PeekGallery>
        <Footer></Footer>
      </div>
    </>
  )
}
function generateTrackGallery(tracks: Track[]){
  const trackData: CardProps[] = [];
  tracks.forEach((currentTrack) => {
    const track: CardProps = {
      imageUrl: currentTrack.image,
      artistName: currentTrack.artist.name,
      songName: currentTrack.name,
      listenersAmount: `Listeners: ${currentTrack.listeners}`
    }
    trackData.push(track);
  })
  const trackGalleryProps: CardGalleryProps = {
    cardPropsArray: trackData,
    galleryTitle: "Dummy Gallery",
    gallerySubtitle: "Dummy Gallery Subtitle"
  }
  return trackGalleryProps;
}
function generateArtistGallery(artists: ArtistPeek[]){
  const peekData: PeekProps[] = [];
  artists.forEach((currentArtist) => {
    const artist: PeekProps = {
      imageUrl: currentArtist.image,
      title: currentArtist.name,
      description: `Listeners: ${currentArtist.listeners}`
    }
    peekData.push(artist);
  })
  const artistGalleryProps: PeekGalleryProps = {
    peekPropsArray: peekData,
    upperSubtitle: 'Top Artists',
    title: "Artists",
    lowerSubtitle: "Top Artists"
  }
  return artistGalleryProps;
}
export default Index
