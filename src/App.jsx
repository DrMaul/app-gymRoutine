import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { RutinaContextProvider } from './components/context/RutinaContext';
import { ModalContextProvider } from './components/context/ModalContext';
import { CalendarContextProvider } from './components/context/CalendarContext';
import ModalContainer from './components/modal/ModalContainer';
import Body from './components/Body'


function App() {

  return (

    <RutinaContextProvider>
      <CalendarContextProvider>
        <ModalContextProvider>
          <BrowserRouter>
              <ModalContainer />
              <Header />
              <Body />
              <Footer/>

            </BrowserRouter>

        </ModalContextProvider>
      </CalendarContextProvider>
    </RutinaContextProvider>
  )
}

export default App
