//List of Possible Errors
//https://www.parse.com/docs/js_guide#errors

// These two lines are required to initialize Express in Cloud Code.
var express = require('express')
//https://parse.com/questions/using-npm-modules-in-cloud-code
, expressLayouts = require('cloud/node_modules/express-ejs-layouts/lib/express-layouts')
, app = express();

app.locals.pretty = true;
// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
//////////////////////////
//////////////////////////
app.set('layout', 'layout') // defaults to 'layout'
app.use(expressLayouts)
//////////////////////////
//////////////////////////
app.use(express.bodyParser());    // Middleware for reading request body

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/hello', function(req, res) {
    res.json('hello', { message: 'Congrats, you just set up your app!' });
});

app.get('/', function(req, res) {
    res.render('index');
});

/**** **** **** **** **** **** **** ****
User Registration
**** **** **** **** **** **** **** ****/
app.get('/about', function(req, res) {
    res.render('about');
});

app.get('/signup', function(req, res) {
    res.render('user/signup');
});

app.post('/signup', function(req, res) {
    var formData = req.body;
    Parse.Cloud.run('newUser', formData, {
        success: function(user) {
            //Render a simple thank you
            res.render('user/thankyou')
        },
        error: function(user, error) {
            //See the JSON data
            res.render("user/signup");
        }
    });
});

app.get('/login', function(req, res) {
    res.render('user/login');
});

app.post('/login', function(req, res) {
    var formData = req.body;
    Parse.User.logIn( formData.username, formData.password, {
      success: function(user, message) {
          res.render('user/index', {locals: { user : { username: user.get("username") } } });
      },
      error: function(user, error) {
          var error = "Invalid username or password. Please try again."
          res.render('user/login', { locals: { error: error } })
      }
    });
      /*
    Parse.Cloud.run('logIn', formData, {
        success: function(data) {
            console.log("Express::post:login:data " + data.username);
            res.render('user/index', {locals: { user: { username: "chris" } } });
        },
        error: function(results, error) {
            //See the JSON data
            console.log("!results: ", results)
            console.log("!error: ", error)
            res.render('user/login', { locals: { error: error } })
        }
    });
      */
});

app.get('/logout', function(req, res) {
    Parse.Cloud.run('logOut', formData, {
        success: function(user) {
            res.render('index');
        },
        error: function(user, error) {
            //See the JSON data
            res.send("error", user);
        }
    });    
});


app.listen();