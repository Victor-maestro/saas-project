/* jQuery */
$(function() {
	
	$('.radio').on('click', function (e) {

		let radioInput = $(this).children('.radio__input');

		if (e.target !== radioInput[0]) {
			radioInput.click();
		}

		$('.radio').children('.show-field').removeClass('show');

		$(this).children('.show-field').addClass('show');
		
	});



});




