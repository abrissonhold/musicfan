import './Index.css'
import type { CardProps } from "../../components/Card/Card"
import type { PeekProps } from "../../components/Peek/Peek"
import { Header } from "../../components/Header/Header"
import { CardGallery, type CardGalleryProps } from "../../components/CardGallery/CardGallery"
import { PeekGallery ,type PeekGalleryProps } from "../../components/PeekGallery/PeekGallery"
import { Footer } from "../../components/Footer/Footer"
function Index() {
  const dummyCard: CardProps = {
    imageUrl: 'https://cdn.freebiesupply.com/logos/large/2x/for-dummies-1-logo-svg-vector.svg',
    artistName: "Dummy Artist",
    songName: "Dummy Song",
    listenersAmount: "Dummy Listeners"
  }
  const dummyPeek: PeekProps = {
    imageUrl: "https://cdn.freebiesupply.com/logos/large/2x/for-dummies-1-logo-svg-vector.svg",
    title: "Dummy Peek",
    description: "Dummy description"
  }
  const dummyCards: Array<CardProps> = [];
  const dummyPeeks: Array<PeekProps> = [];
  for(let i = 0; i < 5; i++){
    dummyCards.push(dummyCard);
    dummyPeeks.push(dummyPeek);
  }
  const navItems = [
    "item1",
    "item2",
    "item3"
  ]

  const cardGalleryProps: CardGalleryProps = {
    cardPropsArray: dummyCards,
    galleryTitle: "Dummy Gallery",
    gallerySubtitle: "Dummy Gallery Subtitle"
  }
  const peekGalleryProps: PeekGalleryProps = {
    peekPropsArray: dummyPeeks,
    upperSubtitle: "Dummy Upper Subtitle",
    title: "Dummy Title",
    lowerSubtitle: "Dummy Lower Subtitle"
  }
  return (
    <>
      <div className="index">
        <Header navItems={navItems}></Header>
        <CardGallery {...cardGalleryProps}></CardGallery>
        <PeekGallery {...peekGalleryProps}></PeekGallery>
        <Footer></Footer>
      </div>
    </>
  )
}

export default Index
