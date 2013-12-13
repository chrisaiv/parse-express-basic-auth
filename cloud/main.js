require('cloud/app.js');
    
Parse.Cloud.define("hello", function(request, response) {
    //See if you can connect request.params to an Object
    var FormData = Parse.Object.extend('FormData');
    var formData = new FormData( request.params );
    formData.save( formData, {
        success: function(object) {
            response.success("Success");
        },
        error: function(model, error) {
            response.error("Error");
        }
    })
});

/**** **** **** **** **** **** **** ****
User Registration
**** **** **** **** **** **** **** ****/
Parse.Cloud.define('newUser', function(request, response){
    var data = request.params;
    var user = new Parse.User();
    user.set("fname",    data.fname);
    user.set("lname",    data.lname);
    user.set("username", data.username);
    user.set("password", data.password);
    user.set("email",    data.email);
    user.set("phone",    data.phone);

    user.signUp(null, {
        success: function(user) {
            response.success("Success");
        },
        error: function(user, error) {
            // Show the error message somewhere and let the user try again.
            console.log("Logout:", user)
            console.log("Error:", error)
            
            response.error("Error", error.message);
        }
    });
});

Parse.Cloud.define('logIn', function(request, response){
    var data = request.params;
    Parse.User.logIn( data.username, data.password, {
      success: function(user, message) {
          console.log( "Parse.Cloud.define: " + JSON.stringify(user) );
          var data = { username: user.username, objectId: user.objectId }
          response.success(data);
      },
      error: function(user, error) {
          response.error(user + " " + "Invalid username or password. Please try again.");
          response.error(error + " " + "Invalid username or password. Please try again.");
      }
    });
});

Parse.Cloud.define('logOut', function(request, response){
    Parse.User.logOut();
    var currentUser = Parse.User.current(); 
    if(!currentUser) response.success("Success");
    else response.error("Error");
});


/**** **** **** **** **** **** **** ****
Helper Functions
**** **** **** **** **** **** **** ****/
Parse.Cloud.beforeSave('Location', function(request, response) {
    // Check if the user added a pin in the last minute
    var LocationObject = Parse.Object.extend('Location');
    var query = new Parse.Query(LocationObject);

    var oneMinuteAgo = new Date();
    oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);
    query.greaterThan('createdAt', oneMinuteAgo);

    query.equalTo('user', Parse.User.current());

    // Count the number of pins
    query.count({
        success: function(count) {
            if (count > 0) {
                response.error('Sorry, too soon to post again!');
            } else {
                response.success();
            }
        },
        error: function(error) {
            response.error('Oups something went wrong.');
        }
    });
});

Parse.Cloud.define('getLocationAverage', function(request, response) {
    var LocationObject = Parse.Object.extend('Location');
    var query = new Parse.Query(LocationObject);

    query.equalTo('user', Parse.User.current());
    query.limit(100);
    query.find({
        success: function(results) {
            if (results.length > 0) {
                var longitudeSum = 0;
                var latitudeSum = 0;
                for (var i = 0; i < results.length; i++) {
                    longitudeSum += results[i].get('location').longitude;
                    latitudeSum += results[i].get('location').latitude;
                }
                var averageLocation = new Parse.GeoPoint(latitudeSum/results.length, longitudeSum/results.length);
                response.success(averageLocation);
            } else {
                response.error('Average not available');
            }
        },
        error: function(error) {
            response.error('Oups something went wrong');
        }
    });
});