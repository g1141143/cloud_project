var express = require('express');
var session = require('cookie-session');
var MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var app = express();
var path = require("path");
var fs = require('fs');
var url = "mongodb://alvin:alvin@ds139964.mlab.com:39964/g1141143";
var ExifImage = require('exif').ExifImage;
var formidable = require('formidable');
app = express();

app.set('view engine','ejs');
var tempResult;
var tempTargetResult;
var SECRETKEY1 = 'authenticated';
var SECRETKEY2 = 'username';
// google map API : AIzaSyBnU99KhQKSTWF2-UvodDm1o1B6vJC6ekY
//AIzaSyBfGbDxOQRwb2jBpY7CVF3FIqjvYA8B__E

var users = new Array(
	{name: 'developer', password: 'developer'},
	{name: 'guest', password: 'guest'}
);

app.set('view engine','ejs');

app.use(session({
  name: 'session',
  keys: [SECRETKEY1,SECRETKEY2]
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/',function(req,res) {
	if (!req.session.authenticated) {
		res.redirect('/login');
	} else {
		MongoClient.connect(url, function(err, db) {
			//console.log("connected");
			if (err) throw err;
			db.collection("restaurants").find({}).toArray(function(err, result) {
				if (err) throw err;
				//console.log(result);
				//console.log(result);
				res.render('file',{username:req.session.username, c:result});
				db.close();
		  });
		});
	}
});

app.get('/login',function(req,res) {
	//res.sendFile(__dirname + '/public/login.html');
	res.render('login', {name:req.session.username});
	//console.log(req.session.authenticated);
});

app.post('/login',function(req,res) {

	if (req.body.name== '' || req.body.password=== '') {
		res.render('login',{name:"plz enter username and password"});
	}else {
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			//console.log(req.body.name);
			//console.log(req.body.password);
			var tempObj = {username: req.body.name, password: req.body.password};
			db.collection("users").findOne(tempObj,function(err,temp) {
				//console.log(temp);
				if (temp == null){
					//res.sendFile(__dirname + '/public/register.html');
					res.render('register');
				}
				else {
					req.session.authenticated = true;
					req.session.username = temp.username;
					//res.render('file',{name:req.session.username});
					//console.log(req.session.authenticated);
					res.redirect('/');
				}

			});
				
			db.close();
		});
	
	}

	
});

app.get('/register',function(req,res) {
	//res.sendFile(__dirname + '/public/register.html');
	res.render('register');
});
/*
app.post('/register',function(req,res) {
	MongoClient.connect(url, function(err, db) {
	//assert.equal(err,null);
		//console.log("Connected correctly to server.");
		db.collection("users").insert({username: req.body.name, password: req.body.password}, function(err, res) {
			if (err) throw err;
			//console.log("1 document inserted");
			db.close();
		});
	});
	res.redirect('/');
});
*/
app.post('/register',function(req,res) {
	if (req.body.name == '' || req.body.password == ''){
		res.render('noNamePw');
	} else {
		MongoClient.connect(url, function(err, db) {
			//assert.equal(err,null);
			//console.log("Connected correctly to server.");
			  db.collection("users").findOne({username: req.body.name, password: req.body.password}, function(err, result) {
			    if (err) throw err;
			    if (!result){
			    	//console.log("nothing");
			    	db.collection("users").insertOne({username: req.body.name, password: req.body.password}, function(err, res1) {
				    	if (err) throw err;
						res.render('registerSuccess');
	  				});
			    } else {
			    	//console.log("sth");
			    	res.render('repeatName');
			    }
			    
			    db.close();
			  });
		});
	}
	//res.redirect('/');
});



app.get('/logout',function(req,res) {
	req.session = null;
	res.redirect('/');
});

app.get('/createRest',function(req,res) {
	if (!req.session.authenticated) {
		res.redirect('/login');
	}
	else{
		res.render('restinfo');
	}
});

