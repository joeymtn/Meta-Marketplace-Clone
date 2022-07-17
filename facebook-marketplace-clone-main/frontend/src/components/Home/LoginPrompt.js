import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import {Typography} from '@mui/material';
import {useHistory} from 'react-router';

const styles = {
  loginPrompt: {
    marginTop: '56px',
    paddingY: '10px',
    marginBottom: '5px',
    backgroundColor: '#ffbaaf',
    width: '100%',
  },
  loginPrompt__text: {
    paddingTop: '20px',
    paddingBottom: '10px',
    paddingX: '15px',
    alightContent: 'left',
  },
  loginPrompt__header: {
    fontWeight: '600',
    fontSize: '18px',
    lineHeight: '20px',
  },
  loginPrompt__body: {
    lineHeight: '20px',
    fontSize: '16px',
  },
  loginPrompt__buttons: {
    padding: '15px',
  },
  loginPrompt__buttonPrimary: {
    'backgroundColor': 'white',
    'padding': '5px',
    'width': '20%',
    'marginRight': '5%',
    'color': 'black',
    'fontSize': '15px',
    'textTransform': 'none',
    '&:hover': {
      backgroundColor: '#ddd',
    },
  },
  loginPrompt__buttonSecondary: {
    'backgroundColor': 'white',
    'width': '75%',
    'padding': '5px',
    'color': 'black',
    'fontSize': '15px',
    'textTransform': 'none',
    '&:hover': {
      backgroundColor: '#ddd',
    },
  },
};

/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
export default function LoginPrompt() {
  const promptHeader = `Buy and sell items locally or
  have something new shipped from stores.`;
  const promptBody = `Log in to get the full Facebook
  Marketplace Experience.`;
  const history = useHistory();
  return (
    <Paper sx={styles.loginPrompt} elevation={0} square>
      <Box sx={styles.loginPrompt__text}>
        <Typography variant='h6' component='div'
          sx={styles.loginPrompt__header}>
          {promptHeader}
        </Typography>
        <Typography variant='subtitle1' component='div'
          sx={styles.loginPrompt__body}>
          {promptBody}
        </Typography>
      </Box>
      <Box sx={styles.loginPrompt__buttons}>
        <Button variant="contained"
          sx={styles.loginPrompt__buttonPrimary}
          disableElevation
          onClick={() => history.push('/login')}
          role='button'
          aria-label='Login'>
          Log In
        </Button>
        <Button variant="contained" sx={styles.loginPrompt__buttonSecondary}
          disableElevation>
          Learn more
        </Button>
      </Box>
    </Paper>
  );
};
