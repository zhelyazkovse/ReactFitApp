<img src="https://webassets.telerikacademy.com/images/default-source/logos/telerik-academy.svg" alt="logo" width="300px" style="margin-top: 20px;"/>

## Setting up authentication and database with Firebase

<br>

### 1. Project structure

You will find the following folders and files:

- `/components` - contains all the smaller components used to build the application
- `/context/AppContext.js` - the main context provider where all the *global* (or shared) state of the application will be passed to
- `/views` - contains all the routed components - `Home`, `Login`, `Register`, `Profile`, `Tweets`
- `App.jsx` - the composition root of the application

Please note all the component files have the `.jsx` extension and all of the rest of the JavaScript files have the standard `.js` extension.

<br>

### 2. Project goals

In its initial form the `Not Twitter` app have all the rudimentary functionalities, with hardcoded data and mock-ups of the real or desired features. Our goal is to replace the hardcoded code and mockups with a real data layer which will come from Google Firebase services.

<br>

### 3. Firebase and Firebase console

Make sure to register for the Firebase services: https://firebase.google.com/

Choose the free *Spark Plan* tier. It is good enough for testing and developing small applications.

Finally, open the [Firebase Console](https://console.firebase.google.com/).

<br>

### 4. Creating a project

Click on the `Add project` card and follow the steps:

- Step 1: type in a project name and agree with terms
- Step 2: we don't need Analytics, so it's irrelevant what you pick on this step
- Step 3: select an account - pick your default account option and click `Create Project`

Project creation will take some time.

<br>

### 5. Creating an application with Firebase inside the project

You should be on the `Overview` page by now. Under `Get started by adding Firebase to your app` you will find several options. Click on the `Web` icon and follow the instructions:

- Step 1: type in an app name, you can check the `Firebase Hosting` setup if you plan to host the application on Firebase (for now we don't need that), and finally click on `Register App`
- Step 2: you will be provided with instructions on how to setup the app with 1) npm or 2) inside the HTML page, copy the configuration object, we will need it later, it should looks something like this:

```js
const firebaseConfig = {
  apiKey: "whatevertheapikeyis",
  authDomain: "not-twitter-demo.firebaseapp.com",
  projectId: "not-twitter-demo",
  storageBucket: "not-twitter-demo.appspot.com",
  messagingSenderId: "00000000000000",
  appId: "1:0000000000000000:web:a0000000000000c",
  measurementId: "G-SDPFSPVKPK"
};
```

<br>

### 6. Adding Realtime Database to the project

From the console go to `Realtime Database`. Click on the `Create Database` button and follow the instructions:

- Step 1: pick a location for the database (for Europe you might find the `europe-west1` option)
- Step 2: select mode - you have two options - **locked** and **test** mode, pick the **test** mode (notice it will allow you to use it within the next 30 days before access is denied - you can change that later), and finally click `Enable`

When everything is created and the process is complete you will see the empty database and the database url, which we need to add to the configuration object:

```js
const firebaseConfig = {
  apiKey: "whatevertheapikeyis",
  authDomain: "not-twitter-demo.firebaseapp.com",
  projectId: "not-twitter-demo",
  storageBucket: "not-twitter-demo.appspot.com",
  messagingSenderId: "00000000000000",
  appId: "1:0000000000000000:web:a0000000000000c",
  measurementId: "G-SDPFSPVKPK",
  // add this:
  databaseURL: "https://not-twitter-demo-default-rtdb.europe-west1.firebasedatabase.app/"
};
```

Note the url includes the region, otherwise it might not work.

<br>

### 7. Adding and setting up Firebase inside the react project

Now that nearly everything is ready on the Firebase console side of the work, we need to install a few dependencies and setup Firebase for the react app.

The main dependency is `firebase`:

```
npm i firebase
```

We also need a helper library for handling authentication in a easier manner:

```
npm i react-firebase-hooks
```

Now it's time to create the configuration file inside `src/config/firebase-config.js`, it should look similar to this:

```js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

export const firebaseConfig = {
  // your configuration here
};

export const app = initializeApp(firebaseConfig);
// the Firebase authentication handler
export const auth = getAuth(app);
// the Realtime Database handler
export const db = getDatabase(app);
```

<br>

### 8. Adding authentication