app.post('/createRest',function(req,res) {
	if (!req.session.authenticated) {
		res.redirect('/login');
	}
	else{
		var tempArray = [];
		tempArray[0] = (req.body.name != '') ? req.body.name : null;
		tempArray[1] = (req.body.borough != '') ? req.body.borough : null;
		tempArray[2] = (req.body.cuisine != '') ? req.body.cuisine : null;
		tempArray[3] = (req.body.photo != '') ? req.body.photo : null;
		tempArray[4] = (req.body.photoMimetype != '') ? req.body.photoMimetype : null;
		tempArray[5] = (req.body.street != '') ? req.body.street : null;
		tempArray[6] = (req.body.building != '') ? req.body.building : null;
		tempArray[7] = (req.body.zipcode != '') ? req.body.zipcode : null;
		tempArray[8] = (req.body.coord != '') ? req.body.coord : null;
		//tempArray[9] = (req.body.user != '') ? req.body.user : null;
		//tempArray[10] = (req.body.score != '') ? req.body.score : null;
		//tempArray[11] = (req.body.owner != '') ? req.body.owner : null;
		//tempArray[12] = (req.body.create != '') ? req.body.create : null;
		//console.log(tempArray[0]+ "abc");
		//---------------------image---------------------------------------
        
       
		/*
        var form = new formidable.IncomingForm();
      	form.parse(req, function (err, fields, files) {
	        console.log(JSON.stringify(files));
	        var filename = files.filetoupload.path;
	        var title = (fields.title.length > 0) ? fields.title : "untitled";
	        var mimetype = files.filetoupload.type;
	        console.log("title = " + title);
	        console.log("filename = " + filename);
	        //
	        var exif = {};
	        var image = {};
	        image['image'] = filename;
        */
        //---------------------------
	    /*fs.readFile(filename, function(err,data) {
	        MongoClient.connect(mongourl,function(err,db) {
	            var new_r = {};
	            new_r['title'] = title;
	            new_r['mimetype'] = mimetype;
	            new_r['image'] = new Buffer(data).toString('base64');
	            new_r['exif'] = exif;
	            insertPhoto(db,new_r,function(result) {
	              	db.close();
	              	if (result) {
	                	res.writeHead(200, {"Content-Type": "text/plain"});
	                	res.end('Photo was inserted into MongoDB!');
	              	} else {
	                	res.writeHead(500, {"Content-Type": "text/plain"});
	                	res.end('Photo too big! Unable to insert!');              
	              	}
	            	})
	          	});
	        })
	    });*/

	    //------------------------
	    //fs.readFile(req.files.photo, function(err,data) {
			//console.log(JSON.stringify(data))
			//console.log(path.resolve(__dirname, 'req.body.photo'));
		//});
		//--------------------------
        /*try {
          	new ExifImage(req.body.photo, function(error, exifData) {
          		console.log(JSON.stringify(req.body.photo));
           		if (error) {
             	 	//console.log('ExifImage: ' + error.message);
             	 	console.log("nothing");
            	}
            	else {
              		//exif['image'] = exifData.image;
              		//exif['exif'] = exifData.exif;
              		//exif['gps'] = exifData.gps;
              		console.log("sth");
           		}
          	});
        } catch(error){
        	console.log("cathc ");
        }
*/
        



        //---------------------image-------------------
		if (tempArray[0] == null /*||tempArray[11] == null*/){
			//console.log(tempArray[0],tempArray[11]);
			//var temp= "enter owner and user "
			
			res.render('noName');
		}
		else {
			if (tempArray != null){
				//console.log(tempArray[i]);
				MongoClient.connect(url, function(err, db) {
				 	if (err) throw err;
				  	var myobj = {name: tempArray[0], borough:tempArray[1], 
				 	cuisine: tempArray[2], photo: tempArray[3], photoMimetype: tempArray[4],
				  	address : {street: tempArray[5], building: tempArray[6] ,zipcode:tempArray[7], 
				  	coord: tempArray[8]}, grade : []/*{user: tempArray[9], score: tempArray[10]},*/ 
				  	, owner: req.session.username /* tempArray[11]*/};
				  	db.collection("restaurants").insertOne(myobj, function(err, res) {
				   		if (err) throw err;
				    	//console.log("1 document inserted");
				    	db.close();
				  	});
				});
			}
		}
		res.render('insertSuccess');

	}
});

