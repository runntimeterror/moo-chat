# CMPE-281 Project 2 - Moo Chat

- [Soham Bhattacharjee](mailto:soham.bhattacharjee@sjsu.edu)
- [Gabriel Chen](mailto:gabriel.chen@sjsu.edu)
- [Rajat Banerjee](mailto:rajat.banerjee@sjsu.edu)
- [Rohan Patel](mailto:rohan.patel@sjsu.edu)


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Releases
Released to S3 and CF via Github Actions. To trigger a release, tag a commit and push tags to master.
```
$ git checkout master
$ git tag -a v{semver} -m "description"
$ git push --tags
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm dev`

Launches the electron project in watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run electron`
Starts the electron application.
