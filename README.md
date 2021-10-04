# Performance tests for mobx and redux

I wanted to test some perf differences for redux and mobx.

So far, I am testing updating long lists of data. mobx performs really well with no optimizations. Redux was very slow out the gate, and after some performance ops it is better, but not anywhere near mobx. Maybe someone with more redux knowledge can speed it up, but I'm linking the following:

1. mobx "just works" with great perf.
2. You can write regular JavaScript with better modularization (though createSlice helps a lot).
3. You can maintain your state infrastructure outside of redux/provider land, which makes interacting with various services much easier (think: React is _just_ a view layer).

## Available Scripts

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