We're now ready to implement authentication in the app. This requires several steps:

- select the type of authentication the Firebase application uses - email and password, authentication with Google, Facebook, Twitter accounts, etc.
- setup the global (shared) state through a **context** provider and ** context hooks**
- implement register, login and logout features

<br>

#### 8.1 Select the authentication type

From the Firebase console go to `Authentication`, click on the `Get started` button, select the `Email/Password` native provider. Enable the option for `Email/Password` authentication and keep `Email link` disabled. Finally click on `Save`.

You can manage users from the `Users` tab.

<br>

#### 8.2 Setup the application context

The `src/providers/AppContext.js` is already created for us:

```js
import { createContext } from 'react';

const AppContext = createContext({
  user: null,
  userData: null,
  setContext() {
    // real implementation comes from App.jsx
  },
});

export default AppContext;
```

The `AppContext` is a special kind of a *wrapper* component which serves for passing shared state in lazy manner. The standard way of prop drilling (passing state as prop from parent to child component) is very cumbersome and error prone in when there are more than two components in the drill chain and also adds complexity to component composability. The Context API provides a way to get a reference to the state if and where it's needed without relying on passing props. The lazy part is the *context hook* that needs to be called in order to access the shared state (also called context).

In order to register the context we need to actually store the value of the state somewhere, ideally at the topmost component (App).

```js
// App.js
  ...
  const [appState, setAppState] = useState({
    user,
    userData: null,
  });
  ...
```

Then we need to wrap the JSX in App with the context provider component:

```jsx
  ...
  return (
    <AppContext.Provider value={{...appState, setContext: setAppState}}>
      <BrowserRouter>
        <div className="App">
          ...
        </div>
      </BrowserRouter>
    </AppContext.Provider>
  );
  ...
```

Now all the components nested in the context provider can use the context hook in order to access the context.

<br>

#### 8.3 Register, login and logout users

First we're going to (for the most part) separate the data layer (the database) from the components using service files. For the authentication features we create `src/services/auth.service.js`

```js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../config/firebase-config';

export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = () => {
  return signOut(auth);
};
```

All the functions imported from firebase auth are asynchronous. All auth data is stored in and by the authentication services provided by Firebase.

Since all users will have a unique handler (`@user_handler`) we will need to store that information as well using Realtime Database. User features will be implemented in `src/services/users.service.js`

Each collection can have one index used to query data, so we will go to the `Rules` tab in the Realtime Database view and set some rules:

```json
{
  "rules": {
    ".read": "now < ...",  // set up the actual date here
    ".write": "now < ...",  // set up the actual date here
    "users": {
      ".indexOn": "uid",
    },
  }
}
```

```js
import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getUserByHandle = (handle) => {

  return get(ref(db, `users/${handle}`));
};

export const createUserHandle = (handle, uid, email) => {

  return set(ref(db, `users/${handle}`), { handle, uid, email, createdOn: new Date(), likedTweets: {} })
};

export const getUserData = (uid) => {

  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};
```

We'll pay more attention to working with the Realtime Database in a bit.

Now, we can make some composition in the `Register` component:

```jsx
  // We need access to the shared app state
  const { setContext } = useContext(AppContext);

  // the actual registration code
  const onRegister = () => {
  // TODO: validate the form before submitting request

  // check if an user with the handle exist
  getUserByHandle(form.handle)
    .then(snapshot => {
      if (snapshot.exists()) {
        throw new Error(`Handle @${form.handle} has already been taken!`);
      }

      return registerUser(form.email, form.password);
    })
    .then(credential => {

      // the handle is unique, so create a user record with the handle, user id, data of creation, email and a map to liked tweets (an empty object initially)
      return createUserHandle(form.handle, credential.user.uid, credential.user.email)
        .then(() => {
          setContext({
            user: credential.user,
          });
        });
    })
    .then(() => {
      navigate('/');
    })
    .catch(e => console.log(e));
};
```

The logic for the login is similar excluding validating and creating user handles.

```jsx
  // We need access to the shared app state
  const { setContext } = useContext(AppContext);

  const onLogin = () => {
    // TODO: validate form before submitting

    loginUser(form.email, form.password)
      .then(credential => {
        setContext({
          user: credential.user,
        });
      })
      .then(() => {
        navigate('/');
      })
      .catch(e => console.log(e.message));
  };
```

