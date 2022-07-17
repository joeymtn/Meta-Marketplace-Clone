import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import {GlobalContext} from '../GlobalContextProvider';
/**
 * Simple component with no state.
 *
 * @return {object} JSX
 * @param {props} props props
 */
export default function MarketplaceListings() {
  /**
   * Item bar
   * @param {Object} listing
   * @return {Object} JSX for item description
   */
  const listingDescription = (listing) => (
    <div>
      <span>{listing.content.description}</span>
      <br></br>
      <span>{listing.content.location}</span>
    </div>
  );

  const context = React.useContext(GlobalContext);
  return (
    <ImageList sx={{width: '100%'}}>
      {context.state.marketplaceListings.map((listing) => (
        <ImageListItem key={listing.id}>
          <img
            src={`${listing.content.imageLink}?w=248&fit=crop&auto=format`}
            srcSet={`${listing.content.imageLink}
            ?w=248&fit=crop&auto=format&dpr=2 2x`}
            alt={listing.content.description}
            loading="lazy"
          />
          <ImageListItemBar
            title={listing.content.price}
            subtitle={listingDescription(listing)}
            position="below"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
