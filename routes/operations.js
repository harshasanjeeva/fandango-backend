var express = require('express');
var router = express.Router();
//var expressValidator = require('express-validator');
var mongo = require('./mongodb/mongo');
var kafka = require('./kafka/client');
var loginStatus=false;
//var url = 'mongodb://localhost:27017/freelancer';

var session = require('client-sessions');
var url='mongodb://devfandango:fandango1@ds251819.mlab.com:51819/fandango'
var expressSessions = require("express-session");
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
var mysql=require('mysql');

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'teevra.2016@outlook.com',
        pass: 'Speedlabs09'
    }
});

var dummy="dummy";

const redis = require('redis');
/*const REDIS_PORT = 6379;
console.log("redis port is",REDIS_PORT);*/

const client = redis.createClient();

client.on('connect',function(){
    console.log("Connected to Redis");
});


router.post('/login', function (req, res, next) {

    var email = req.body.email;
    var password = req.body.password;
    console.log("reached login");

    mongo.connect(function (db) {
        var coll = db.collection('usertable');
        coll.findOne({'email': email, 'password': password}, function (err, user) {
                if (err) {
                    res.json({
                        status: false
                    });
                }
                if (!user) {
                    console.log('User Not Found with email ' + email);
                    res.json({
                        status: false
                    });
                }
                else {

                    //dummy=user.Username;
                        res.json({
                            email: email,
                            status: true,
                            user_id: user.user_id
                        });
                }
            });
    });
});


router.post('/adminLogin', function (req, res, next) {

    var email = req.body.email;
    var password = req.body.password;
    console.log("reached login");

    mongo.connect(function (db) {
        var coll = db.collection('administrator');
        coll.findOne({'email': email, 'password': password}, function (err, user) {
            if (err) {
                res.json({
                    status: false
                });
            }
            if (!user) {
                console.log('Admin Not Found with email ' + email);
                res.json({
                    status: false
                });
            }
            else {

                console.log('Admin Found with email ' + user.email);
                res.json({
                    email: user.email,
                    status: true,
                    user_id: user.adminId
                });
            }
        });
    });
});


router.post('/signup', function (req, res, next) {

    var email = req.body.email;
    var name = req.body.name;
    var password = req.body.password;
    var user_id =  Math.floor(Math.random() * Math.floor(9999));
    console.log("email :" + email);
    console.log("Name :" + name);

    var data = {
        user_id:user_id,
        name : name,
        email : email,
        password : password
    }

    mongo.connect(function(db){
        console.log("Connected to MongoDB at ",url)

        var coll = db.collection('usertable');
        coll.findOne({'email':email},function (err,user) {
            if(err){
                console.log("sending status 401")
                res.json({
                    status : false
                });
            }
            else if(user){
                console.log("sending status 401")
                res.json({
                    status : false
                });
            }

            else{
                mongo.insertDocument(db,'usertable',data,function (err,results) {
                    if (err) {
                        console.log("sending status 401")
                        res.json({
                            status: false
                        });
                    }
                    else {
                        console.log("User Registered")
                        var path = results["ops"][0]["_id"];
                        console.log(path);
                        res.json({
                            status: true,
                        });
                    }
                });
            }
        })
 });
});





router.post('/editprofile',function (req, res, next) {

    var email = req.body.email;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var user_id = req.body.user_id;
    var phone = req.body.phone;
    var card_holder_name = req.body.card_holder_name;
    var credit_card = req.body.credit_card;
    var cvv = req.body.cvv;
    var address = req.body.address;
    var city = req.body.city;
    var state = req.body.state;
    var zipcode = req.body.zipcode;
    var expdate = req.body.expdate;

    var data = {
        user_id:user_id,
        email : email,
        first_name : first_name,
        last_name : last_name,
        phone : phone,
        card_holder_name : card_holder_name,
        credit_card : credit_card,
        cvv : cvv,
        address : address,
        city : city,
        state : state,
        zipcode : zipcode,
        expdate : expdate

    }


    mongo.connect(function (db) {


        var coll = db.collection('profiletable');
            coll.findOne({'user_id': user_id}, function (err, user) {
                    if (err) {
                        console.log("sending status 401")
                        res.json({
                            status: '401'
                        });
                    }
            else if (user) {

            coll.remove({'user_id':user_id},function(err,obj){
                console.log(" document(s) deleted");
                mongo.insertDocument(db, 'profiletable', data, function (err, results) {
                    console.log("Profile Edited Successfully")
                    res.send({message: "Profile edited successfully!"});
                });

            });

            }
            else{
                mongo.insertDocument(db, 'profiletable', data, function (err, results) {
                    console.log("Profile Edited Successfully")
                    res.send({message: "Profile edited successfully!"});
                });
            }
        }
        );
    });




});



