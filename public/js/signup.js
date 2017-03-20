// function createUser() {
// 	// event.preventDefault();
// 	// var name = $("#name").val();
// 	// var email = $("#email").val();
// 	// var password = $("#password").val();

// 	// $.ajax({
// 	// 	type: 'POST',
// 	// 	url: '/users',
// 	// 	dataType: JSON,
// 	// 	data: {
// 	// 		name: name,
// 	// 		email: email,
// 	// 		password: password
// 	// 	},
// 	// 	success: function(data) {
// 	// 		alert("success");
// 	// 	},
// 	// 	error: function(e) {
// 	// 		alert("error" + e.Message);
// 	// 	}
// 	// });
	
// 	// $.post('/users',{"name": "steve", "email": "hi", "password": "123"}, function(data) {
// 	// 	alert("success");
// 	// }); 
// 	}
$(function() {
	
	var $name = $('#name');
	var $email = $('#email');
	var $password = $('#password');

	$('#addUser').on('click', function() {
		
		var User = {
			name: $name.val(),
			email: $email.val(),
			password: $password.val()
		};
		$.ajax({
			type: 'POST',
			url: '/users/signup',
			data: User,
			success: function(data) {
				alert("Account created.");
			},
			error: function() {
				alert("error");
			}
		});
	});
});
	

