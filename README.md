# Applicaster Oauth

this npm package is an express.js middleware which provides a method to integrate accounts.applicaster.com authentication to any node.js app.

# how to use

* install package ` npm install -S applicaster-oauth`
* import in your node.js app and initialize :
```javascript
import express from "express";
import ApplicasterOauth from "applicaster-oauth";
import cookieParser from 'cookie-parser';


let app = express();
app.use(cookieParser());

let appliAuth =  new ApplicasterOauth(app,{
  client_id: 'your_client_id', // required
  redirect_url: 'http://your_redirect_uri', // required
  user_route: true, // optional
  accounts_route: true // optional
});

app.use( appliAuth.authenticate() );

// register your routes

app.listen(8080, () => {
    console.log('server started');
});
```

Note that the snippet above will activate authentication for all routes.
If you want to activate authentication for selected routes only use this instead :
```javascript
app.get('/myroute', appliAuth.authenticate());
```

# Dependencies
This package requires to install and activate the cookie-parser package, as shown in the example above

You also need to register your app in accounts.applicaster.com. You will then be able to get your client_id, and specify your redirect_url