router.post('/ticketing', function (req, res, next) {

    var email = req.body.email;
    var user_id = req.body.user_id;
    var movie_id = req.body.movie_id;
    var general = req.body.general;
    var student = req.body.student;
    var children = req.body.children;
    var general_amount = req.body.general_amount;
    var student_amount = req.body.student_amount;
    var children_amount = req.body.children_amount;

    var total = general_amount + student_amount + children_amount;

    console.log("reached login");

    var data = {
        user_id: user_id,
        email: email,
        movie_id: movie_id,
        general: general,
        student: student,
        children: children,
        general_amount: general_amount,
        student_amount: student_amount,
        children_amount: children_amount,
        total: total
    }
    mongo.connect(function (db) {
        console.log("Connected to MongoDB at ", url);

        mongo.insertDocument(db, 'bookingtable', data, function (err, results) {
            if (err) {
                console.log("sending status 401")
                res.json({
                    status: '401'
                });
            }
            else {
                console.log("Booking Made Successful")
                res.json({
                    data: data
                })
            }
        })
    })
})

router.post('/addmovies', function (req, res, next) {
    console.log("in addmovies");

    var movieId =  Math.floor(Math.random() * Math.floor(9999));
    var movieName = req.body.movieName;
    var cast = req.body.cast;
    var movieTiming=req.body.movieTiming;
    var movieType=req.body.movieType;
    var movieVideoLink=req.body.movieVideoLink;
    var rating = req.body.rating;
    var photos = req.body.photos;
    var length = req.body.length;
    var reviews = req.body.reviews;

    var data = {
        movieId : movieId,
        movieName : movieName,
        cast : cast,
        movieTiming: movieTiming,
        movieType: movieType,
        rating:rating,
        movieVideoLink:movieVideoLink,
        photos: photos,
        length: length,
        reviews: reviews
    }

    mongo.connect(function(db){
        console.log("Connected to MongoDB at ",url)

        var coll = db.collection('movietable');
        coll.findOne({'movieName':movieName},function (err,user) {
            if(err){
                console.log("sending status 401")
                res.json({
                    status : false
                });
            }
            else if(user){
                var myquery = {movieName: movieName};
                var coll = db.collection('movietable');
                var newvalues = {$set: {cast: cast, movieTiming: movieTiming,movieType:movieType,rating:rating,movieVideoLink:movieVideoLink,photos:photos,length:length,reviews:reviews}};
                coll.updateOne(myquery, newvalues, function (err, res) {
                    if (err) throw err;
                    console.log("1 document updated");
                    db.close();
                });
            }

            else{
                mongo.insertDocument(db,'movietable',data,function (err,results) {
                    if (err) {
                        console.log("sending status 401")
                        res.json({
                            status: false
                        });
                    }
                    else {
                        console.log("Movie added successfully")
                        var path = results["ops"][0]["_id"];
                        console.log(path);
                        res.json({
                            status: true,
                        });
                    }
                });
            }
        })
    });
});


router.post('/getmovies', function (req, res, next) {

    console.log("Reached all get movies");
    client.hgetall("allMovies",function (err,obj) {
        if(!obj)
        {
            console.log("movies not found in redis");
            mongo.connect(function (db) {
                console.log("Connected to MongoDB at ", url)

                mongo.connect(function (db) {
                    var coll = db.collection('movietable');
                    console.log("dummy");
                    coll.find({}).toArray(function (err, user) {
                        if (err) {
                            console.log("err")
                            res.json({
                                status: '401'
                            });
                        }
                        else {
                            console.log("no err",user);
                            var array=[];
                            var g=0;
                            while(g<user.length)
                            {
                                array.push(g);
                                array.push(JSON.stringify(user[g]));
                                g++;
                            }
                            client.hmset("allMovies",array,function (error,reply) {
                                if(error){
                                    console.log(error);
                                }
                                console.log(reply);

                            });
                            client.expire('allMovies', 30);;
                            res.json({
                                moviedata: user
                            });
                        }
                    });
                });
            });
        }
        else{
            var array=[];
            var g=0;
            while(g<Object.keys(obj).length)
            {
                console.log("key is: ", g);
                console.log("value is: ", Object.values(obj)[g]);
                array.push(JSON.parse(Object.values(obj)[g]));
                g++;
            }
            console.log("array is: ", array);
            res.json({
                moviedata: array
            });

        }
        
    });

});
/*
function cache(req, res, next) {
    const org = req.query.org;
    client.get(org, function (err, data) {
        if (err) throw err;

        if (data != null) {
            res.send(respond(org, data));
        } else {
            next();
        }
    });
}*/