app.get('/gohome',function(req,res) {
	if (!req.session.authenticated) {
		res.redirect('/login');
	}
	else{
		//res.render('restinfo');
		res.redirect('/');
	}
});

app.get('/showdetails', function(req,res) {
	if (!req.session.authenticated) {
		res.redirect('/login');
	}else {
		MongoClient.connect(url, function(err, db) {
			var temp;
		  	if (err) throw err;
		  	db.collection("restaurants").find({}).toArray(function(err, result) {
		  		//console.log(result);
		  		tempResult= result;
		    	for (var i = 0; i< result.length; i++){
		    		if (req.query.id == result[i]._id){
		    			temp = result[i];
		    			tempTargetResult = temp;
		    			//console.log(temp);
		    			res.render('details',{detail : tempTargetResult});
		    		}
		    	}
		    	//console.log(result[0]._id);
		    	//db.close();
		  	});
		});
	}
});

app.get('/update', function(req,res) {
	if (!req.session.authenticated) {
		res.redirect('/login');
	}else{
		if (req.session.username != tempTargetResult.owner){
			res.render('notOwner');
		} else {
			res.render('update');
		}
	}
});

app.post('/update', function(req,res) {
	if (req.session.username != tempTargetResult.owner){
		res.render('notOwner');
	}else {
		//console.log(tempTargetResult);
		var myobj;
		var tempReqArray = [];
		var tempResultArray = [];
		tempResultArray[0] = tempTargetResult._id;
		tempResultArray[1] = tempTargetResult.name;
		tempResultArray[2] = tempTargetResult.borough;
		tempResultArray[3] = tempTargetResult.cuisine;
		tempResultArray[4] = tempTargetResult.photo;
		tempResultArray[5] = tempTargetResult.photoMimetype;
		tempResultArray[6] = tempTargetResult.address.street;
		tempResultArray[7] = tempTargetResult.address.building;
		tempResultArray[8] = tempTargetResult.address.zipcode;
		tempResultArray[9] = tempTargetResult.address.coord;
		tempResultArray[10] = tempTargetResult.grade.user;
		tempResultArray[11] = tempTargetResult.grade.score;
		tempResultArray[12] = tempTargetResult.owner;
	//-------------
		tempReqArray[1] = (req.body.name != '') ? req.body.name : null;
		tempReqArray[2] = (req.body.borough != '') ? req.body.borough : null;
		tempReqArray[3] = (req.body.cuisine != '') ? req.body.cuisine : null;
		tempReqArray[4] = (req.body.photo != '') ? req.body.photo : null;
		tempReqArray[5] = (req.body.photoMimetype != '') ? req.body.photoMimetype : null;
		tempReqArray[6] = (req.body.street != '') ? req.body.street : null;
		tempReqArray[7] = (req.body.building != '') ? req.body.building : null;
		tempReqArray[8] = (req.body.zipcode != '') ? req.body.zipcode : null;
		tempReqArray[9] = (req.body.coord != '') ? req.body.coord : null;
		//tempReqArray[10] = (req.body.user != '') ? req.body.user : null;
		//tempReqArray[11] = (req.body.score != '') ? req.body.score : null;
		//tempReqArray[12] = (req.body.owner != '') ? req.body.owner : null;
		for (var i = 0; i< tempReqArray.length; i++){
			if (tempReqArray[i] != null){
				tempResultArray[i] = tempReqArray[i];
				//console.log(tempResultArray);
			}
		}	
			//
		myobj = {_id : tempResultArray[0], name: tempResultArray[1], borough:tempResultArray[2], 
				 	cuisine: tempResultArray[3], photo: tempResultArray[4], 
				 	photoMimetype: tempResultArray[5], address : {street: tempResultArray[6],
				 	building: tempResultArray[7] ,zipcode:tempResultArray[8], 
				  	coord: tempResultArray[9]}, grade : []/*user: tempResultArray[10], 
			  		score: tempResultArray[11]*/, owner: tempResultArray[12]};
		//console.log(myobj);
		//update
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
		  	var myquery = { _id : tempResultArray[0] };
		 	//var newvalues = { name: "Mickey", address: "Canyon 123" };
		 	db.collection("restaurants").updateOne(myquery, myobj, function(err, res) {
				//if (err) throw err;
		    	//console.log("1 document updated");
		   	 	db.close();
		   	 	
		  	});
		});
		res.render('updateSuccess');
	}
});


