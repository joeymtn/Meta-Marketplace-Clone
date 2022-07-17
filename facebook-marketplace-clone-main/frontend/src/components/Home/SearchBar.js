import * as React from 'react';
import {styled, alpha} from '@mui/material/styles';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import {GlobalContext} from '../GlobalContextProvider';

// Based on search bar from: https://mui.com/components/app-bar/#app-bar-with-search-field

let context;

const Search = styled('div')(({theme}) => ({
  'position': 'relative',
  'borderRadius': theme.shape.borderRadius,
  'backgroundColor': alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  'marginLeft': 0,
  'width': '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
  'color': 'inherit',
  '& .MuiInputBase-input': {
    'padding': theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    'paddingLeft': `calc(1em + ${theme.spacing(4)})`,
    'transition': theme.transitions.create('width'),
    'width': '100%',
    [theme.breakpoints.up('sm')]: {
      'width': '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const onSearch = (event, category) => {
  context.state.marketplace
    .searchMarketplaceListings(
      context.setState,
      event.target.value,
      category,
    );
};

/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
export default function SearchBar() {
  context = React.useContext(GlobalContext);
  return (
    <Box
      sx={{
        flexGrow: 1,
        color: '#333',
        backgroundColor: '#f4f4f4',
        borderRadius: '20px',
      }}
    >
      <Search>
        <SearchIconWrapper>
          <SearchIcon sx={{color: '#999'}} />
        </SearchIconWrapper>
        <StyledInputBase
          onChange={(e) => onSearch(e, context.state.currentCategory)}
          placeholder="Search Marketplace"
          inputProps={{'aria-label': 'search'}}
        />
      </Search>
    </Box>
  );
}
