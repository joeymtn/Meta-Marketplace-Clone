import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {useHistory} from 'react-router-dom';
import {GlobalContext} from '../GlobalContextProvider';
import {useRef} from 'react';


/**
 * Provides Form Input for Login
 * @return {Object} JSX Doc
 */
export default function LoginForm() {
  const styles = {
    navbar__title: {
      'color': '#1976D2',
      'fontWeight': '700',
      'fontSize': '18pt',
      'textAlign': 'center',
      'boxSizing': 'contentBox',
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
      'width': '100%',
      'color': 'white',
      'fontSize': '15px',
      'textTransform': 'none',
      '&:hover': {
        backgroundColor: '#6E9FD0',
      },
    },
    account_buttonPrimary: {
      'backgroundColor': '#4a8532',
      'padding': '5px',
      'width': '50%',
      'color': 'white',
      'fontSize': '15px',
      'textTransform': 'none',
      '&:hover': {
        backgroundColor: '#75ab4b',
      },
    },
    login_form: {
      '& .MuiTextField-root': {
        m: 1,
        width: '95%',
        margin: '5px',
      },
    },
    login_paper: {
      'elevation': 6,
      'width': '100%',
      'height': '100%',
    },
  };

  const history = useHistory();
  const mount = useRef(false);
  const context = React.useContext(GlobalContext);
  const [login, setLogin] = React.useState({email: '', password: ''});
  const [error, setError] = React.useState(false);

  // Handles issue with mount issue
  // https://stackoverflow.com/questions/56442582/react-hooks-cant-perform-a-react-state-update-on-an-unmounted-component
  React.useEffect(() => {
    return () => {
      mount.current = true;
    };
  }, []);

  return (
    <Paper sx={styles.login_paper}>
      <Box
        component="form"
        sx={styles.login_form}
        noValidate
        autoComplete="off"
      >
        <div>
          <Box >
            <Typography
              variant="h6"
              component="div"
              sx={styles.navbar__title}
            >
              <span onClick={() => history.push('/')}>facebook</span>
            </Typography>
          </Box>
          <TextField
            id="Username"
            error={error}
            aria-label="email-input"
            type="search"
            label='Email'
            helperText={error ? 'Email or Password incorrect' : ''}
            value={login['email']}
            onChange={(ev) => setLogin({...login, email: ev.target.value})}
            variant="filled"
          />
          <TextField
            id="filled-password-input"
            error={error}
            aria-label="password-input"
            type="password"
            label='Password'
            helperText={error ? 'Email or Password incorrect' : ''}
            value={login['password']}
            onChange={(ev) => setLogin({...login, password: ev.target.value})}
            autoComplete="current-password"
            variant="filled"
          />
          <Box sx={styles.loginPrompt__buttons}>
            <Button
              variant="contained"
              sx={styles.loginPrompt__buttonPrimary}
              onClick={() =>
                context.state.marketplace
                  .getAuthenicationToken(context.setState,
                    login, history, setError, mount)}
              disableElevation
              aria-label='Login'
              role='button'
            >
              Login
            </Button>
          </Box>
          <Divider> or </Divider>
          <Box sx={styles.loginPrompt__buttons}>
            <Button
              variant="contained"
              sx={styles.account_buttonPrimary}
              disableElevation
              onClick={() => history.push('/signup')}
              aria-label='Create New Account'
              role='button'
            >
              Create New Account
            </Button>
          </Box>
        </div>
      </Box>
    </Paper>
  );
}
