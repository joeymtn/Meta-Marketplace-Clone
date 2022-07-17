import * as React from 'react';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import AddIcon from '@mui/icons-material/Add';
import SearchBar from './SearchBar';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import TuneIcon from '@mui/icons-material/Tune';
import {GlobalContext} from '../GlobalContextProvider';
import {useHistory} from 'react-router';

// Based on: https://mui.com/components/chips/

const styles = {
  categoryPrompt: {
    padding: '10px 0px',
    width: '100%',
  },
  categoryPrompt__chips: {
    paddingBottom: '10px',
  },
  categoryPrompt__searchbar: {
    paddingBottom: '10px',
  },
  categoryPrompt__linebreak: {
    paddingBottom: '10px',
  },
  categoryPrompt__breadcrumbs: {
    paddingBottom: '10px',
    paddingLeft: '5px',
    fontSize: '14px',
  },
  categoryPrompt__breadcrumb: {
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  categoryPrompt__filterButton: {
    'backgroundColor': 'rgba(173, 216, 230, 0.5)',
    'marginTop': '12.5px',
    'padding': '3px',
    'width': '20%',
    'color': '#00468b',
    'fontSize': '15px',
    'textTransform': 'none',
    '&:hover': {
      backgroundColor: 'rgba(173, 216, 230, 0.8)',
    },
  },
  categoryPrompt__userListingButton: {
    'backgroundColor': 'rgba(173, 216, 230, 0.5)',
    'position': 'absolute',
    'right': '10px',
    'marginTop': '12.5px',
    'padding': '3px',
    'width': '30%',
    'color': '#00468b',
    'fontSize': '15px',
    'textTransform': 'none',
    '&:hover': {
      backgroundColor: 'rgba(173, 216, 230, 0.8)',
    },
  },
  categoryPrompt__createButton: {
    'backgroundColor': 'rgba(173, 216, 230, 0.5)',
    'marginTop': '12.5px',
    'padding': '3px',
    'width': '100%',
    'color': '#00468b',
    'fontSize': '15px',
    'textTransform': 'none',
    '&:hover': {
      backgroundColor: 'rgba(173, 216, 230, 0.8)',
    },
  },
};

/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
export default function CategoryPrompt() {
  const context = React.useContext(GlobalContext);
  const history = useHistory();
  const defaultChips = () => (
    <Stack direction="row" spacing={1} sx={styles.categoryPrompt__chips}>
      <Chip aria-label="button__sell"
        clickable key={'sell'} label={'Sell'}/>
      <Chip aria-label="button__allCategories"
        clickable key={'allCategories'} label={'All Categories'}
        onClick={() => {
          context.setState({pressCategory: true});
        }}/>
    </Stack>
  );

  const subcategoryChips = () => {
    return (
      <Stack direction="row" spacing={1} sx={styles.categoryPrompt__chips}>
        {context.state.currentSubcategory.map((subcategory) => {
          return (<Chip clickable label={`${subcategory.name}`}
            key={subcategory.name}
            onClick={() => {
              // for category prompt
              context.state.marketplace
                .getCategoryByParent(subcategory.id, context.setState);
              context.setState({
                currentCategory: subcategory.id,
              });
              // for listings to render correctly
              context.state.marketplace
                .getMarketplaceListingsByCategory(
                  context.setState, subcategory.id);
              // add category to breadcrumbs list
              context.state.breadcrumbs.push(subcategory);
            }}/>);
        })}
      </Stack>
    );
  };

  const breadcrumbRoot = () => {
    if (context.state.currentCategory !== null) {
      return (
        <Link underline="hover" color="inherit"
          onClick={() => {
            context.setState({
              currentCategory: null,
              currentCategoryName: null,
              currentSubcategory: null,
              breadcrumbs: [],
            });
            context.state.marketplace
              .getMarketplaceListings(
                context.setState);
          }}>
            Marketplace
        </Link>
      );
    }
  };

  return (
    <Box sx={styles.categoryPrompt}>
      <Paper square elevation={0}>
        <Breadcrumbs sx={styles.categoryPrompt__breadcrumbs}>
          {breadcrumbRoot()}
          {context.state.breadcrumbs.map((breadcrumb, index) => {
            return (
              <Link underline="hover" color="inherit"
                sx={styles.categoryPrompt__breadcrumb}
                key={`breadcrumb__${breadcrumb.name}`}
                onClick={() => {
                  const last = context.state
                    .breadcrumbs.pop();
                  if (last.name === breadcrumb.name) {
                    context.state.breadcrumbs.push(last);
                  } else {
                    context.setState({
                      currentCategory: breadcrumb.id,
                      currentCategoryName: breadcrumb.name,
                    });
                    context.state.marketplace
                      .getCategoryByParent(
                        breadcrumb.id, context.setState);
                    context.state.marketplace
                      .getMarketplaceListingsByCategory(
                        context.setState, breadcrumb.id);
                  }
                }}>
                {breadcrumb.name}
              </Link>
            );
          })}
        </Breadcrumbs>
        {context.state.currentSubcategory === null ?
          defaultChips() : subcategoryChips()}
        {/* {renderChips()} */}
        <SearchBar aria-label="search-bar"
          sx={styles.categoryPrompt__searchbar}/>
        <Button variant="contained"
          sx={styles.categoryPrompt__createButton}
          disableElevation
          onClick={() => {
            context.state.user.accessToken !== undefined ?
              context.setState({creatingListing: true}) :
              history.push('/login');
          }}
          role='button'
          startIcon={<AddIcon/>}
          aria-label='create'>
          Create New Listing
        </Button>
        <Divider sx={styles.categoryPrompt__linebreak}/>
        <Button variant="contained"
          sx={styles.categoryPrompt__filterButton}
          disableElevation
          role='button'
          startIcon={<TuneIcon/>}
          aria-label='filters'>
          Filters
        </Button>
        <Button variant="contained"
          sx={styles.categoryPrompt__userListingButton}
          disableElevation
          onClick={() => {
            if (context.state.user.accessToken !== undefined) {
              context.state.marketplace.getMarketplaceListingsByUser(
                context.setState, context.state.user.id,
                context.state.user.accessToken);
            } else {
              history.push('/login');
            }
          }
          }
          role='button'
          startIcon={<AccountBoxIcon/>}
          aria-label='my listings'>
          My Listings
        </Button>
      </Paper>
    </Box>
  );
}