And finally we can update the App component for conditional rendering based on auth state.

```jsx
  // logout the user
  const onLogout = () => {
    logoutUser()
      .then(() => {
        setAppState({
          user: null,
          userData: null,
        });
      });
  };

  ...
    <Link to='/'>Home</Link> &nbsp;
      {user === null && <Link to='/register'>Register</Link>} &nbsp;
      {user === null && <Link to='/login'>Login</Link>} &nbsp;
      {user !== null && <Link to='/tweets'>Tweets</Link>} &nbsp;
      {user !== null && <Link to='/' onClick={onLogout}>Logout</Link>}
    </div>
  ...

  // TODO: apply the same logic to routes
```

<br>

#### 8.4 Preserve auth state

In its current state the application has two main problems:

- registration will not work because of improper indexing which will be fixed in a bit
- upon page refresh the logged user will loose their auth status and will need to log again

The solution for the second problem is the `react-firebase-hooks` library. Update the App component

```jsx
  // this hook will check storage for user credentials (eventually stored during user login with firebase functions) and retrieve the actual authentication state (user will either be null or the user object from the last persisted login)
  // the loading status will be true while the hooks retrieves the status of the user and will be set to false when the user has been retrieved (object or null)
  // the error will be set only when specific problem with the auth state is detected
  const [user, loading, error] = useAuthState(auth);

  // update the user in the app state to match the one retrieved from the hook above
  if (appState.user !== user) {
    setAppState({ user });
  }

  // finally retrieve user data if the user is logged (this is also broken and will be fixed in a bit)
  useEffect(() => {
    if (user === null) return;

    getUserData(user.uid)
      .then(snapshot => {
        if (!snapshot.exists()) {
          throw new Error('Something went wrong!');
        }

        setAppState({
          ...appState,
          userData: snapshot.val()[Object.keys(snapshot.val())[0]],
        });
      })
      .catch(e => alert(e.message));
  }, [user]);
```

<br>

### 9. Database design and rules

Realtime Database uses the concept of *documents*. Documents are in fact collections of objects, represented as objects themselves. Since this application will have two main data models (not counting authentication entities, which are handled by Firebase auth services), we need to create (by requests, not manually) two documents - one for each model.

We can structure the database in the following format:

```json
{
  "users": {
    "pesho": {
      "email": "pesho@domain.com",
      "handle": "pesho",
      "likedTweets": {
        "-MyDdCGQF655lzpLNU6r": true
      },
      "uid": "rxLb47p8sTM8Dzj5Qnjh1Y4YqHE3"
    },
    // ...
  },
  "tweets": {
    "-MyDdCGQF655lzpLNU6r": {
      "author": "pesho",
      "content": "Hello world!",
      "createdOn": 1647365641352,
      "likedBy": {
        "pesho": true,
        "gosho": true,
        "penka": true
      }
    },
    "-MyDeD7PRcDm-3S5VxMs": {
      "author": "pesho",
      "content": "React is easy T_T",
      "createdOn": 1647365907015,
      "likedBy": {}
    }
    // ...
  }
}
```

Each document (`users`, `tweets`) is a collection of objects, where each object is the value of a key-value pair where the key can be created manually by the implementation (in the case of `users` we decide what the unique key identifier will be, i.e. "pesho") or by adding children to the collection (all the properties / unique identifiers in the `tweets` collection for example).

Each **child** of the collection (or each element of the collection) has the same type, i.e. every *user* object can be represented as

```ts
type User = {
  uid: string;
  email: string;
  handle: string;
  likedTweets: object;
}
```

and every tweet:

```ts
type Tweet = {
  author: string;
  content: string;
  createdOn: number;
  likedBy: object;
}
```

where `likedTweets` and `likedBy` are objects used for mapping of relations between objects.

Users and tweets have one mapping where the tweet's `author` property has the same value as the `handle` property of the user that created the tweet.

However, sometimes we need to map one object of a collection to multiple objects from another collection. That can be achieved with a mapping object such as `likedTweets` and `likedBy`, where each object has keys that match a unique identifier of another object, i.e. the "pesho" user and one of the tweets:

