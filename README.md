# Lightstrip 

This is a small project started as an excuse to learn React via create-react-app, and how to build a vaguely functional web app. It's designed to run on a local server like a Raspberry Pi, hooked up to a WS2812B lightstrip. 

## Installation

### NodeJS

Assuming node and yarn are installed already, dependencies can be installed via `yarn install` in the main project directory. 

### Flask

While not required, I recommend creating a virtual environment inside the `flask` directory for the python libraries and dependencies.

Type `python -m venv venv` while inside the `flask` folder to create the environemnt. Then type `source venv/bin/activate` to run it. For more information on python virtual environments, you can [read more about them here.](https://docs.python.org/3/tutorial/venv.html)

To install the relevant dependencies simply type `pip install -r requirements.txt` 

## Deployment

While there is no formal requirement for deployment, I used `nginx` as my front end and `gunicorn` to host the backend. Deploying is beyond the scope of this readme (for now), so I recommend [this guide](https://blog.miguelgrinberg.com/post/how-to-deploy-a-react--flask-project) if you want instructions. 

## Arduino

While you can in theory control the lights directly from a raspberry pi, the pi GPIO pins only output 3.3v by default, while a WS2812B strip expects 5v. With the right chip, this can be circumvented, but if you want an alternative, an `arduino` file is included. By uploading the receiver code to the arduino and plugging it into a USB port, the pi or server running this software can send it signals to control the lightstrip. Just change the `arduino` variable in the `lightstrip_controls.py` file to `True` to enable this setting.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn flask`

Runs the flask backend in development mode. <br />
Any POST requests made to [http://localhost:5000](http://localhost:5000) should set the colors of the lightstrip.

Please note this script assumes the python virtual environment `venv` is located inside the `flask` folder of the project. If it's elsewhere, the script will likely fail. It can still be started manually, though.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
