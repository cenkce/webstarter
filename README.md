# webstarter #

Web application boilerplate for front-end devlepoers.

## Installation ##

  `$ git clone git@github.com:cenkce/webstarter.git`

- Install Nodejs requirements
  
  `$ npm install`

- Install Bower requirements

  `$ bower install`

## Usage ##

Build project files :

  `$ gulp`
  
  or 
  
  `$ gulp --production=1`

And preview via BrowserSync :

  `$ gulp watch`

## Assets and Vendor Build Management : ##

Use bower and manifest.json

manifest.json Example:


'{
   "dependencies": {
     "vendor.js": {
       "files": [
       ],
       "vendor": [],
       "bower": ["jquery",
                 "modernizr",
                 "bootstrap-sass-official",
                 "angular",
                 "angular-ui-router",
                 "angular-animate",
                 "angular-resource",
                 "almond"
           ],
       "main": true
     },
     "app.js": {
       "files": [
       ],
       "vendor": [
         "./app/**/*.js"
       ],
       "main": true
     },
     "main.css": {
       "files": [
         "less/main.less",
         "sass/main.scss",
         "css/**/*.css"
       ],
       "main": true
     },
     "fonts": {
       "files": ["fonts/**/**"]
     },
     "images": {
       "files": ["images/**/**"]
     }
   },
   "paths": {
     "source": "assets/",
     "dist": "dist/"
   },
   "config": {
     "config": {
       "devUrl": "http://example.dev",
       "useES2015": true
     }
   }
 }'