```js
// users
"pesho": {
  "email": "pesho@domain.com",
  "handle": "pesho",
  "likedTweets": {
    "-MyDdCGQF655lzpLNU6r": true // has relation to the tweet by the same id
  },
  "uid": "rxLb47p8sTM8Dzj5Qnjh1Y4YqHE3"
},

// tweets
"-MyDdCGQF655lzpLNU6r": {
  "author": "pesho",
  "content": "Hello world!",
  "createdOn": 1647365641352,
  "likedBy": {
    "pesho": true, // has a reciprocal relation to "pesho"
    "gosho": true,
    "penka": true
  }
},
```

Each collection can have one index used to query data, so we will go to the `Rules` tab in the Realtime Database view and set some rules:

```json
{
  "rules": {
    ".read": "now < ...",  // set up the actual date here
    ".write": "now < ...",  // set up the actual date here
    "users": {
      ".indexOn": "uid",
    },
    "tweets": {
      ".indexOn": "author",
    },
  }
}
```

You may notice we don't put the `users` index to the `handle`. That is because we use the handle as a unique key for writing the user to the document, so we achieve implicit indexing.

<br>

### 10. Realtime Database queries

There are several styles of accessing the Realtime database, but for now we will stick to asynchronous queries.

Before we start making queries there are several terms we need to consider:

- *document* - a collection of objects of a specific type. Each "element" of the collection is a key-value pair inside the collection, keys can be manually *set* by the code or generated by *pushing* the element
- *ref* - a reference to a document, it's direct child or any inner child (nested object), i.e. `users` (get the entire collection), `users/pesho` (get the specified user), `users/pesho/likedTweets` (get the nested `likedTweets` object of `pesho`), etc.
- *query* - a special object specifying what information to access and how to actually access is, it requires a reference to a collection, and may include constraints like `equalTo`, `orderByChild`, `orderByKey`, etc.
- *action/verb* - the type of request we want to execute, i.e. `push` will add a *child* to a collection (the id will be automatically generated), `get` will read entire document (collection) or some nested child/children, `set` will write/rewrite a *child* and `update` will trigger changes on one or more *children*


```js
import { ref, push, get, set, update, query, equalTo, orderByChild, orderByKey } from 'firebase/database';

// define service functions
```

Examples of *refs* (they require the database to be passed as first argument):

- `ref(db, 'users')` - references the whole `users` collection
- `ref(db, 'users/pesho')` - references the specific *child* (user) 'pesho'
- `ref(db, 'messages/pesho/important`) - references the specified nested *child* of the collection `messages`

Example of a *query*:

- `query(ref(db, 'tweets'), orderByChild('author'), equalTo('pesho'))` - this query will access all *children* of the `tweets` document and retrieve only those whose `author` *child* (or property) is equal to `pesho` - !! don't forget to set the `author` key as an index in the *ruleset* of the database

Examples of *actions*:

- `get(ref(db, 'users/pesho'))` - retrieve the *child* `pesho` of the `users` document
- `set(ref('users/pesho'), { uid: 1, handle: 'pesho', email: 'pesho@domain.com', likedTweets: {} })` - adds the *child* `pesho` with the specified object value to the collection `users` (manual id of the *child* element)
- `update(ref(db), { 'users/pesho/email': 'pesho2@domain.com' })` - applies a *partial* update to the database, the passes object describes the update to one or more *children* where the key of each key-value pair is the full path to the value that needs to be updated
- `push(ref(db, 'messages/pesho/important'), { message: "Don't forget to update your email!", date: Date.now() })` - adds a new *child* to the referenced object, the id will be automatically generated by the database

Finally, all actions return promise-like object that can be consumed as promises. The result of the action is a *snapshot* object that contains several properties and methods, but we will only use two of them:

- `snapshot.exists()` - true if the requested data exists in the document
- `snapshot.val()` - the value of the requested data if it exists, otherwise null

<br>

### 11. Adding the rest of the features

Now that we have basic understanding on how the Realtime Database works, we can complete the implementation.

Create a the `src/services/tweets.service.js`

