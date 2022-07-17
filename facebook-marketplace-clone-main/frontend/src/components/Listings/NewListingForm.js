import * as React from 'react';
import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import {GlobalContext} from '../GlobalContextProvider';
import Button from '@mui/material/Button';

const styles = {
  listingForm_container: {
    position: 'fixed',
    top: '50px',
    left: '0',
    width: '100%',
    height: '100%',
    overflow: 'scroll',
  },
  listingForm__header: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  listingForm__title: {
    padding: '20px 0px',
    fontWeight: '600',
  },
  listingForm__buttonClose: {
    position: 'fixed',
    right: '5%',
    top: '75px',
    backgroundColor: '#ddd',
    zIndex: '1000',
  },
  listingForm_options: {
    padding: '20px',
  },
  loginPrompt__buttonPrimary: {
    'backgroundColor': '1976D2',
    'margin': '10px',
    'padding': '5px',
    'width': '50%',
    'color': 'white',
    'fontSize': '15px',
    'textTransform': 'none',
    '&:hover': {
      backgroundColor: '#6E9FD0',
    },
  },
};

const globalCategory = [
  {id: '608eab18-05a5-4f03-a6c6-eb06e36f2b6d', name: 'Vehicle'},
  {id: '65e66254-47a7-4607-a9c9-2a2aa112dc03', name: 'Real Estate'},
];

/**
 * Returns JSX with new Listing
 * @return {Object} JSX for React component
 */
export default function NewListingForm() {
  const context = React.useContext(GlobalContext);
  const [type, setType] = React.useState(globalCategory[0]);
  const [error, setError] = React.useState({flag: false});
  const [postInfo] = React.useState({content: {}});
  const vehicleFilter = ['Make', 'Color', 'Mileage'];
  const realEstate = ['Bedrooms', 'Bathrooms', 'Sq. Footage', 'Pool', 'Garage'];
  const [filter, setFilter] = React.useState(vehicleFilter);

  const handleType = (item) => {
    setType(item);
    postInfo.category_id = item.id;
    item.name === 'Vehicle' ? setFilter(vehicleFilter) : setFilter(realEstate);
  };
  /** Function checks for listing input */
  const checkSubmit = () => {
    if (postInfo.content.imageLink === undefined ||
        postInfo.content.price === undefined ||
        postInfo.content.description === undefined) {
      setError({flag: true});
      return;
    }
    for (const ele of filter) {
      if (postInfo.content[ele.toLowerCase()] === undefined) {
        setError({flag: true});
        return;
      }
    }
    postInfo.user_id = context.state.user.id;
    postInfo.category_id = type.id;
    context.state.marketplace.createMarketplaceListings(
      context.setState,
      context.state.user.accessToken,
      postInfo,
    );
  };
  return (
    <Paper sx={styles.listingForm_container}>
      <Box sx={styles.listingForm__header}>
        <Typography variant='h6' component='div'
          sx={styles.listingForm__title}>
          {`${type.name} For Sale`}
        </Typography>
        <IconButton size='small'
          aria-label='close-create-listing'
          sx={styles.listingForm__buttonClose}
          onClick={() =>
            context.setState({creatingListing: false})}>
          <CloseIcon/>
        </IconButton>
      </Box>
      <Divider/>
      <Box sx={styles.listingForm_options}>
        <List
          sx={{
            'width': '100%',
            'maxHeight': '80%',
            'bgcolor': 'background.paper',
            'position': 'relative',
            '& ul': {padding: 0},
          }}
          subheader={<li />}
        >
          <Typography gutterBottom variant="h6" component="div">
          User: Person
          </Typography>
          <Typography gutterBottom variant="caption1" component="div">
          Listing to Marketplace
          </Typography>
          <TextField
            id="outlined-select-type"
            select
            label="Select"
            value={type}
            onChange={(event) => handleType(event.target.value)}
            variant="filled"
            helperText="Please select category type"
          >
            {globalCategory.map((option) => (
              <MenuItem key={option.name + 'id'} value={option}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <Divider />
          <Typography gutterBottom variant="h6" component="div">
          Photo Upload
          </Typography>
          <Typography gutterBottom variant="caption1" component="div">
          We only store images URLs. Add an Image URL
          </Typography>
          <TextField
            helperText="Required"
            error={error.flag &&
              (postInfo.content.imageLink === undefined ||
                postInfo.content.imageLink === '') }
            id="Photo URL"
            label="Photo URL"
            onChange={(event) => {
              postInfo.content.imageLink = event.target.value;
            }}
            variant="filled"
          />
          <Divider />
          <Typography gutterBottom variant="h6" component="div">
            {`About This ${type.name}`}
          </Typography>
          <Typography gutterBottom variant="caption1" component="div">
            {`Help buyers know more about the ${type.name.toLowerCase()} 
              you're listing.`}
          </Typography>
          <List>
            {filter.map((text, index) => (
              <ListItem button key={text}>
                <TextField
                  helperText="Required"
                  error={error.flag &&
                    (postInfo.content[text.toLowerCase()] === undefined ||
                      postInfo.content[text.toLowerCase()] === '')}
                  id={text}
                  label={text}
                  onChange={(event) => {
                    text = text.toLowerCase();
                    postInfo.content[text] = event.target.value;
                  }}
                  variant="filled"
                />
              </ListItem>
            ))}
          </List>
          <Divider />
          <Typography gutterBottom variant="h6" component="div">
          Price
          </Typography>
          <Typography gutterBottom variant="caption1" component="div">
            {`Enter your price for this ${type.name.toLowerCase()}.`}
          </Typography>
          <TextField
            helperText="Required"
            error={error.flag &&
              (postInfo.content.price === undefined ||
                postInfo.content.price === '') }
            id="Price"
            label="Price"
            onChange={(event) => {
              postInfo.content.price = event.target.value;
            }}
            variant="filled"
          />
          <Divider />
          <Typography gutterBottom variant="h6" component="div">
          Description
          </Typography>
          <Typography gutterBottom variant="caption1" component="div">
            {`Tell buyers anything that you haven't had the chance
             to include yet about your ${type.name.toLowerCase()}.`}
          </Typography>
          <TextField
            helperText="Required"
            id="Description"
            error={error.flag &&
              (postInfo.content.description === undefined ||
                postInfo.content.description === '') }
            label="Description"
            multiline
            rows={4}
            onChange={(event) => {
              postInfo.content.description = event.target.value;
            }}
            variant="filled"
          />
        </List>
        <Divider />
        <Button
          variant="contained"
          sx={styles.loginPrompt__buttonPrimary}
          onClick={() => checkSubmit()}
          disableElevation
          aria-label='Continue-SignUp'
          role='button'
        >
          Submit
        </Button>
      </Box>
    </Paper>
  );
}
