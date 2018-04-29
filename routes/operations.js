var express = require('express');
var router = express.Router();
//var expressValidator = require('express-validator');
var mongo = require('./mongodb/mongo');
var kafka = require('./kafka/client');
//var url = 'mongodb://localhost:27017/freelancer';

var session = require('client-sessions');
var url='mongodb://devfandango:fandango1@ds251819.mlab.com:51819/fandango'
var expressSessions = require("express-session");
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'teevra.2016@outlook.com',
        pass: 'Speedlabs09'
    }
});

var dummy="dummy";


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

    console.log("body---->email",req.body)
    
    console.log("email :" +req.body.email);
    console.log("phone :" +req.body.phone);
    console.log("name :" +req.body.name);

    console.log("userid :" +req.body.userid);
    console.log("cardholder :" +req.body.cardholder);
    console.log("creditcard :" +req.body.creditcard);
    console.log("cvv :" +req.body.cvv);
    console.log("expdate :" +req.body.expdate);
    var email = req.body.email;
    var name = req.body.name;
    var userid = req.body.userid;
    var phone = req.body.phone;
    var cardholder = req.body.cardholder;
    var creditcard = req.body.creditcard;
    var cvv = req.body.cvv;
    var expdate = req.body.expdate;
 





    mongo.connect(function (db) {


        var coll = db.collection('profiletable');
            coll.findOne({'name': name}, function (err, user) {
                    if (err) {
                        console.log("sending status 401")
                        res.json({
                            status: '401'
                        });
                    }
            else if (user) {

            coll.remove({'name':name},function(err,obj){
                console.log(" document(s) deleted");
                var data={
                    name:name,
                    email:email,
                    phone:phone,
                    cardholder:cardholder,
                    creditcard:creditcard,
                    userid:userid,
                    cvv:cvv,
                    expdate:expdate
                }
                mongo.insertDocument(db, 'profiletable', data, function (err, results) {
                    console.log("Profile Edited Successfully")
                    res.send({message: "Profile edited successfully!"});
                });



            });

 
            }
            else{

                var data={
                    name:name,
                    email:email,
                    phone:phone,
                    cardholder:cardholder,
                    creditcard:creditcard,
                    userid:userid,
                    cvv:cvv,
                    expdate:expdate
                }
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

    var title = req.body.title;
    var trailer = req.body.trailer;
    var cast = req.body.cast;
    var user_id =  Math.floor(Math.random() * Math.floor(9999));
    var release_date = req.body.release_date;
    var rating = req.body.rating;
    var photos = req.body.photos;
    var length = req.body.length;
    var theatres = req.body.theatres;
    var reviews = req.body.reviews;

    var data = {
        title : title,
        trailer : trailer,
        cast : cast,
        release_date: release_date,
        rating: rating,
        photos: photos,
        length: length,
        theatres: theatres,
        reviews: reviews


    }

    mongo.connect(function(db){
        console.log("Connected to MongoDB at ",url)

        var coll = db.collection('addmovie');
        coll.findOne({'title':title},function (err,user) {
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
                mongo.insertDocument(db,'addmovie',data,function (err,results) {
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

    console.log("Reached to all get movies");
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
                    console.log("no err",user)
                    res.json({
                        moviedata: user
                    });

                }
            });
        });
    });
});


router.post('/addhall', function (req, res, next) {
    console.log("in addhall");

    var time1 = req.body.time1;
    var time2 = req.body.time2;
    var time3 = req.body.time3;
    var user_id =  Math.floor(Math.random() * Math.floor(9999));
    var time4 = req.body.time4;
    var time5 = req.body.time5;
    var tickets = req.body.tickets;
    var screen = req.body.screen;
    var price = req.body.price;

    var data = {
        time1 : time1,
        time2 : time2,
        time3 : time3,
        time4: time4,
        time5: time5,
        tickets: tickets,
        screen: screen,
        price: price


    }

    mongo.connect(function(db){
        console.log("Connected to MongoDB at ",url)

                mongo.insertDocument(db,'addhall',data,function (err,results) {
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
            var myquery = {hallId };
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
        var movieTiming = req.body.movieTiming;

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
            movieTiming:movieTiming


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





module.exports = router;