```js
import { ref, push, get, query, equalTo, orderByChild, update } from 'firebase/database';
import { db } from '../config/firebase-config';

const fromTweetsDocument = snapshot => {
  const tweetsDocument = snapshot.val();

  return Object.keys(tweetsDocument).map(key => {
    const tweet = tweetsDocument[key];

    return {
      ...tweet,
      id: key,
      createdOn: new Date(tweet.createdOn),
      likedBy: tweet.likedBy ? Object.keys(tweet.likedBy) : [],
    };
  });
}

export const addTweet = (content, handle) => {

  return push(
    ref(db, 'tweets'),
    {
      content,
      author: handle,
      createdOn: Date.now(),
    },
  )
    .then(result => {

      return getTweetById(result.key);
    });
};

export const getTweetById = (id) => {

  return get(ref(db, `tweets/${id}`))
    .then(result => {
      if (!result.exists()) {
        throw new Error(`Tweet with id ${id} does not exist!`);
      }

      const tweet = result.val();
      tweet.id = id;
      tweet.createdOn = new Date(tweet.createdOn);
      if (!tweet.likedBy) tweet.likedBy = [];

      return tweet;
    });
};

export const getLikedTweets = (handle) => {

  return get(ref(db, `users/${handle}`))
    .then(snapshot => {
      if (!snapshot.val()) {
        throw new Error(`User with handle @${handle} does not exist!`);
      }

      const user = snapshot.val();
      if (!user.likedTweets) return [];

      return Promise.all(Object.keys(user.likedTweets).map(key => {

        return get(ref(db, `tweets/${key}`))
          .then(snapshot => {
            const tweet = snapshot.val();

            return {
              ...tweet,
              createdOn: new Date(tweet.createdOn),
              id: key,
              likedBy: tweet.likedBy ? Object.keys(tweet.likedBy) : [],
            };
          });
      }));
    });
};

export const getTweetsByAuthor = (handle) => {

  return get(query(ref(db, 'tweets'), orderByChild('author'), equalTo(handle)))
    .then(snapshot => {
      if (!snapshot.exists()) return [];

      return fromTweetsDocument(snapshot);
    });
};

export const getAllTweets = () => {

  return get(ref(db, 'tweets'))
    .then(snapshot => {
      if (!snapshot.exists()) {
        return [];
      }

      return fromTweetsDocument(snapshot);
    });
};

export const likeTweet = (handle, tweetId) => {
  const updateLikes = {};
  updateLikes[`/tweets/${tweetId}/likedBy/${handle}`] = true;
  updateLikes[`/users/${handle}/likedTweets/${tweetId}`] = true;

  return update(ref(db), updateLikes);
};

export const dislikeTweet = (handle, tweetId) => {
  const updateLikes = {};
  updateLikes[`/tweets/${tweetId}/likedBy/${handle}`] = null;
  updateLikes[`/users/${handle}/likedTweets/${tweetId}`] = null;

  return update(ref(db), updateLikes);
};
```

We can use the service to complete the functionalities for reading, creating, liking and disliking tweets. You can figure that on your own.

<br>

### 12. Useful links

Firebase Authentication:

- [Getting started](https://firebase.google.com/docs/auth/web/start)
- [Managing users](https://firebase.google.com/docs/auth/web/manage-users)
- [Authentication with email and password](https://firebase.google.com/docs/auth/web/password-auth)

Realtime Database:

- [Getting started](https://firebase.google.com/docs/database/web/start?hl=en&authuser=0)
- [Structuring the database](https://firebase.google.com/docs/database/web/structure-data?hl=en&authuser=0)
- [Reading and writing data](https://firebase.google.com/docs/database/web/read-and-write?hl=en&authuser=0)
- [Working with lists of data](https://firebase.google.com/docs/database/web/lists-of-data?hl=en&authuser=0)

<br>

### 13. Advanced features

File storage:

- [Getting started](https://firebase.google.com/docs/storage/web/start?hl=en&authuser=0)
- [Creating a file reference](https://firebase.google.com/docs/storage/web/create-reference?hl=en&authuser=0)
- [Upload a file](https://firebase.google.com/docs/storage/web/upload-files?hl=en&authuser=0)
- [Download a file](https://firebase.google.com/docs/storage/web/download-files?hl=en&authuser=0)
- [Delete a file](https://firebase.google.com/docs/storage/web/delete-files?hl=en&authuser=0)

Firebase hosting:

- [Getting started](https://firebase.google.com/docs/hosting/quickstart?hl=en&authuser=0)