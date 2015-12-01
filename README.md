# CP MEAN Boilerplate

## work in progress

### This boilerplate includes:

- Full MEAN Stack usage (MongoDB, ExpressJS, AngularJS & NodeJS)
- Gulp task manager (complete build task which transpiles and bundles the code, starts a server and watches all files -> watchify)
- Live Reload
- Browserify
- ES6 Support through Babelify
- Modularization through preprocessing
- Modularization of the server
- Built-in Authentication & Authorization Middlewares (Passport.js)
- Bootstrap
- Templatecache Support
- Own i18n module built on angular-translate (cp-ng-translate)
- Karma, Jasmine
- Less as main styling language
- Express Sessions stored in MongoDB
- ESLint

### Directory Structure:

app (whole code)

app/js (main coding dir)

app/misc (translation files)

app/styles

app/images

build (all files the server is serving to the clients, created during gulp build)

gulp

server

logs (created from "unit" or "lint" task)


### Gulp Tasks:
dev
-> starts the full build process including the server

server
-> just starts the server

unit
-> starts chrome and executes all unit tests

unit --type chrome OR firefox OR safari OR ie OR phantom OR all
-> starts corresponding browser(s) and executes all unit tests

There are several more tasks which are executed bei the "dev" task. Look in to gulp/tasks for the other ones.
For more information on setup look into gulp/config.js file.


### File naming:

There are several conventions in this boilerplate which should be sticked to for the gulp processes.

- JS (ES5) -> *.js
- JS (ES6) -> *.es6
- Templatecache -> *.cache.html
- Unit tests -> *.spec.js or *.spec.es6

