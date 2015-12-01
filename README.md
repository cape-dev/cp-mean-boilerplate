# CP MEAN Boilerplate

## work in progress

### This boilerplate includes

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

### Installation

You need MongoDB installed and started locally

You need Gulp installed globally:

```sh
$ npm install -g gulp
```

```sh
$ git clone https://github.com/kamekazemaster/cp-mean-boilerplate.git boilerplate
$ cd boilerplate
$ npm install
$ gulp dev
```

### Directory Structure

- app (whole code)
- app/js (main coding dir)
- app/misc (translation files)
- app/styles
- app/images
- build (all files the server is serving to the clients, created during gulp build)
- gulp
- server
- logs (created from "unit" or "lint" task)

### Server

The server follows the principle of modularization.
The main server is the server/server.js file which loads all additional server files.
These are logically seperated in **modules** and **extension**.
To choose which file to load and additionally define a name for these module/extension for injecting in other files please refer to
server/config.json *(order of the entries matters!!!)*

Modules are server modules which extend the api of the server. That means that all
modules are aware of the http server object.

Extensions are modules which only add functionality to the server. They do *NOT* alter the server api.
Therefore they are *NOT* aware of the http server object.

### Mongo Usermodel

see server/extensions/usermodel.js for more information


### Gulp Tasks
 
```sh
$ gulp dev
**starts the full build process including the server**
```
```sh
$ gulp server
**just starts the server**
```
```sh
$ gulp unit
**starts chrome and executes all unit tests**
```
```sh
$ gulp unit --type chrome OR firefox OR safari OR ie OR phantom OR all
**starts corresponding browser(s) and executes all unit tests**
```
```sh
$ gulp lint
**lints all files corresponding to the gulp/config.js file with eslint (eslint config is in .eslintrc file)**
```

There are several more tasks which are executed bei the "dev" task. Look in to gulp/tasks for the other ones.

*For more information on setup look into gulp/config.js file.*


### File naming

There are several conventions in this boilerplate which should be sticked to for the gulp processes.

- JS (ES5) -> *.js
- JS (ES6) -> *.es6
- Templatecache -> *.cache.html
- Unit tests -> *.spec.js or *.spec.es6

License
----

MIT