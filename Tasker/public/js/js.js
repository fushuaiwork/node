document.cookie = 'flag=true'
var username = $('#username').text()
var socket = io.connect('http://localhost:8880')
socket.emit('login', {username: username})
socket.on('loginSuccess', function (data) {
    taskUpdate(data)
})

socket.on('event_list',function(data){
	eventUpdate(data)
})

socket.on('task_list',function(data){
	taskUpdate(data)
})


//退出
$('#exitBtn').on('click', function () {
    var username = $('#username').text()
    location.href = 'exit'
})


$('#editBtn').on('click', function () {
    var newName = $('#newName').val()
    var newImage = $('#editImage').attr('src')
    $('#userImage').attr('src', newImage)
    $('#username').html(newName)
    $('#changeInfo').modal('hide')
    socket.emit('edit', {newName: newName, newImage: newImage, username: username})
})

$('#addtask').on('click', async function() {

	var taskName=$('#t_name').val()
	var taskdescript=$('#t_descript').val()
    var divalert = $('#w')
	//var date=$('#t_duration').val()

    if( $('#t_name').val() == ''){
        
    }else {
	   $('#createTask').modal('hide')
	   socket.emit('add_t',{taskName:taskName,taskdescript:taskdescript,username:username})
	}
})

$('#createTask').modal('hide.bs.modal',function () {
    alert('insert success')
})

function backtohome(){
    location.href = 'home'
}

var username = $('#username').text()
        //function gototask(){
    $('#task').click(function(){
                /*var username = $('#username').text()
                //alert('task clicked')
                $.ajax({
                    url: '/home/mytasks',
                    type: 'POST',
                    datatype: 'json'
                    data: {username : username}
                    success: function(data){location.href = 'task'}
                })*/
    	$.post('home/mytasks', {username:username}, function(res){
          	location.href = 'task'
        })
})
            

$('#news').click(function(){
    $.post('home/addnews' , function(res){
        location.href = 'news'
    })
})
            
       
        
$('exitBtn').click(function(){
    location.href = 'exit'
})
