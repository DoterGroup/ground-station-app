function updateUser(){

	var id = document.getElementById("idUser").value;
	var nick = document.getElementById('nickname').value;
	var user = document.getElementById('user').value;
	var psw = document.getElementById('newPsw').value;

	var formData={
	  nick: nick,
	  user: user,
	  psw: psw
	};
	if (nick == "") {
		alert('Ingrese un Nickname');
	}
	else if (user == "") {
		alert('Ingrese un Usuario');
	}
	else if (psw == ""){alert('ingrese una contraseña')
	}
	else{
		console.log(formData);
		$.ajax({
	        url : "/profile/put/"+id,
	        type: "POST",
	        data : formData,
	        success: function(data)
	        {
	            console.log('success');
	            $('#messageUpdate').append('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Successfully Update</div>');
	        },
	        error: function (jqXHR, textStatus, errorThrown)
	        {
	     
	        }
	    });
	}
	

}
