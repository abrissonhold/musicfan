import type { CardProps } from "../../components/Card/Card"
import type { PeekProps } from "../../components/Peek/Peek"
import { Header, type HeaderProps } from "../../components/Header/Header"
import { CardGallery, type CardGalleryProps } from "../../components/CardGallery/CardGallery"
import { PeekGallery ,type PeekGalleryProps } from "../../components/PeekGallery/PeekGallery"
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

function injectParams(baseUrl: URL, params: Object){
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      baseUrl.searchParams.append(key, String(value));
    }
  });
  return baseUrl;
}

function Index() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const dummyPeek: PeekProps = {
    imageUrl: "https://cdn.freebiesupply.com/logos/large/2x/for-dummies-1-logo-svg-vector.svg",
    title: "Dummy Peek",
    description: "Dummy description"
  }
  const dummyPeeks: Array<PeekProps> = [];
  for(let i = 0; i < 4; i++){
    dummyPeeks.push(dummyPeek);
  }
  const navItems = [
    "item1",
    "item2",
    "item3"
  ]
 
  const peekGalleryProps: PeekGalleryProps = {
    peekPropsArray: dummyPeeks,
    upperSubtitle: "Dummy Upper Subtitle",
    title: "Dummy Title",
    lowerSubtitle: "Dummy Lower Subtitle"
  }
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
        const baseUrl = new URL('https://ws.audioscrobbler.com/2.0/?');
        const topTracksParams = {
          method: 'chart.gettoptracks',
          api_key: '38c33b10c98373d07e536e89fee77c1e',
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
          try{
            const trackInfoParams = {
              method: 'track.getInfo',
              api_key: '38c33b10c98373d07e536e89fee77c1e',
              mbid: currentTrack.mbid,
            }
            let trackInfoUrl = injectParams(baseUrl, trackInfoParams);            
            const trackInfo = await fetch(trackInfoUrl);
            if(!response.ok) throw new Error("Track info retrieval error");
            const retrievedTrackInfo = await trackInfo.json();
            currentTrack.image = retrievedTrackInfo.track.album.image[3]['#text'];
          }
          catch(e){
            console.error('An error ocurrend retrieven cover art: ', e);
          }
        }        
        setTracks(topTracksResponse.tracks.track);
      }
      catch(e){
        console.error("Error: ", e);
      }
    }
    fetchTracks();
  }, [])

  const trackData: CardProps[] = [];
  tracks.forEach((currentTrack) => {
    const track: CardProps = {
      imageUrl: currentTrack.image,
      artistName: currentTrack.artist.name,
      songName: currentTrack.name,
      listenersAmount: currentTrack.listeners
    }
    trackData.push(track);
  })
  const cardGalleryProps: CardGalleryProps = {
    cardPropsArray: trackData,
    galleryTitle: "Dummy Gallery",
    gallerySubtitle: "Dummy Gallery Subtitle"
  }
  return (
    <>
      <div className="index">
        <Header navItems={navItems}></Header>
        <CardGallery {...cardGalleryProps}></CardGallery>
        <PeekGallery {...peekGalleryProps}></PeekGallery>
        <Footer footerItems={footerItems}></Footer>
      </div>
    </>
  )
}

export default Index