router.post('/addHall', function (req, res, next) {
    console.log("in addhall");

    var hallName = req.body.hallName;
    var hallId = req.body.hallId;
    var hallAddress = req.body.hallAddress;
    var type = req.body.type;
    console.log("type is"+ type);
    var data = {
        hallName : hallName,
        hallId : hallId,
        hallAddress : hallAddress
    }

    mongo.connect(function(db){
        console.log("Connected to MongoDB at ",url)

        if(type==='add') {
            console.log("in adder");

            mongo.insertDocument(db, 'addhall', data, function (err, results) {
                if (err) {
                    console.log("sending status 401")
                    res.json({
                        status: false
                    });
                }
                else {
                    console.log("Movie hall added successfully")
                    var path = results["ops"][0]["_id"];
                    console.log(path);
                    res.json({
                        status: true,
                    });
                }
            });
        }
        else {

            console.log("in update function", hallId, hallName, hallAddress);
            var myquery = {hallId: hallId};
            var coll = db.collection('addhall');
            var newvalues = {$set: {hallName: hallName, hallAddress: hallAddress}};
            coll.updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
                console.log("1 document updated");
                db.close();
            });
        }

    });
});


router.post('/getMovieHalls', function (req, res, next) {

    console.log("Reached all get halls");
    mongo.connect(function (db) {
        console.log("Connected to MongoDB at ", url)

        mongo.connect(function (db) {
            var coll = db.collection('addhall');
            console.log("dummy");
            coll.find({}).toArray(function (err, user) {
                if (err) {
                    console.log("err")
                    res.json({
                        status: '401'
                    });
                }
                else {
                    console.log("no err",user)
                    res.json({
                        hallData: user
                    });

                }
            });
        });
    });
});

router.post('/addUserToHall', function (req, res, next) {
    console.log("in addUserToHall");

    var hallUserEmail = req.body.email;
    var userEmail = req.body.hallUserEmail;
    var hallId = req.body.hallId;
    var password = req.body.password;
    console.log("in addUserToHall"+hallUserEmail+userEmail+hallId+password);
    var hallUserId =  Math.floor(Math.random() * Math.floor(9999));
    var data = {
        hallUserEmail : hallUserEmail,
        hallId : hallId,
        password:password,
        hallUserId:hallUserId
    }

    mongo.connect(function(db) {
        var coll = db.collection('UserHall');
        coll.findOne({'hallUserEmail': userEmail}, function (err, user) {
            if (err) {
                console.log("sending status 401")
                res.json({
                    status: false
                });
            }
            else if (user) {
                var myquery = {hallUserEmail: userEmail};
                var coll = db.collection('UserHall');
                var newvalues = {
                    $set: {
                        hallUserEmail: hallUserEmail,
                        password: password,
                        hallUserId: hallUserId
                    }
                };
                coll.updateOne(myquery, newvalues, function (err, res) {
                    if (err) throw err;
                    console.log("1 document updated");
                    db.close();
                });
            }

            else {
                mongo.insertDocument(db, 'UserHall', data, function (err, results) {
                    if (err) {
                        console.log("sending status 401")
                        res.json({
                            status: false
                        });
                    }
                    else {
                        console.log("User Added to Hall")
                        var path = results["ops"][0]["_id"];
                        console.log(path);
                        res.json({
                            status: true,
                        });
                    }
                });
            }
        })
    });



});



