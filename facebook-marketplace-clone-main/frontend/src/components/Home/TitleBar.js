import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {useHistory} from 'react-router-dom';
import {GlobalContext} from '../GlobalContextProvider';

const styles = {
  navbar: {
    backgroundColor: 'white',
    width: '100%',
    position: 'fixed',
    zIndex: '10000',
    top: '0',
    left: '0',
  },
  navbar__title: {
    color: '#1976D2',
    fontWeight: '700',
    fontSize: '18pt',
    flexGrow: 1,
  },
  name_title: {
    color: '#1976D2',
    fontWeight: '700',
    fontSize: '12pt',
    flexGrow: 1,
  },
  navbar__button: {
    'backgroundColor': '#1976D2',
    'color': 'white',
    'textTransform': 'none',
    'padding': '6px 6px',
    '&:hover': {
      backgroundColor: '#1976D2',
      color: 'white',
    },
  },
};

/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
export default function TitleBar() {
  const history = useHistory();
  const context = React.useContext(GlobalContext);
  return (
    <Box aria-label="titleBar" sx={{flexGrow: 1}}>
      <AppBar position="static" sx={styles.navbar} elevation={0}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={styles.navbar__title}
          >
            facebook
          </Typography>
          { context.state.user.accessToken !== undefined ?
            <Typography
              variant="h6"
              component="div"
              sx={{...styles.name_title, textAlign: 'right'}}
            >
              {`Hello ${context.state.user.name}`}
            </Typography> :
            <Button disableElevation disableFocusRipple
              variant="elevation" color='primary'
              sx={styles.navbar__button}
              onClick={() => history.push('/login')}
              role='button'
              aria-label='Login'>
              Log In
            </Button>
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}
