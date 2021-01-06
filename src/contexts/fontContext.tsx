import { FC, useState } from 'react';
import FontFaceObserver from 'fontfaceobserver';
import { createGenericContext } from './createGenericContext';

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
// Using createGenericContext wraps createContext in a checker for undefined
// https://medium.com/@rivoltafilippo/typing-react-context-to-avoid-an-undefined-default-value-2c7c5a7d5947
const [useFonts, GenericProvider, FontsConsumer] = createGenericContext<IFontContext>();

const FontsProvider: FC<FontsProviderProps> = ({ children, isVtksReady = false, isCrustReady = false }) => {
  const [vtksReady, setVtksReady] = useState(isVtksReady);
  const [crustReady, setCrustReady] = useState(isCrustReady);

  const vtksFont = new FontFaceObserver('Vtks good luck for you');
  const crustFont = new FontFaceObserver('crust_clean');

  vtksFont.load(null, 15000).then(
    () => setVtksReady(true),
    () => console.log('vtks failed to load')
  );

  crustFont.load(null, 15000).then(
    () => setCrustReady(true),
    () => console.log('crust failed to load')
  );
  return <GenericProvider value={{ vtksReady, crustReady }}>{children}</GenericProvider>;
};

export { useFonts, FontsProvider, FontsConsumer };