router.post('/payment', function (req, res, next) {
    console.log("in payment");
    var user_id = req.body.user_id;
    var name = req.body.name;
    var creditcard = req.body.creditcard;
    var cvv = req.body.cvv;
    var expdate = req.body.expdate;
    var movieid = req.body.movieid;
    var movieName = req.body.movieName;
    var total_amount = req.body.total_amount;
    var total_tickets = req.body.total_tickets;
    var genre=req.body.genre;
    var release=req.body.release;
    var timings=req.body.timings;
    var theatrename=req.body.theatrename;
    var student=req.body.student;
    var children=req.body.children;
    var general=req.body.general;

    var data = {
        user_id :user_id,
        name : name,
        creditcard: creditcard,
        cvv : cvv,
        expdate : expdate,
        movieid : movieid,
        movieName: movieName,
        genre:genre,
        release:release,
        total_amount: total_amount,
        total_tickets: total_tickets,
        timings:timings,
        theatrename:theatrename,
        student:student,
        children:children,
        general:general
    };

    var dataSql = [
        user_id,
        name,
        creditcard,
        cvv,
        expdate,
        movieid,
        movieName,
        genre,
        release,
        total_amount,
        total_tickets,
        timings,
        theatrename,
        student,
        children,
        general
    ]

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "1111",
        database: "fandango"
    });


    con.connect(function (err) {
        var flag = false;
        if (err)
            throw err;
        var json_responses;
        var sql = "insert into payment values (0,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        con.query(sql, dataSql, function (err, result, fields) {
            if (err)
                throw err;
            else {
                res.json({
                    value:dataSql,
                    status: true,
                });
            }
        });

    });

    mongo.connect(function(db){
        console.log("Connected to MongoDB at ",url)

        mongo.insertDocument(db,'payment',data,function (err,results) {
            if (err) {
                console.log("sending status 401")
                res.json({
                    status: false
                });
            }
            else {
                console.log("payment added successfully")
                var path = results["ops"][0]["_id"];
                console.log(path);
                res.json({
                    value:data,
                    status: true,
                });
            }
        });
    });
});




router.post('/viewAllUsers', function (req, res, next) {


    var hallId = req.body.hallId;
    console.log("in viewAllUsers",hallId);

    mongo.connect(function(db){
        console.log("Connected to MongoDB at ",url)
        var coll = db.collection("UserHall");
        coll.find({hallId:hallId}).toArray(function(err, user) {

            if (err) {
                console.log("sending status 401")
                res.json({
                    status: false
                });
            }
            else {
                var path = results["ops"][0]["_id"];
                console.log(path);
                res.json({
                    value:data,
                    status: true,
                });
            }
        });
    });
});


router.post('/realticket', function (req, res, next) {

    var user_id = Number(req.body.user_id);
    console.log(user_id);
    console.log("reached real ticket");

    mongo.connect(function (db) {
        var coll = db.collection('payment');
        coll.findOne({'user_id': user_id}, function (err, user) {
            if (err) {
                res.json({
                    status: false
                });
            }
            else if(!user)
            {
                console.log("user not found")
                res.send(404)
            }
            else {
                console.log(user);
                res.json({
                    bill: user
                });
            }
        });
    });
});



router.post('/delprofile', function (req, res, next) {

    var user_id = req.body.user_id;
    console.log(user_id);
    console.log("reached delete profile");

    mongo.connect(function (db) {
        var coll = db.collection('usertable');
        coll.remove({'user_id': user_id}, function (err, user) {
            if (err) {
                res.json({
                    status: false
                });
            }
            else if(!user)
            {
                console.log("user not found")
                res.send(404)
            }
            else {
                res.json({
                    status: true
                });
            }
        });
    });
});

router.post('/viewprofile', function (req, res) {

    var user_id = req.body.user_id;
    console.log(user_id);
    console.log("reached view profile");

    mongo.connect(function (db) {
        var coll = db.collection('usertable');
        coll.findOne({'user_id': user_id}, function (err, user) {
            if (err) {
                res.json({
                    status: false
                });
            }
            else if(!user)
            {
                console.log("user not found")
                //res.send(404)
            }
            else {
                console.log(user_id);
                var collect=db.collection('profiletable');
                collect.findOne({'user_id': user_id}, function(err,results){
                    if (err) {
                        res.json({
                            status: false
                        });
                    }
                    else {
                        console.log(results)
                        res.json({
                            editProfile:results
                        });
                    }
                });
            }
        });
    });
});





module.exports = router;
