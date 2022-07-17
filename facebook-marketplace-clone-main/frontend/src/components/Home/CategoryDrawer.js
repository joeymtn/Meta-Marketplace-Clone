import * as React from 'react';
import {useRef} from 'react';
// import Chip from '@mui/material/Chip';
// import Box from '@mui/material/Box';
// import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import {GlobalContext} from '../GlobalContextProvider';

const styles = {
  categoryDrawer__container: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
  },
  categoryDrawer__header: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  categoryDrawer__title: {
    padding: '20px 0px',
    fontWeight: '600',
  },
  categoryDrawer__buttonClose: {
    position: 'fixed',
    right: '5%',
    top: '15px',
    backgroundColor: '#ddd',
  },
};

/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
export default function CategoryDrawer() {
  const context = React.useContext(GlobalContext);
  const mount = useRef(false);

  // Handles issue with mount issue
  // https://stackoverflow.com/questions/56442582/react-hooks-cant-perform-a-react-state-update-on-an-unmounted-component
  React.useEffect(() => {
    return () => {
      mount.current = true;
    };
  }, []);

  return (
    <Paper aria-label="categoryDrawer"
      sx={styles.categoryDrawer__container}>
      <Box sx={styles.categoryDrawer__header}>
        <Typography variant='h6' component='div'
          sx={styles.categoryDrawer__title}>
          Select Category
        </Typography>
        <IconButton
          aria-label="button__closeDrawer"
          size='small'
          sx={styles.categoryDrawer__buttonClose}
          onClick={() =>
            context.setState({pressCategory: false})}>
          <CloseIcon/>
        </IconButton>
      </Box>
      <Divider/>
      <List>
        {context.state.globalCategory.map((category, index) => {
          return (
            <ListItem key={category.name}
              aria-label={`categoryDrawer-${index}`}
              onClick={() => {
                context.setState({
                  pressCategory: false,
                  currentCategory: category.id,
                  currentCategoryName: category.name,
                });
                // for category prompt
                context.state.marketplace
                  .getCategoryByParent(category.id, context.setState);
                // for listings to render correctly
                context.state.marketplace
                  .getMarketplaceListingsByCategory(
                    context.setState, category.id);
                // add category to breadcrumbs list
                context.state.breadcrumbs.push(category);
              }}>
              <ListItemButton>
                <ListItemText primary={`${category.name}`}/>
              </ListItemButton>
            </ListItem>);
        })}
      </List>
    </Paper>
  );
}
