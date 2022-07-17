import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import {useLocation, useHistory} from 'react-router-dom';

const styles = {
  loginPrompt: {
    marginBottom: '5px',
    width: '100%',
  },
  loginPrompt__text: {
    paddingTop: '5px',
    paddingBottom: '10px',
    paddingX: '15px',
    alightContent: 'left',
  },
  loginPrompt__body: {
    lineHeight: '20px',
    fontSize: '16px',
  },
  navbar: {
    backgroundColor: '#4267B2',
    width: '100%',
    position: 'relative',
  },
  navbar__title: {
    color: 'white',
    fontWeight: '700',
    fontSize: '18pt',
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
  content_block: {
    color: 'black',
    fontWeight: '700',
    margin: '10px 0px',
    fontSize: '16pt',
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content_block_secondary: {
    color: 'black',
    fontWeight: '200',
    margin: '10px 0px',
    fontSize: '14pt',
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  loginPrompt__buttons: {
    'padding': '15px',
    'display': 'flex',
    'justifyContent': 'center',
    'alignItems': 'center',
  },
  loginPrompt__buttonPrimary: {
    'backgroundColor': '1976D2',
    'padding': '5px',
    'width': '50%',
    'color': 'white',
    'fontSize': '15px',
    'textTransform': 'none',
    '&:hover': {
      backgroundColor: '#6E9FD0',
    },
  },
  signUp__primary: {
    'backgroundColor': '#898F9C',
    'padding': '5px',
    'width': '50%',
    'color': 'white',
    'fontSize': '15px',
    'textTransform': 'none',
    '&:hover': {
      backgroundColor: '#b6bfd1',
    },
  },
};

/**
 * Provides JSX for SignUp page
 * @return {Object} JSX Doc
 */
export default function LoginError() {
  const warning = `That email is already being used.
  The email address you entered is already in use on 
  another Facebook account. Please consider signing up again.
  `;
  const success = 'You have been registered. Go back to log in';
  const location = useLocation();
  const history = useHistory();
  const error = location.state.error;
  return (
    <div>
      <Box sx={{flexGrow: 1}}>
        <AppBar position="static" sx={styles.navbar} elevation={0}>
          <Toolbar>
            <Typography
              variant="h8"
              component="div"
              sx={styles.navbar__title}
            >
              Facebook
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Paper sx={{...styles.loginPrompt,
        backgroundColor: error ? '#ffbaaf' : '#90ee90',
      }} elevation={0} square>
        <Box sx={styles.loginPrompt__text}>
          <Typography variant='subtitle1' component='div'
            sx={styles.loginPrompt__body}>
            {error ? warning : success}
          </Typography>
        </Box>
      </Paper>
      { error ?
        <div>
          <Box sx={styles.loginPrompt__buttons}>
            <Button
              variant="contained"
              sx={styles.signUp__primary}
              disableElevation
              onClick={() => history.push('/signup')}
              aria-label='Join'
              role='button'
            >
              Join
            </Button>
          </Box>
          <Divider> or </Divider>
        </div> :
        <div/>}
      <Box sx={styles.loginPrompt__buttons}>
        <Button
          variant="contained"
          sx={styles.loginPrompt__buttonPrimary}
          disableElevation
          onClick={() => history.push('/login')}
          aria-label='Login'
          role='button'
        >
          Login
        </Button>
      </Box>
    </div>
  );
}

