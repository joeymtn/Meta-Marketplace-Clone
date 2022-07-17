import React from 'react';
// import MarketplaceItems from './MarketplaceItem';
import TitleBar from './TitleBar';
import LoginPrompt from './LoginPrompt';
import CategoryPrompt from './CategoryPrompt';
import {GlobalContext} from '../GlobalContextProvider';
import CategoryDrawer from './CategoryDrawer';
import MarketplaceListings from './MarketplaceListing';
import NewListingForm from '../Listings/NewListingForm';
// import NewListingCategories from '../Listings/NewListingCategories';
/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
export default function HomePage() {
  const context = React.useContext(GlobalContext);

  return (
    <div>
      {/* <NewListingCategories/> */}
      {context.state.pressCategory === false ? <TitleBar/> : undefined}
      <LoginPrompt/>
      <CategoryPrompt/>
      <MarketplaceListings/>
      {context.state.pressCategory === true ? <CategoryDrawer/> : undefined}
      {context.state.creatingListing === true ?
        <NewListingForm/> : undefined}
    </div>
  );
};