app.get('/rate',function(req,res) {
	if (!req.session.authenticated) {
		res.redirect('/login');
	} else {
		console.log(tempTargetResult.grade);
		tempTargetResult.grade.forEach(function(a) {
			console.log(a.user);
			if (a.user == req.session.username){
				res.render('alreadyRate');
			}
		});
		/*for (var i = 0; i< tempTargetResult.grade.length; i++){
			console.log(tempTargetResult.grade[i].user);
			if (tempTargetResult[i].grade.user == req.session.username){
				res.render('alreadyRate');
			}
		}*/
		res.render('rate');
	}
});

app.post('/rate',function(req,res) {
	if (!req.session.authenticated) {
		res.redirect('/login');
	} else {
		var tempArray = [];
		var tempResultArray = [];
		tempArray[0] = req.session.username;
		tempArray[1] = req.body.score;
		tempResultArray[0] = tempTargetResult._id;
		tempResultArray[1] = tempTargetResult.name;
		tempResultArray[2] = tempTargetResult.borough;
		tempResultArray[3] = tempTargetResult.cuisine;
		tempResultArray[4] = tempTargetResult.photo;
		tempResultArray[5] = tempTargetResult.photoMimetype;
		tempResultArray[6] = tempTargetResult.address.street;
		tempResultArray[7] = tempTargetResult.address.building;
		tempResultArray[8] = tempTargetResult.address.zipcode;
		tempResultArray[9] = tempTargetResult.address.coord;
		tempResultArray[10] = tempTargetResult.grade.user;
		tempResultArray[11] = tempTargetResult.grade.score;
		tempResultArray[12] = tempTargetResult.owner;
		/*myobj = {name: tempResultArray[1], borough:tempResultArray[2], 
				 	cuisine: tempResultArray[3], photo: tempResultArray[4], 
				 	photoMimetype: tempResultArray[5], address : {street: tempResultArray[6],
				 	building: tempResultArray[7] ,zipcode:tempResultArray[8], 
				  	coord: tempResultArray[9]}, grade : {user: tempArray[0], 
			  		score: tempArray[1]}, owner: tempResultArray[12]};*/
		myobj= {$push: {grade: {user: tempArray[0],score: tempArray[1]}}};
		//console.log(myobj);
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			var myquery = { _id : tempTargetResult._id };
		 	db.collection("restaurants").updateOne(myquery, myobj, function(err, res) {
				if (err) throw err;
		    	//console.log("rate updated");
		   	 	db.close();
		  	});
		});
		res.render('rateSuccess');
	}
	
});



app.get('/delete',function(req,res) {
	if (!req.session.authenticated) {
		res.redirect('/login');
	} else {
		if (req.session.username != tempTargetResult.owner){
			res.render('notOwner');
		} else {
			MongoClient.connect(url, function(err, db) {
			  	if (err) throw err;
			 	//var myquery = { address: 'Mountain 21' };
			 	var myobj = tempTargetResult;
			  	db.collection("restaurants").deleteOne(myobj, function(err, obj) {
			    	if (err) throw err;
			    	//console.log("1 document deleted");
			    	db.close();
			    	res.render('deleteSuccess');
			 	});
			});
		}
	}
});
app.get('/search',function(req,res) {
	if (!req.session.authenticated) {
		res.redirect('/login');
	}else {
		res.render('search');
	}
});


