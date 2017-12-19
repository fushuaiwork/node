## 简介 ##

本文是由nodejs+mongoose+websocket打造的一个即时聊天系统；本来打算开发一个类似于网页QQ类似功能的聊天系统，但是目前只是开发了一个模块功能 --- 类似群聊的，即一对多的聊天模式；因为时间关系，一对一私聊功能还没有开发，敬请期待！

该聊天室整个页面布局是通过bootstrap框架编写，可能很简陋，请大家多多包涵！

## 源码及作品 ##

作品在线地址：http://chat.hawkzz.com
源码地址：https://github.com/zhuangZhou/chat.io

本地运行方法：

+ 命令下载：npm install 
+ 启动node服务器：node app.js
+ 在浏览器中打开：http://localhost:8880

下面为效果图预览：

![](http://upload-images.jianshu.io/upload_images/6194826-411f5edc7407fcc0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 环境介绍 ##

+ Windows 7 PC
+ nodejs
+ mongoDB
+ websocket
+ boostrap

## 准备工作 ##

+ 安装node(废话，这肯定是必须的),安装地址：<https://nodejs.org/en/>
+ 安装mongoDB环境，地址：https://www.mongodb.com/download-center#community
+ 创建一个文件夹（这里你随意）；
+ 初始化文件夹，使其变成一个node项目文件夹 npm init 或者 npm init -y;这里讲一下这两种的区别，npm init是初始化但是要自己选择初始化的条件，npm init -y则是默认选择初始化内容；
+ 创建app.js文件，作为整个项目的入口文件；
+ 安装整个项目的依赖，如下：
    1. express框架
    2. mongoose，是mongoDB的一个对象模型工具
    3. cookie-parser
    4. body-parser
    5. swig模板
    6. socket.io

## 开始工作 ##

### express框架搭建 ###

express是一个基于 Node.js 平台的极简、灵活的 web 应用开发框架，它提供一系列强大的特性，帮助你创建各种 Web 和移动设备应用。接下来我们在上面创建的app.js 里面搭建express框架的搭建

```
var express = require('experss');//引入express模块

var app =  new express();//实例化

app.listen(8880);//监听端口8880，这里可以自定义端口
```


根据以上，其实一个node服务器已经搭好了，通过命令‘node app.js’即可运行，地址是localhost:8880；这只是一个简单的服务器，想要加载页面以及页面交互，这些肯定是远远不够，接下来我们一步步开始；

首先，我们创建三个文件夹，分别为views，public，router；
+ views文件夹：存放html模板文件；
+ public文件夹：存放静态文件，如：js，css，image
+ router文件夹：存放页面的路由以及与数据库交互的文件；

然后，设置模板，以及静态文件托管,以及加载body-parser和cookie模块

```
var express = require('express');
var swig = require('swig');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var app = new express();

var server = require('http').createServer(app);

//静态文件托管
app.use('/public', express.static(__dirname + '/public'));

//设置模板
app.engine('html', swig.renderFile);
app.set('views', './views');
app.set('view engine', 'html');
swig.setDefaults({
    cache: false
});

//设置body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//设置cookie
app.use(cookieParser());

//加载路由
app.use('/', require('./routers/index')); //首页
app.use('/login', require('./routers/login')); //登录页面
app.use('/register', require('./routers/register'));//注册页面
app.use('/exit', require('./routers/exit'));//退出

server.listen(8880, function () {
    console.log('服务器连接成功！');
});
```

### mongoDB搭建 ###

首先，我们需要下载安装mongoDB环境，https://www.mongodb.com/download-center#community；

然后，创建一个文件夹database，存放本项目所需的mongoDB数据库文件；

接着，我们将mongoDB数据库的存放指向database；

    1. 通过cmd找到mongoDB安装路径 -->  Server --> bin ;
    2. 输入命令 mongod --dbpath  E://chat/database ;
    3. 回车；

这里，我们是使用mongoDB的一个对象模型工具--mongoose来对mongoDB数据库进行操作，所以，这里我们需要了解mongoose的机制；

mongoose是mongoDB的一个对象模型工具，是基于node-mongodb-native开发的mongoDB的nodejs驱动，可以在异步的环境下执行。同时它也是针对mongoDB操作的一个对象模型库，封装了mongoDB对文档的一些增删改查等常用方法，让nodejs操作mongoDB数据库变得更加容易。

如果要通过mongoose创建一个集合并对其进行增删改查，就需要用到Schema，Model；所以接下来我们创建两个文件夹Schema，Model来存储Schema和Model文件（这里我是把这两个分开存放，也可以写在一起）；

Schema是一种以文件形式存储的数据库模型骨架，无法直接通往数据库端，也就是说它不具备对数据库的操作能力，仅仅只是数据库模型在程序片段中的一种表现，可以说是数据属性模型（传统意义的表结构），又或者是集合的模型骨架。基本属性类型有字符串、日期型、数值型、布尔型、null、数组、内嵌文档等。

Model由Schema构造生成的模型，除了Schema定义的数据库骨架以外，还具有数据库操作的行为，类似于管理数据属性、行为的类。


到目前为止，我们整个项目的骨架，以及所有目录结构已经搭建完成，如下图：

![](http://upload-images.jianshu.io/upload_images/6194826-d4a2716af85ae062.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


### 登录与注册 ###

因为我们要求连接的用户首先要注册一个账号，并且这个账号的用户名是唯一的，不能与别人相同，方便用户区分，以及一些数据库操作；

为此在后台中，我们需要创建数据库连接，以及登录注册页面；

1.在app.js连接数据库

```
var  mongoose = require('mongoose');

...
...
...

mongoose.connect('mongodb://localhost:27017/chat', function (err, data) {
    if (err) {
        console.log('数据库连接失败！');
    } else {
        server.listen(8880, function () {
            console.log('服务器连接成功！');
        });

    }
});
```

这里我把数据库连接放在服务器监听外面，是为了当数据库启动后，再启动服务器，避免服务器启动，数据库连接不上，导致整个程序跑不动；

2.在Schema文件夹创建user.js文件，创建user的数据属性模型

```
const mongose = require('mongoose');

const user = mongose.Schema({
    username: String, //用户姓名
    password: String, //用户密码
    image: String,  //用户图像
    state: Boolean  //用户上学状态
});

module.exports = user;


```

3.在Model文件夹创建User.js 文件，创建user的对象模型

```
const mongoose = require('mongoose');
const userSchema = require('../schemas/user');
module.exports = mongoose.model('User', userSchema);
```

4.在views创建注册页面register.html,以及在router创建register.js

前台：

```
$('#register').on({
        click: function () {
            var username = $('#username').val();
            var password = $('#password').val();
            var rePassowrd = $('#rePassword').val();
            if (username == '') {
                alert('请填写用户名！');
                return false;
            }
            var reg = /^[a-z0-9_-]{6,18}$/;
            if (!reg.test(password)) {
                alert('请填写6-12位密码！');
                return false;
            }

            if (password !== rePassowrd) {
                alert('两次密码不一致!');
                return false;
            }

            $.post('/register/signUp', {username: username, password: password}, function (res) {
                if (res.success == 1) {
                    location.href = 'login';
                } else {
                    alert(res.err);
                }
            }, 'json')
        }
    });
```

后台：

```
const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/', function (req, res) {
    res.render('register.html');
});

router.post('/signUp', function (req, res) {
    var username = req.body.username; //获取前台传过来的数据
    var password = req.body.password;
    var resData = {};
    User.findOne({
        username: username
    }).then(function (userInfo) {
        if (userInfo) {
            resData.success = 0;
            resData.err = "该用户名已被注册！";
            res.json(resData);//给前台返回数据状态
            return false;
        } else {
            var user = new User({
                username: username,
                password: password,
                image: '../public/img/people.png', //初始化图像
                state: false  //上线状态
            });
            return user.save();
        }
    }).then(function () {
        resData.success = 1;
        resData.message = "注册成功！";
        res.json(resData);
    })
});

module.exports = router;
```


5.在views创建注册页面login.html,以及在router创建login.js

由于登录页面和注册页面差不多，这里就不详细描述了，具体看代码；

### 主页面 ###


主页面是整个页面的核心，它包括：在线用户统计，用户信息修改，以及聊天模块；

1.在线用户统计

在线用户统计这里可以分成三个小模块，分别是：在线用户展示，用户上线提醒，和用户离开提醒；

后台：

```

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const User = require('./models/User');

io.on('connection', function (socket) {
    socket.on('login', function (data) {//用户登录
        var username = data.username;
        socket.username = username;
        User.find().then(function (data) {
            for (var i = 0; i < data.length; i++) {
                if (!data[i].state) {
                    data.splice(i, 1);
                }
            }
            socket.emit('loginSuccess', data);
            socket.broadcast.emit('user_list', data);
            socket.broadcast.emit('userIn', username);
        });

    });
    socket.on('disconnect', function (data) {//用户离开
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
});

```


前台：

<span style="color: #f66;">用户上线提醒</span>

```
var username = $('#username').text();
var socket = io.connect('http://localhost:8880');
socket.emit('login', {username: username});

//有人加入
socket.on('userIn', function (data) {
    var html = '<li class="tip"><div class="text-center">@ ' + data + ' @上线</div></li>';
    $('#MsgList').append(html);
});
```

当用户登录成功，跳转到主页面后，前台通过io.connect()与服务器建立websocket连接，开始即时通信；并且同时通过socket.emit('login')向服务器发送用户上线的通知；

服务器通过socket.on('login')接收到前台发送的用户上线消息，然后通过 socket.broadcast.emit('userIn', username)向其他在线用户广播发送，该用户上线的消息；其他用户通过socket.on('userIn')接收消息，并向聊天模块上，添加提示；

![](http://upload-images.jianshu.io/upload_images/6194826-759d8110927e675e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



<span style="color: #f66;">用户离线提醒</span> 

前台：

```
//有人退出
socket.on('userOut', function (data) {
    var html = '<li class="tip"><div class="text-center">@ ' + data + ' @离开</div></li>';
    $('#MsgList').append(html);
});

//退出
$('#exitBtn').on('click', function () {
    var username = $('#username').text();
    location.href = 'exit';
});
```

在这里我把用户离线分为三种情况：一是，点击“退出”按钮；二是，关闭浏览器；三是，刷新该页面；但是不管是哪一种情况，只要页面改变了，都会触发服务器的socket.on('disconnect'),更改用户状态，然后服务器进行命令发送，这里和用户上线提醒的操作是一样的；

当在写刷新浏览器的时候，遇到了一个问题；我原本的想法是通过js监控浏览器的事件操作，然而发现这根本是不可能的，虽然在网上有很多帖子，但是通过实现都不能实现；

于是，我就想到了一个方法，当页面第一次通过login页面到主页面的时候，设置两个cookie，一个为user，来判断用户登录的；一个为flag，来判断页面已经加载过了；当用户刷新的时候，判断是否存在cookie-flag，如果存在，证明已经加载过了，就直接退出，用户离线；否则就是用户上线；这个方法可能不是很好，希望大神们有什么好方法，来解决这个问题；

后台：

index.js 主页面

```
router.get('/home', function (req, res) {
    if (!req.cookies.user) {
        res.redirect('/login');
    } else {
        if (!req.cookies.flag) {
            User.findOne({
                username: req.cookies.user
            }).then(function (userInfo) {
                res.render('home', {
                    username: userInfo.username,
                    image: userInfo.image
                });
            });
        } else {
            res.redirect('/exit');
        }

    }
});
```

eixt.js 退出

```
router.get('/', function (req, res) {
    User.update({
        username: req.cookies.user
    }, {
        state: false
    }).then(function () {
        res.clearCookie('user');
        res.clearCookie('flag');
        res.redirect('/login');
    });
});
```

<span style="color: #f66;">在线用户展示</span> 

```
socket.on('loginSuccess', function (data) {
    userUpdate(data);
});

//更新在线人数列表
socket.on('user_list', function (data) {
    userUpdate(data);
});
function userUpdate(data) {
    var len = data.length;
    var str = '';
    for (var i = 0; i < len; i++) {
        str += '<li>';
        str += '![](' + data[i].image + ')';
        str += '<span>' + data[i].username + '</span>'
    }
    $('#peopleList').html(str);
    $('#list-count span').html(len);
}
```

这里在线用户展示分两种情况，一是，用户刚刚登陆时，需要在侧边栏展示已在线用户；二是，当有新用户登陆时，其他用户更新在线用户；

第一种情况，在服务器收到socket.on('login')时，通过socket.emit('loginSuccess')向新用户发送在线用户；

第二种情况，在服务器收到socket.on('login')时，通过socket.broadcast.emit('user_list')向其他用户发送更新在线用户的命令；

无论是哪种情况，当服务器在发送命令之前，都需要通过User.find()查询在线用户的信息，才能将消息发送给用户；然而当用户收到命令时，虽然是不同的命令，但是所要做的操作是一样的，所以执行相同的方法userUpdate(),展示在侧边栏；

![](http://upload-images.jianshu.io/upload_images/6194826-38c36c7ed33ab81a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


2.聊天模块

当没有写过之前，能够写个向qq一样能即时聊天的功能，感觉好高大上，真牛逼；但是当真正开始写过之后，就感觉也就那么一会事；

闲话不多说；聊天模块的功能无非就是：发送消息和接收消息；当然这里分了发送接收文字信息和图片；虽然分的是两种，但是操作是一样的，又由于我把接收的信息和自己发送信息的样式做了区别，所以我这里把发送信息和接收信息分别封装了两个方法meSendMsg(msg,n)和getMsg(msg, n);参数“msg”是聊天内容，“n”的值为0和1，分类代表发送的是文字消息和图片消息。


前台：

```
//发送消息
$('#sendBtn').on('click', function () {
    var msg = $('#msgInput').val();
    if (msg == '') {
        alert('发送内容不能为空！');
        return false;
    }
    var username = $('#username').text();
    var img = $('#userImage').attr('src');
    meSendMsg(msg, 0);
    socket.emit('postNewMsg', {msg: msg, username: username, image: img});
    $('#msgInput').val('');
});

//接收消息
socket.on('newMsg', function (data) {
    getMsg(data, 0);
});

//发送照片
$('#addImage').on('click', function (e) {
    var e = e || window.event;
    e.stopPropagation();
    $('#files').trigger('click');
});

function changeFiles(e) {
    var e = e || window.event;
    var files = e.target.files || e.dataTransfer.files;
    var len = files.length;
    if (len === 0) return false;
    for (var i = 0; i < len; i++) {
        var fs = new FileReader();
        fs.readAsDataURL(files[i]);
        fs.onload = function () {
            var username = $('#username').text();
            var img = $('#userImage').attr('src');
            socket.emit('postImg', {imgData: this.result, username: username, image: img});
            meSendMsg(this.result, 1);
        }
    }
}

//接收照片
socket.on('newImg', function (data) {
    getMsg(data, 1);
});
//自己发送消息
function meSendMsg(msg, n) {
    var src = $('#userImage').attr('src');
    var name = $('#username').text();
    var html = ' <li class="me">';
    html += '<div class="row">';
    html += ' <div class="userInfo col-sm-1 col-md-1 pull-right">';
    html += '![](' + src + ')';
    html += '<p class="text-center">' + name + '</p>';
    html += '</div>';
    html += '<div class="msgInfo col-sm-5 col-md-5 pull-right">';
    if (n == 0) {
        html += msg;
    } else if (n == 1) {
        html += '![](' + msg + ')';
    }

    html += '</div></div></li>';
    $('#MsgList').append(html);
    var Li = $('#MsgList li');
    var len = Li.length;
    var LiH = Li.eq(len - 1).height();
    var h = document.getElementById('MsgList').scrollHeight;
    document.getElementById('MsgList').scrollTop = h + LiH;
}

//接收消息
function getMsg(data, n) {
    var html = ' <li >';
    html += '<div class="row">';
    html += ' <div class="userInfo col-sm-1 col-md-1">';
    html += '![](' + data.image + ')';
    html += '<p class="text-center">' + data.username + '</p>';
    html += '</div>';
    html += '<div class="msgInfo col-sm-5 col-md-5 ">';
    if (n == 0) {
        html += data.msg;
    } else if (n == 1) {
        html += '![](' + data.imgData + ')';
    }
    html += '</div></div></li>';
    $('#MsgList').append(html);
    var Li = $('#MsgList li');
    var len = Li.length;
    var LiH = Li.eq(len - 1).height();
    var h = document.getElementById('MsgList').scrollHeight;
    document.getElementById('MsgList').scrollTop = h + LiH;
}

```

后台：

```
 socket.on('postNewMsg', function (data) {//接收到新消息
    socket.broadcast.emit('newMsg', data);
});
socket.on('postImg', function (data) {//接收到图片
    socket.broadcast.emit('newImg', data);
});
```


在这里，我来说说图片上传和发送；图片不同于文字的传递，但是如果将图片转化为字符串形式后，便可以像发送普通文字消息一样发送图片了，只是在展示的时候将其还原为图片就行；

在这之前，我们已经将图片按钮在页面放好了，其实是一个文件类型的input，下面只需在它身上做功夫便可。

用户点击图片按钮后，弹出文件选择窗口供用户选择图片。之后我们可以在JavaScript代码中使用FileReader来将图片读取为base64格式的字符串形式进行发送。而base64格式的图片直接可以指定为图片的src，这样就可以将图片用img标签显示在页面了。

为此我们监听图片按钮的change事件，一但用户选择了图片，便显示到自己的屏幕上同时读取为文本发送到服务器。

```
//发送照片
$('#addImage').on('click', function (e) {
    var e = e || window.event;
    e.stopPropagation();
    $('#files').trigger('click');
});

function changeFiles(e) {
    var e = e || window.event;
    var files = e.target.files || e.dataTransfer.files;
    var len = files.length;
    if (len === 0) return false;
    for (var i = 0; i < len; i++) {
        var fs = new FileReader();
        fs.readAsDataURL(files[i]);
        fs.onload = function () {
            var username = $('#username').text();
            var img = $('#userImage').attr('src');
            socket.emit('postImg', {imgData: this.result, username: username, image: img});
            meSendMsg(this.result, 1);
        }
    }
}
```

![](http://upload-images.jianshu.io/upload_images/6194826-e2c523ee1f4241d3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


3.用户修改信息

用户修改信息用到的方法，在上面的编写中都用到了；比如：图片上传和发送，用户列表的更新等，这里我就不详细讲了，大家看代码吧，有什么问题请及时call我；

前台：

```
//修改信息
$('#editImage').on('click', function (e) {
    var e = e || window.event;
    e.stopPropagation();
    $('#fileImg').trigger('click');
});

$('#editBtn').on('click', function () {
    var newName = $('#newName').val();
    var newImage = $('#editImage').attr('src');
    $('#userImage').attr('src', newImage);
    $('#username').html(newName);
    $('#changeInfo').modal('hide');
    socket.emit('edit', {newName: newName, newImage: newImage, username: username});
});
function editImageFn(e) {
    var e = e || window.event;
    var files = e.target.files || e.dataTransfer.files;
    var fs = new FileReader();
    fs.readAsDataURL(files[0]);
    fs.onload = function () {
        $('#editImage').attr('src', this.result);
    }
}
```

后台：

```
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
            socket.emit('user_list', data);
            socket.broadcast.emit('user_list', data);
        });
    })
```

![](http://upload-images.jianshu.io/upload_images/6194826-de9c8700c356e9c4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](http://upload-images.jianshu.io/upload_images/6194826-ba111bcc0f841bc9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



## 小结 ##

到此为止，一个简单的即时聊天室完成了；其实，做这个聊天室的时候，有很多设想，比如发送表情和一对一聊天等，这些都是在其中，虽然现在还没有实现，但是请敬请期待；或者你们自己已经实现了，大家可以交流交流；

在这里说说为什么叫“xxx聊天室”，是因为本人语言能力实在是比较差，想不出什么好名字来（哈哈），大家有什么好名字可以自己添加；

本文可能很多地方用词用句都不是很恰当，也有很多地方讲解不清楚，请大家多多原谅，本人的语言表达能力实在是不怎么样，在以后的文章中，会改善的；


原文: http://blog.hawkzz.com/2017/06/01/xxx聊天室
