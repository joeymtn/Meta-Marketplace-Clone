/**
 * Marketplace Fetch Class
 */
export default class MarketplaceAPI {
  /**  Constructor Class stores the following:
   *  -> hostname: hostname for backend
   */
  constructor() {
    this.hostname = 'http://localhost:3010/v0/';
  }

  /**
   * GET Call for All Item listings
   * @param {Function} setState
   */
  getMarketplaceListings(setState) {
    fetch('http://localhost:3010/v0/listing')
      .then( (response) => {
        // if (!response.ok) {
        //   throw response;
        //   // es-lint disable no-trailing-spaces
        // }
        return response.json();
      })
      .then((json) => {
        setState({marketplaceListings: json});
      });
    // .catch((error) => {
    //   console.error(`ERROR: ${error.toString()}`);
    // });
  }
  /**
   * GET Call for All Item listings
   * @param {Function} setState
   * @param {string} id uuid
   */
  getMarketplaceListingsByCategory(setState, id) {
    fetch(`http://localhost:3010/v0/listing?category=${id}`)
      .then( (response) => {
        // if (!response.ok) {
        //   throw response;
        //   // es-lint disable no-trailing-spaces
        // }
        return response.json();
      })
      .then((json) => {
        setState({marketplaceListings: json});
      });
    // .catch((error) => {
    //   // console.error(`ERROR: ${error.toString()}`);
    // });
  }
  /**
   * @param {Function} setState
   * @param {string} id
   * @param {token} bearerToken
   * @param {json} data
  */
  getMarketplaceListingsByUser(setState, id, bearerToken, data) {
    fetch(`http://localhost:3010/v0/userListing?users_id=${id}`, {
      method: 'get',
      headers: new Headers({
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      }),
    })
      .then((response) => {
        // if (!response.ok) {
        //   throw response;
        // }
        return response.json();
      })
      .then((json) => {
        setState({marketplaceListings: json});
      });
  }
  /**
   * GET Call for All Item listings
   * @param {Function} setState
   * @param {keyword} keyword string
   * @param {category} category string
   */
  searchMarketplaceListings(setState, keyword, category) {
    let listingURL = `http://localhost:3010/v0/listing`;
    keyword = keyword.trim();
    if (keyword.length === 0) {
      return;
    }
    if (category && keyword) {
      listingURL += `?category=${category}`;
      listingURL += `&keyword=${keyword}`;
    } else {
      listingURL += `?keyword=${keyword}`;
    }

    fetch(listingURL)
      .then( (response) => {
        // if (!response.ok) {
        //   throw response;
        //   // es-lint disable no-trailing-spaces
        // }
        return response.json();
      })
      .then((json) => {
        setState({marketplaceListings: json});
      });
    // .catch((error) => {
    //   // console.error(`ERROR: ${error.toString()}`);
    // });
  }

  /**
   * Apply global categories
   * @param {Function} setState
   */
  getCategory(setState) {
    fetch(`http://localhost:3010/v0/category`)
      .then((response) => {
        // if (!response.ok) {
        //   // throw response;
        // }
        return response.json();
      })
      .then((json) => {
        setState({globalCategory: json});
      })
      .catch((error) => {
        // console.error(`ERROR: ${error.toString()}`);
      });
  }

  /**
   * GET categories by parent id
   * @param {string} parent parent id
   * @param {Function} setState setState function
   */
  getCategoryByParent(parent, setState) {
    fetch(`http://localhost:3010/v0/category?parent=${parent}`)
      .then((response) => {
        // if (!response.ok) {
        //   throw response;
        // }
        return response.json();
      })
      .then((json) => {
        setState({currentSubcategory: json, pressCategory: false});
      });
    // .catch((error) => {
    //   // console.error(`ERROR: ${error.toString()}`);
    // });
  }

  /**
   * POST call for logging in
   * @param {Function} setState
   * @param {Object} data - Should contain email and password
   * @param {Object} history - history variable for changing route
   * @param {Function} setError - Sets login Error
   * @param {Reference} mount - Reference to a boolean that states mount state
   */
  getAuthenicationToken(setState, data, history, setError, mount) {
    fetch('http://localhost:3010/v0/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then( (response) => {
        if (!response.ok) {
          throw response.status;
        }
        return response.json();
      })
      .then((json) => {
        setState({user: json});
        localStorage.setItem('user', JSON.stringify(json));
        history.push('/');
      })
      .catch((error) => {
        if (error === 500) {
          alert(`ERROR: ${error.toString()}`);
        }
        setError(true);
      });
  };

  /**
   * POST call for logging in
   * @param {Object} data - Should contain name, email, phone, and password
   * @param {Object} history - history variable for changing route
   */
  signUp(data, history) {
    fetch('http://localhost:3010/v0/signUp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then( (response) => {
        if (!response.ok) {
          throw response.status;
        }
        return response.status;
      })
      .then((status) => {
        history.push({
          pathname: '/signup/confirm',
          state: {error: false},
        });
      })
      .catch((error) => {
        if (error === 500 && !(alert(`ERROR: ${error.toString()}`))) {
          history.push('/login');
        } else {
          history.push({
            pathname: '/signup/confirm',
            state: {error: true},
          });
        }
      });
  };

  /**
   * POST Call for Creating a listings
   * @param {Function} setState
   * @param {String} bearerToken
   * @param {Object} data
   */
  createMarketplaceListings(setState, bearerToken, data) {
    fetch('http://localhost:3010/v0/listing', {
      method: 'post',
      headers: new Headers({
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),
    })
      .then( (response) => {
        // if (!response.ok) {
        //   throw response;
        //   // es-lint disable no-trailing-spaces
        // }
        return response.json();
      })
      .then((json) => {
        setState({creatingListing: false});
        this.getMarketplaceListings(setState);
      });
    // .catch((error) => {
    //   console.error(`ERROR: ${error.toString()}`);
    // });
  }
};