app.post('/search',function(req,res) {
	if (!req.session.authenticated) {
		res.redirect('/login');
	}else {
		//console.log(req.body.searchOption);
		//console.log(req.body.keyword);
		var tempSearchArray = [];
		var myobj={}
		if (req.body.searchOption == "name" || req.body.searchOption == "borough" ||
		req.body.searchOption == "cuisine"){
			//console.log("not address");
			myobj[req.body.searchOption] = req.body.keyword;
			//console.log	(myobj[req.body.searchOption]);	
		}
		if ((req.body.searchOption == "street" || req.body.searchOption == "building" ||
		req.body.searchOption == "zipcode" || req.body.searchOption == "coord")){
			//console.log(" address");
			myobj['address.' + req.body.searchOption] = req.body.keyword;
		}
		MongoClient.connect(url, function(err, db) {
		  	if (err) throw err;
		  	/*
		  	db.collection("restaurants").find(myobj, function(err, result) {
		    	if (err) throw err;
		    	if (!result){
		    		//console.log("nothing");
		    		res.render('noResult');
		    	}else {
		    		//console.log("sth");
		    		//tempSearchArray = result;
		    		//console.log(tempSearchArray);
		    		for (var i = 0 ; i < result.length; i++){
		    			if (result[i].name == req.body.keyword ||  result[i].borough == req.body.keyword ||
		    				result[i].cuisine == req.body.keyword || 
		    				result[i].address.street == req.body.keyword || 
		    				result[i].address.building == req.body.keyword ||
		    				result[i].address.zipcode == req.body.keyword || 
		    				result[i].address.coord == req.body.keyword){

		    				tempSearchArray.push(result[i]); 

		    			}
		    			console.log(tempSearchArray);	
		    		}
					res.render('searchResult',{c:tempSearchArray});
		    	}
		    	

		    	db.close();
		  	});*/
		  	
		  	db.collection("restaurants").find({}).toArray(function(err, result) {
		  		//console.log(result);

		  		tempResult= result;
		    	for (var i = 0; i< result.length; i++){
		    		if (req.body.searchOption == "name"){
		    			if (req.body.keyword == result[i].name){
		    				tempSearchArray.push(result[i]);
		    			}
		    		}
		    		if (req.body.searchOption == "borough"){
		    			if (req.body.keyword == result[i].borough){
		    				tempSearchArray.push(result[i]);
		    			}
		    		}
		    		if (req.body.searchOption == "cuisine"){
		    			if (req.body.keyword == result[i].cuisine){
		    				tempSearchArray.push(result[i]);
		    			}
		    		}
		    		if (req.body.searchOption == "street"){
		    			if (req.body.keyword == result[i].address.street){
		    				tempSearchArray.push(result[i]);
		    			}
		    		}
		    		if (req.body.searchOption == "building"){
		    			if (req.body.keyword == result[i].address.building){
		    				tempSearchArray.push(result[i]);
		    			}
		    		}
		    		if (req.body.searchOption == "zipcode"){
		    			if (req.body.keyword == result[i].address.zipcode){
		    				tempSearchArray.push(result[i]);
		    			}
		    		}
		    		if (req.body.searchOption == "coord"){
		    			if (req.body.keyword == result[i].address.coord){
		    				tempSearchArray.push(result[i]);
		    			}
		    		}
		    		
		    	}
		    	//console.log(tempSearchArray);
		    	if (tempSearchArray.length != 0){
		    			//console.log("sth");
		    			//console.log(tempSearchArray);
		    			res.render('searchResult', {c:tempSearchArray});
		    	} 
		    	if (tempSearchArray.length == 0){
		    		res.render('noResult');
		    	}
		    	//console.log(result[0]._id);
		    	//db.close();    
		  	});
		});
	}
});

app.get('/googlemap',function(req,res) {
	var coordinate = tempTargetResult.address.coord.split(",");
	//console.log(tempTargetResult.address.coord);
	//console.log(coordinate);
	res.render('googlemap',{coordinate:coordinate});

});
app.listen(process.env.PORT || 8099);



























