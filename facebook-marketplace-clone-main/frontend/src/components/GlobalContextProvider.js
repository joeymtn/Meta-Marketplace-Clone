import React, {createContext, useRef, useState} from 'react';
import MarketplaceAPI from '../MarketplaceAPI';

export const GlobalContext = createContext();

/** This hook compoent returns a Context Provider component
 * @param {Object} props - Passed props from the parent component
 * @return {Object} JSX component
 *
 * In order to user Global Context simply do
 *        import {GlobalContext} from [this file];
 *          const context = useContext(GlobalContext)
 *
 * You can reference the context doing
 *          context.state.[property] for the state
 *          context.setState({key:value}) for updating state
*/
export default function GlobalContextProvider(props) {
  const [state, setState] = useState({
    marketplace: new MarketplaceAPI(),
    marketplaceListings: [],
    pressCategory: false,
    filters: false,
    creatingListing: false,
    breadcrumbs: [],
    user: {}, // contains {id: , name: , accessToken: }
    globalCategory: [], // categories for categoryDrawer component
    currentCategory: null, // id of current category
    currentCategoryName: null, // name of current category
    currentSubcategory: null, // array of subcategories of currentCategory
  });

  const statePtr = useRef(state);
  const mountPtr = useRef(true);

  const intialize = (item) => {
    if (!mountPtr.current) return;
    setState({...statePtr.current, ...item});
    statePtr.current = {...statePtr.current, ...item};
  };

  React.useEffect(() => {
    const user = localStorage.getItem('user');
    if ( user !== null) {
      intialize({user: JSON.parse(user)});
    }
    state.marketplace.getCategory(intialize);
    state.marketplace.getMarketplaceListings(intialize);
    return () => {
      mountPtr.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GlobalContext.Provider value={{
      state: state,
      setState: (item) => intialize(item),
    }}>
      {props.children}
    </GlobalContext.Provider>
  );
}
