/**
 * Created by zZ on 2017/5/27.
 */
const express = require('express');
const mongoose = require('mongoose');
const swig = require('swig');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = new express();

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const User = require('./models/User');
const Task = require('./models/Task');
const Event = require('./models/Event');

//静态文件托管
app.use('/public', express.static(__dirname + '/public'));

//设置模板
app.engine('html', swig.renderFile);
app.set('views', './views');
app.set('view engine', 'html');
swig.setDefaults({
    cache: false
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/*设置cookie*/
app.use(cookieParser());

app.use('/', require('./routers/index'));
app.use('/login', require('./routers/login'));
app.use('/register', require('./routers/register'));
app.use('/exit', require('./routers/exit'));

mongoose.connect('mongodb://localhost:27017/chat', function (err, data) {
    if (err) {
        console.log('数据库连接失败！');
    } else {
        server.listen(8880, function () {
            console.log('服务器连接成功！');
        });

    }
});


io.on('connection', function (socket) {
    socket.on('login', function (data) {//登录
        var username = data.username;
        socket.username = username;
        User.find().then(function (data) {
            for (var i = 0; i < data.length; i++) {
                if (!data[i].state) {
                    data.splice(i, 1);
                }
            }
		Task.find({username:username}).then(function(t_data){
                	socket.emit('loginSuccess',t_data);
                	//socket.broadcast.emit('task_list',t_data);
       		 });
           //socket.emit('loginSuccess', data);
            //socket.broadcast.emit('user_list', data);
            socket.broadcast.emit('userIn', username);
        });
	
	

    });
    socket.on('disconnect', function (data) {//退出
        var username = data.username || socket.username;
        User.findOne({
            username: username
        }).then(function (userInfo) {
            if (userInfo) {
                return User.update({
                    _id: userInfo._id
                }, {
                    state: false
                })
            }
        }).then(function () {
            return User.find();
        }).then(function (data) {
            for (var i = 0; i < data.length; i++) {
                if (!data[i].state) {
                    data.splice(i, 1);
                }
            }
            socket.broadcast.emit('user_list', data);
            socket.broadcast.emit('userOut', username);
        })
    });
    socket.on('postNewMsg', function (data) {//接收到新消息
        socket.broadcast.emit('newMsg', data);
    });
    socket.on('postImg', function (data) {//接收到图片
        socket.broadcast.emit('newImg', data);
    });

    socket.on('edit', function (data) {
        var username = data.username || socket.username;
        User.findOne({
            username: username
        }).then(function (userInfo) {
            return User.update({
                _id: userInfo._id
            }, {
                username: data.newName,
                image: data.newImage
            })
        }).then(function () {
            socket.username = data.newName;
            return User.find();
        }).then(function (data) {
            for (var i = 0; i < data.length; i++) {
                if (!data[i].state) {
                    data.splice(i, 1);
                }
            }
            //socket.emit('user_list', data);
            //socket.broadcast.emit('user_list', data);
        });
    })
	
	socket.on('add_t',function(data){
		console.log(data.taskName);
		var username = data.username || socket.username;
		var taskname = data.taskName;
		var taskdescript = data.taskdescript;
		//var duration = data.date;
		var state = false;
		var content = {t_name:taskname,t_descript:taskdescript,username:username,state:state};
		var tableInsert = new Task(content);
		console.log('befor save');
		tableInsert.save(function(err){
			if(err){
				console.log(err);
			}else{
				console.log('insert sucess');
			}
		});
		
		await Task.find({username : username}).then(function(t_data){
			console.log('Refresh');
			socket.emit('task_list',t_data);
			socket.broadcast.emit('task_list',t_data);
		});

		
	})

	socket.on('add_e',function(data){
		var username = data.username || socket.username;
		var eventname = data.eventName;
		var eventdescript = data.eventDescript;
		var state = false;
		var content = {e_name : eventname,e_descript : eventdescript,e_Type : data.eventtype,state : state};

		var eventInsert = new Event(content);
		eventInsert.save(function(err){
			if(err){
				console.log(err);	
			}else{
				console.log('event insert sucess');
			}
		});
		socket.emit('event_list',data);
	})

})	
;
