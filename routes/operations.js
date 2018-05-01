//import { parse } from 'url';

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
        movieLink: photos,
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
        if(!obj) {
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
                            console.log("no err", user);
                            var array = [];
                            var g = 0;
                            while (g < user.length) {
                                array.push(g);
                                array.push(JSON.stringify(user[g]));
                                g++;
                            }
                            client.hmset("allMovies", array, function (error, reply) {
                                if (error) {
                                    console.log(error);
                                }
                                console.log(reply);

                            });
                            client.expire('allMovies', 30);

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


router.post('/addhall', function (req, res, next) {
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


router.post('/analytics', function (req, res, next) {
    console.log("analytics",req.body)
var numofclicks = req.body.numofclick;
var componentname = req.body.componentname;
var userid = req.body.userid;
console.log("num of clicks",numofclicks)

 var   data={
        numofclicks:numofclicks,
        componentname:componentname,
        userid:userid
    }

    mongo.connect(function(db){

        var ana = db.collection('analytics');
       
        ana.find({"userid":userid,"componentname":componentname}).toArray(function (err, user) {
            if (err) {
                console.log("err")
                res.json({
                    status: '401'
                });
            }
            else if(user.length<1){

                mongo.insertDocument(db,'analytics',data,function (err,results) {
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
            else {
                    console.log("user",user)
                var myquery = {"userid":userid,"componentname":componentname};
                var oldclick = user[0].numofclicks;
             
                console.log("old click",user.numofclicks,user[0])
                var newvalues = {$set: {"numofclicks": (parseFloat(numofclicks) + parseFloat(oldclick))}};
                ana.updateOne(myquery, newvalues, function (err, res) {
                    if (err) throw err;
                    console.log("one doc updated");
                    db.close();
                });
            }
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
        var coll = db.collection('moviehalldetails');
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


                coll.findOne({'moviename': movieName}, function (err, user) {
                    if (err) {
                        res.json({
                            status: false
                        });
                    }
                    else if(!user)
                    {
                        console.log("movie not found")
                        res.send(404)
                    }
                    else {
                        console.log(user);
                        var remaining_ticket = user.tickets - total_tickets;
                        var myquery = {moviename:movieName};
                        var newvalues = { $set: {tickets: remaining_ticket  } };
                        coll.updateOne(myquery, newvalues, function (err, user) {
                            if (err) {
                                console.log("err")
                                res.json({
                                    status: '401'
                                });
                            }
                            else {
                                console.log(user)
                                console.log("updated successfully")
                                res.json({
                                    value:data,
                                    status: true,
                                });

                            }
                        });

                    }
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
                //var path = results["ops"][0]["_id"];
                console.log("all useres",user);

                res.json({
                    value:user,
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


router.post('/movieuserlogin', function (req, res, next) {

    var email = req.body.email;
    var password = req.body.password;
    console.log("reached movieloginlogin");
    console.log("email",email);
    console.log("pwd",password);
    var hallId=0;
    var hall_name='';
    var hall_address='';

    mongo.connect(function (db) {
        var coll = db.collection('UserHall');
        var coll2 = db.collection('addhall');
        coll.findOne({'hallUserEmail': email, 'password': password}, function (err, user) {
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
                hallId = user.hallId;


                console.log("hall id in movieuser", hallId);
                coll2.findOne({hallId: hallId}, function (err, user) {
                    if (err) {
                        res.json({
                            status: false
                        });
                    }
                    if (!user) {
                        console.log('User Not Found with hallid ' + hallId);

                        res.json({
                            status: false

                        });
                    }
                    else {

                        //dummy=user.Username;
                        hallId = user.hallId;
                        hall_name = user.hallName;
                        hall_address = user.hallAddress;
                        console.log("hall name", hall_name);
                        console.log("hall address", hall_address);
                        console.log(hallId);
                        res.json({
                            status: true,
                            hallId:hallId,
                            hall_name: hall_name,
                            hall_address: hall_address

                        });
                    }
                });
            }
        });
    });
});


router.post('/getmoviehalldata', function (req, res, next) {

    console.log("Reached getmoviehalldata");
    var hallId= req.body.hallId;
    console.log("recieved hallid", hallId);
    mongo.connect(function (db) {
        console.log("Connected to MongoDB at ", url)

        mongo.connect(function (db) {
            var coll = db.collection('moviehalldetails');
            console.log("dummy");
            coll.find({'hallId':hallId.toString()}).toArray(function (err, user) {
                if (err) {
                    console.log("err")
                    res.json({
                        status: '401'
                    });
                }
                else {
                    console.log("no err",user)
                    res.json({
                        halldata: user
                    });

                }
            });
        });
    });
});





router.post('/editmoviehalldata', function (req, res, next) {

    console.log("Reached editmoviehalldata");
    mongo.connect(function (db) {
        console.log("Connected to MongoDB at ", url)
        var moviename= req.body.moviename;
        var time1 = req.body.time1;
        var time2 = req.body.time2;
        var time3 = req.body.time3;
        var time4 = req.body.time4;
        var time5 = req.body.time5;
        var tickets = req.body.tickets;
        var hallId = req.body.hallId;
        var screen = req.body.screen;
        var price = req.body.price;




        mongo.connect(function (db) {
            var coll = db.collection('moviehalldetails');
            console.log("dummy");
            var myquery = {hallId:hallId };
            var newvalues = { $set: {moviename: moviename, time1: time1, time2: time2, time3: time3, time4: time4, time5: time5, tickets: tickets, screen: screen, price: price } };
            coll.updateOne(myquery, newvalues, function (err, user) {
                if (err) {
                    console.log("err")
                    res.json({
                        status: '401'
                    });
                }
                else {
                    console.log(user)
                    console.log("updated successfully")
                    res.json({
                        status: true
                    });

                }
            });
        });
    });
});



router.post('/addmoviehalldata', function (req, res, next) {

    console.log("Reached editmoviehalldata");

        var moviename= req.body.moviename;
        var movieimage= req.body.movieimage;
        var time1 = req.body.time1;
        var time2 = req.body.time2;
        var time3 = req.body.time3;
        var time4 = req.body.time4;
        var time5 = req.body.time5;
        var tickets = req.body.tickets;
        var hallId =  req.body.hallId
        var screen = req.body.screen;
        var price = req.body.price;
        var movieTimings = [];
        if(time1.length >0)
        {
            movieTimings.push(time1);

        }

    if(time2.length >0)
    {
        movieTimings.push(time2);

    }

    if(time3.length >0)
    {
        movieTimings.push(time3);

    }

    if(time4.length >0)
    {
        movieTimings.push(time4);

    }

    if(time5.length >0)
    {
        movieTimings.push(time5);

    }







        var data = {
            moviename : moviename,
            movieimage: movieimage,
            hallId :hallId,
            time1: time1,
            time2: time2,
            time3: time3,
            time4: time4,
            time5: time5,
            tickets: tickets,
            screen: screen,
            price : price,
            movieTiming:movieTimings,



        }

    mongo.connect(function(db){
        console.log("Connected to MongoDB at ",url)

        mongo.insertDocument(db,'moviehalldetails',data,function (err,results) {
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


    });






});



router.post('/gethalldata', function (req, res, next) {

    var hallId = req.body.hallId;
    console.log("reached login");
    console.log("hallId",hallId);


    mongo.connect(function (db) {
        var coll = db.collection('UserHall');
        coll.findOne({'hallId': hallId}, function (err, user) {
            if (err) {
                res.json({
                    status: false
                });
            }
            if (!user) {
                console.log('User Not Found with hallId ' + hallId);

                res.json({
                    status: false

                });
            }
            else {

                //dummy=user.Username;
                var hallname = user.hallName;
                var halladdress = user.hallAddress;
                console.log("hall id", hallId);
                res.json({
                    hall_name: hallname,
                    hall_address: halladdress,
                    status: true
                });
            }
        });
    });
});





router.post('/revenuedetails', function (req, res, next) {

    console.log("Reached revenuedetails");
    var moviename = req.body.moviename;
    var theatrename = req.body.theatrename;
    console.log("moviename",moviename);
    console.log("theatrename",theatrename);
    mongo.connect(function (db) {
        console.log("Connected to MongoDB at ", url)

        mongo.connect(function (db) {
            var coll = db.collection('payment');
            console.log("dummy");
            coll.find({"movieName":moviename, "theatrename":theatrename}).toArray(function (err, user) {
                if (err) {
                    console.log("err")
                    res.json({
                        status: '401'
                    });
                }
                else {
                    console.log("revenue details",user)
                    var i=0;
                    var len = user.length;
                    total =0;
                    for(var i=0; i < len;i++)
                    {
                    total+= parseInt(user[i].total_amount);
                    }

                    console.log("total",total);
                    var final = total - (total * 5)/100;
                    console.log("final",final);
                    res.json({
                        total_revenue: total,
                        tax: '5',
                        final: final
                    });

                }
            });
        });
    });
});




router.post('/bookingdetails', function (req, res, next) {

    console.log("Reached bookingdetails");
    var moviename = req.body.moviename;
    var theatrename = req.body.theatrename
    console.log("moviename",moviename);
    mongo.connect(function (db) {
        console.log("Connected to MongoDB at ", url)

        mongo.connect(function (db) {
            var coll = db.collection('payment');
            console.log("dummy");
            coll.find({"movieName":moviename,"theatrename":theatrename}).toArray(function (err, user) {
                if (err) {
                    console.log("err")
                    res.json({
                        status: '401'
                    });
                }
                else {
                    console.log("booking details",user)
                    res.json({
                        booking_data: user
                    });

                }
            });
        });
    });
});


router.post('/deletebooking', function (req, res, next) {

    console.log("Reached delete booking");
    var user_id = req.body.user_id;
    var movieName = req.body.movieName;
    console.log("user_id",user_id);
    console.log("movieName",movieName);
    mongo.connect(function (db) {
        console.log("Connected to MongoDB at ", url)

        mongo.connect(function (db) {
            var coll = db.collection('payment');
            var myquery = { user_id: user_id, movieName: movieName };
            console.log("dummy");
            coll.deleteOne(myquery, function (err, user) {
                if (err) {
                    console.log("err")
                    res.json({
                        status: '401'
                    });
                }
                else {
                    console.log("booking details",user)
                    res.json({
                        status:true
                    });

                }
            });
        });
    });
});


router.post('/toprevenuehalls', function (req, res, next) {

    // var email = req.body.email;
    //var password = req.body.password;
    //console.log("reached movieloginlogin");
    //console.log("email",email);
    //console.log("pwd",password);
    //var hallId=0;
    //var hall_name='';
    //var hall_address='';
    var halls_list=[];
    var i=0;
    var j=0;
    var data={
        halls:[],
        amount:[]

    };

    mongo.connect(function (db) {
        var coll = db.collection('addhall');
        var coll2 = db.collection('payment');
        coll.find({}).toArray(function (err, user) {
            if (err) {
                res.json({
                    status: false
                });
            }
            if (!user) {
                console.log('UserHall query unsuccessfull');

                res.json({
                    status: false

                });
            }
            else {

                //dummy=user.Username;



                console.log("User hall query is successfull", user);
                for(i=0;i<user.length;i++)
                {
                    halls_list.push(user[i].hallName);

                }
                console.log("halls_list:",halls_list);
                coll2.find({}).toArray(function (err, user) {
                    if (err) {
                        res.json({
                            status: false
                        });
                    }
                    if (!user) {
                        console.log('payment query fail ');

                        res.json({
                            status: false

                        });
                    }
                    else {

                        console.log("payment query succesfull and data:",user)
                        //dummy=user.Username;
                        var total=0;
                        len1 = halls_list.length;
                        for(i=0;i<len1;i++)
                        {
                            data.halls.push(halls_list[i]);
                            for(j=0;j<user.length;j++)
                            {
                                if(halls_list[i]==user[j].theatrename)
                                {
                                    total +=parseInt(user[j].total_tickets);
                                }

                            }

                            data.amount.push(total);
                            total=0;

                        }

                        console.log("final data",data);



                        res.json({
                            status: true,
                            halls_list:data.halls,
                            revenue_list: data.amount


                        });
                    }
                });
            }
        });
    });
});


router.post('/toprevenuemovies', function (req, res, next) {

    // var email = req.body.email;
    //var password = req.body.password;
    //console.log("reached movieloginlogin");
    //console.log("email",email);
    //console.log("pwd",password);
    //var hallId=0;
    //var hall_name='';
    //var hall_address='';
    var movies_list=[];
    var i=0;
    var j=0;
    var data={
        movies:[],
        amount:[]

    };

    mongo.connect(function (db) {

        var coll2 = db.collection('payment');
        coll2.find({}).toArray(function (err, user) {
            if (err) {
                res.json({
                    status: false
                });
            }
            if (!user) {
                console.log('Payment query for all movies unsuccessfull');

                res.json({
                    status: false

                });
            }
            else {

                //dummy=user.Username;



                console.log("Payment query for all movies successfull", user);
                for(i=0;i<user.length;i++)
                {
                    movies_list.push(user[i].movieName);

                }
                console.log("movies_list:",movies_list);
                coll2.find({}).toArray(function (err, user) {
                    if (err) {
                        res.json({
                            status: false
                        });
                    }
                    if (!user) {
                        console.log('payment query fail ');

                        res.json({
                            status: false

                        });
                    }
                    else {

                        console.log("payment query succesfull and data:",user)
                        //dummy=user.Username;
                        var total=0;
                        len1 = movies_list.length;
                        for(i=0;i<len1;i++)
                        {
                            data.movies.push(movies_list[i]);
                            for(j=0;j<user.length;j++)
                            {
                                if(movies_list[i]==user[j].movieName)
                                {
                                    total +=parseInt(user[j].total_amount);
                                }

                            }

                            data.amount.push(total);
                            total=0;

                        }

                        console.log("final data",data);



                        res.json({
                            status: true,
                            movies_list:data.movies,
                            revenue_list: data.amount


                        });
                    }
                });
            }
        });
    });
});


router.post('/pageclicks', function (req, res, next) {

    // var email = req.body.email;
    //var password = req.body.password;
    //console.log("reached movieloginlogin");
    //console.log("email",email);
    //console.log("pwd",password);
    //var hallId=0;
    //var hall_name='';
    //var hall_address='';
    var users_list=[];
    var pages_list=['Movies', 'Movies details', 'Number of Tickets', 'Payments', 'Tickets', 'Profile', 'Reviews'];
    var i=0;
    var j=0;
    var k=0;
    var data={
        Movies_users:[],
        Movies_clicks:[],
        Movies_details_users:[],
        Movies_details_clicks:[],
        Nooftickets_users:[],
        Nooftickets_clicks:[],
        Payments_users:[],
        Payments_clicks:[],
        Tickets_users:[],
        Tickets_clicks:[],
        Profile_users:[],
        Profile_clicks:[],
        Reviews_users:[],
        Reviews_clicks:[]


    };

    mongo.connect(function (db) {

        var coll = db.collection('usertable');
        var coll2 = db.collection('analytics');
        coll.find({}).toArray(function (err, user) {
            if (err) {
                res.json({
                    status: false
                });
            }
            if (!user) {
                console.log('users query for all users unsuccessfull');

                res.json({
                    status: false

                });
            }
            else {

                //dummy=user.Username;



                console.log("users query for all users successfull", user);
                for(i=0;i<4;i++)
                {
                    users_list.push(user[i].user_id);

                }
                console.log("users_list:",users_list);
                coll2.find({}).toArray(function (err, user) {
                    if (err) {
                        res.json({
                            status: false
                        });
                    }
                    if (!user) {
                        console.log('analytics query fail ');

                        res.json({
                            status: false

                        });
                    }
                    else {

                        //dummy=user.Username;
                        var total=0;
                        len1 = pages_list.length;
                        for(i=0;i<len1;i++)
                        {
                            //data.pages.push(pages_list[i]);
                            for(k=0;k<4;k++) {
                                for (j = 0; j < user.length; j++) {
                                    if (pages_list[i] == user[j].componentname && users_list[k] == user[j].userid) {
                                        if (i == 0) {
                                            data.Movies_users.push(user[j].userid);
                                            data.Movies_clicks.push(user[j].numofclicks);
                                        }

                                        if (i == 1) {
                                            data.Movies_details_users.push(user[j].userid);
                                            data.Movies_details_clicks.push(user[j].numofclicks);
                                        }

                                        if (i == 2) {
                                            data.Nooftickets_users.push(user[j].userid);
                                            data.Nooftickets_clicks.push(user[j].numofclicks);
                                        }

                                        if (i == 3) {
                                            data.Payments_users.push(user[j].userid);
                                            data.Payments_clicks.push(user[j].numofclicks);
                                        }

                                        if (i == 4) {
                                            data.Tickets_users.push(user[j].userid);
                                            data.Tickets_clicks.push(user[j].numofclicks);
                                        }

                                        if (i == 5) {
                                            data.Profile_users.push(user[j].userid);
                                            data.Profile_clicks.push(user[j].numofclicks);
                                        }
                                        if (i == 6) {
                                            data.Reviews_users.push(user[j].userid);
                                            data.Reviews_clicks.push(user[j].numofclicks);
                                        }
                                    }

                                }
                            }


                        }

                        console.log("final data",data);

                        var Reviews_clicks1=[23,45,67];

                        res.json({
                            status: true,
                            Movies_users: data.Movies_users,
                            Movies_clicks: data.Movies_clicks,
                            Movies_details_users: data.Movies_details_users,
                            Movies_details_clicks: data.Movies_details_clicks,
                            Nooftickets_users: data.Nooftickets_users,
                            Nooftickets_clicks: data.Nooftickets_clicks,
                            Payments_users: data.Payments_users,
                            Payments_clicks: data.Payments_clicks,
                            Tickets_users: data.Tickets_users,
                            Tickets_clicks: data.Tickets_clicks,
                            Profile_users: data.Profile_users,
                            Profile_clicks: data.Profile_clicks,
                            Reviews_users: data.Reviews_users,
                            Reviews_clicks: Reviews_clicks1


                        });


                    }
                });
            }
        });
    });
});


router.post('/movieclicks', function (req, res, next) {

    // var email = req.body.email;
    //var password = req.body.password;
    //console.log("reached movieloginlogin");
    //console.log("email",email);
    //console.log("pwd",password);
    //var hallId=0;
    //var hall_name='';
    //var hall_address='';
    var movies_list=[];
    var i=0;
    var j=0;
    var data={
        movies:[],
        clicks:[]

    };

    mongo.connect(function (db) {
        var coll = db.collection('movietable');
        var coll2 = db.collection('Movieclicks');
        coll.find({}).toArray(function (err, user) {
            if (err) {
                res.json({
                    status: false
                });
            }
            if (!user) {
                console.log('Movie query for all movies unsuccessfull');

                res.json({
                    status: false

                });
            }
            else {

                //dummy=user.Username;



                console.log("Movie query for all movies successfull", user);
                for(i=0;i<user.length;i++)
                {
                    movies_list.push(user[i].movieName);

                }
                console.log("movies_list:",movies_list);
                coll2.find({}).toArray(function (err, user) {
                    if (err) {
                        res.json({
                            status: false
                        });
                    }
                    if (!user) {
                        console.log('movieclicks query fail ');

                        res.json({
                            status: false

                        });
                    }
                    else {

                        console.log("movieclicks query succesfull and data:",user)
                        //dummy=user.Username;
                        var total=0;
                        len1 = movies_list.length;
                        console.log("len1",len1)
                        for(i=0;i<len1;i++)
                        {

                            for(j=0;j<user.length;j++)
                            {
                                console.log("usermovie",user[j].MovieName);
                                if(movies_list[i]==user[j].MovieName)
                                {

                                    console.log("movie matched pushing clicks")
                                    data.movies.push(movies_list[i]);
                                    data.clicks.push(user[j].numofclicks);
                                }


                            }



                        }

                        console.log("final data",data);



                        res.json({
                            status: true,
                            movies_list:data.movies,
                            clicks_list: data.clicks


                        });
                    }
                });
            }
        });
    });
});


router.post('/billdetails', function (req, res, next) {

    //var user_id = Number(req.body.user_id);
   // console.log(user_id);
    console.log("reached bill details");

    mongo.connect(function (db) {
        var coll = db.collection('payment');
        coll.find({}).toArray(function (err, user) {
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




module.exports = router;
