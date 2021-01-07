import { createContext, FC, useContext, useState } from 'react';
import FontFaceObserver from 'fontfaceobserver';

export interface IFontContext {
  vtksReady: boolean;
  crustReady: boolean;
}

interface FontsProviderProps {
  children: JSX.Element;

  // Dependency injection for testing
  isVtksReady?: boolean;

  // Dependency injection for testing
  isCrustReady?: boolean;
}

/**
 * FontsContext uses the fontfaceobserver library to to keep track of whether
 * the two custom fonts - "Vtks good luck for you" and "crust_clean" have
 * loaded or not. This is used for rendering a fallback font and styling
 * to minimise the impact of flash-of-unstyled-text (FOUT)
 */
const FontsContext = createContext<IFontContext>({ vtksReady: false, crustReady: false });

export const useFonts = () => useContext(FontsContext);

export const FontsConsumer = FontsContext.Consumer;

export const FontsProvider: FC<FontsProviderProps> = ({ children, isVtksReady = false, isCrustReady = false }) => {
  const [vtksReady, setVtksReady] = useState(isVtksReady);
  const [crustReady, setCrustReady] = useState(isCrustReady);

  const vtksFont = new FontFaceObserver('Vtks good luck for you');
  const crustFont = new FontFaceObserver('crust_clean');

  vtksFont.load(null, 15000).then(
    () => setVtksReady(true),
    () => console.warn('vtks failed to load')
  );

  crustFont.load(null, 15000).then(
    () => setCrustReady(true),
    () => console.warn('crust failed to load')
  );
  return <FontsContext.Provider value={{ vtksReady, crustReady }}>{children}</FontsContext.Provider>;
};
