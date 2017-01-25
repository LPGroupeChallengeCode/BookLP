$(document).ready(function(){
	$('.swichChoices').on('click', function (e) {

		e.preventDefault();
		$(this).parent().addClass('active');
		$(this).parent().siblings().removeClass('active');


		var target =$('.active > a').text();
		if(target=="signIn"){
			$("#signUpForm").slideUp(function(){$('#loginform').slideDown();});

		}
		else if(target=="signUp")
		{
			$('#loginform').slideUp(function(){$('#signUpForm').slideDown();});

		}
  
});

});