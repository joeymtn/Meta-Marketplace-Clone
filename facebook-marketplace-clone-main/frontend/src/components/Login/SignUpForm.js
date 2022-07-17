import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {useHistory} from 'react-router';
import {GlobalContext} from '../GlobalContextProvider';

const styles = {
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
  field_nameContent: {
    width: '47%',
    margin: '5px 5px',
  },
  field_singleContent: {
    width: '95%',
    margin: '5px 5px',
  },
};

const signupFlags = ['NAME', 'EMAIL', 'PHONE', 'PASSWORD'];
// Source: https://sigparser.com/developers/email-parsing/regex-validate-email-address/
const emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g;
// Source: https://stackoverflow.com/questions/16699007/regular-expression-to-match-standard-10-digit-phone-number
const phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/g;
const defaultState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
};

/**
 * Provides JSX for SignUp page
 * @return {Object} JSX Doc
 */
export default function SignUpForm() {
  const [signUpState, setSignUpState] = React.useState(0);
  const [error, setError] = React.useState(false);
  const [signUpInfo, setSignUpInfo] = React.useState(defaultState);
  const history = useHistory();
  const context = React.useContext(GlobalContext);
  let components = undefined;
  switch (signupFlags[signUpState]) {
  case ('NAME'):
    components = getName(signUpInfo, setSignUpInfo, error);
    break;
  case ('EMAIL'):
    components = getEmail(signUpInfo, setSignUpInfo, error);
    break;
  case ('PHONE'):
    components = getPhone(signUpInfo, setSignUpInfo, error);
    break;
  case ('PASSWORD'):
    components = getPassword(signUpInfo, setSignUpInfo, error);
  // no default
  };
  return (
    <div>
      <Box sx={{flexGrow: 1}}>
        <AppBar position="static" sx={styles.navbar}
          elevation={0} component="form">
          <Toolbar>
            <Typography
              variant="h8"
              component="div"
              sx={styles.navbar__title}
            >
              <span onClick={() => history.goBack()}>Join Facebook</span>
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      { components }
      <Box sx={styles.loginPrompt__buttons}>
        <Button
          variant="contained"
          sx={styles.loginPrompt__buttonPrimary}
          onClick={() => nextSignUpInfo()}
          disableElevation
          aria-label='Continue-SignUp'
          role='button'
        >
          {signUpState === 3 ? 'Submit' : 'Next'}
        </Button>
      </Box>
    </div>
  );

  /**
  * Function updates on click
  */
  function nextSignUpInfo() {
    if ((signUpInfo.firstName.trim() === '' ||
         signUpInfo.lastName.trim() === '') &&
         signupFlags[signUpState] === 'NAME') {
      setError(true);
      return;
    }
    if (!(emailRegex.test(signUpInfo.email)) &&
      signupFlags[signUpState] === 'EMAIL') {
      setError(true);
      return;
    }

    if (!(phoneRegex.test(signUpInfo.phone)) &&
      signupFlags[signUpState] === 'PHONE') {
      setError(true);
      return;
    }

    if (signUpInfo.password.length < 6 &&
      signupFlags[signUpState] === 'PASSWORD') {
      setError(true);
      return;
    }
    setError(false);
    if (signUpState === 3) {
      signUpInfo.firstName = signUpInfo.firstName.trim();
      signUpInfo.lastName = signUpInfo.lastName.trim();
      signUpInfo.email = signUpInfo.email.trim();
      signUpInfo.phone = signUpInfo.phone.replace(/[^0-9]/g, '');
      context.state.marketplace.signUp({
        'name': signUpInfo.firstName + ' ' + signUpInfo.lastName,
        'email': signUpInfo.email,
        'phone': signUpInfo.phone,
        'password': signUpInfo.password,
      }, history);
      return;
    } else {
      setSignUpState(signUpState + 1);
    }
  }

  /**
 * Returns components to get signup info
 * @param {Object} state state value
 * @param {Function} setState function to update value
 * @param {Boolean} error Checks if textfield is missing
 * @return {Object} JSX
 */
  function getName(state, setState, error) {
    return ( <div>
      <Typography
        variant="h5"
        display="block"
        sx={styles.content_block}
      >
        What's Your Name
      </Typography>
      <Typography
        variant="h5"
        display="block"
        sx={styles.content_block_secondary}
      >
        Enter the Name you use in real life
      </Typography>
      <TextField
        sx={styles.field_nameContent}
        required
        error={error && state.firstName === ''}
        id="First Name Field"
        label="First Name"
        value={state.firstName}
        helperText={error && state.firstName === '' ?
          'Required' : ''}
        onChange={(ev) => setState({...state,
          firstName: ev.target.value})}
        aria-label='first-name-input'
      />
      <TextField
        sx={styles.field_nameContent}
        required
        error={error && state.lastName === ''}
        id="Last Name Field"
        label="Last Name"
        helperText={error && state.lastName === '' ?
          'Required' : ''}
        value={state.lastName}
        onChange={(ev) => setState({...state,
          lastName: ev.target.value})}
        aria-label='last-name-input'
      />
    </div>);
  };

  /**
 * Returns components to get signup info
 * @param {Object} state state value
 * @param {Function} setState function to update value
 * @param {Boolean} error Checks if textfield is missing
 * @return {Object} JSX
 */
  function getEmail(state, setState, error) {
    return ( <div>
      <Typography
        variant="h5"
        display="block"
        sx={styles.content_block}
      >
        Enter Your Email
      </Typography>
      <Typography
        variant="h5"
        display="block"
        sx={styles.content_block_secondary}
      >
        Enter the email where you can be reached. You can hide
        this from your profile later.
      </Typography>
      <TextField
        sx={styles.field_singleContent}
        required
        error={error}
        id="Email Field"
        label="Email"
        value={state.email}
        helperText={error ?
          'Email must be formated as XXX@XXXX.XXX' : ''}
        onChange={(ev) => setState({...state,
          email: ev.target.value})}
        aria-label='email-input'
      />
    </div>);
  };

  /**
 * Returns components to get signup info
 * @param {Object} state state value
 * @param {Function} setState function to update value
 * @param {Boolean} error Checks if textfield is missing
 * @return {Object} JSX
 */
  function getPhone(state, setState, error) {
    return ( <div>
      <Typography
        variant="h5"
        display="block"
        sx={styles.content_block}
      >
        Enter Your Phone Number
      </Typography>
      <Typography
        variant="h5"
        display="block"
        sx={styles.content_block_secondary}
      >
        Enter the mobile number where you can be reached.
        You can hide this from your profile later.
      </Typography>
      <TextField
        sx={styles.field_singleContent}
        required
        error={error}
        id="Phone Number Field"
        label="Phone Number"
        value={state.phone}
        helperText={error ?
          'Phone number must be formated as (XXX) XXX-XXXX' : ''}
        onChange={(ev) => setState({...state,
          phone: ev.target.value})}
        aria-label='phone-input'
      />
    </div>);
  };

  /**
 * Returns components to get signup info
 * @param {Object} state state value
 * @param {Function} setState function to update value
 * @param {Boolean} error Checks if textfield is missing
 * @return {Object} JSX
 */
  function getPassword(state, setState, error) {
    return ( <div>
      <Typography
        variant="h5"
        display="block"
        sx={styles.content_block}
      >
      Choose a Password
      </Typography>
      <Typography
        variant="h5"
        display="block"
        sx={styles.content_block_secondary}
      >
      Create a password with at least 6 characters. It should be something
      others couldn't guess
      </Typography>
      <form>
        <TextField
          sx={styles.field_singleContent}
          required
          error={error}
          id="Password Field"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={state.password}
          helperText={error ? 'Password requires more than 6 characters' : ''}
          onChange={(ev) => setState({...state,
            password: ev.target.value})}
          aria-label='password-input'
        />
      </form>
    </div>);
  };
}


