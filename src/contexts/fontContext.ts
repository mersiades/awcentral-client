import { createContext, useContext } from 'react';

interface IFontContext {
  vtksReady: boolean
  crustReady: boolean
}

export const FontContext = createContext<IFontContext>({ vtksReady: false, crustReady: false})

export const useFonts = () => useContext(FontContext)