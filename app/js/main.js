/* jQuery */
$(function() {
	

	$(window).on("resize", function() {

    if ($(window).width() < 768) {

      $(".toggle-menu").removeClass("toggle-menu_open");
      $(".header__block").removeClass("header__block_show");

    } else {
			$(".toggle-menu").addClass("toggle-menu_open");
		}

	});
	
	if ($(window).width() < 768) {
		$('.menu__link, .user__exit').on('click', function(){
			$(".toggle-menu").removeClass("toggle-menu_open");
      $(".header__block").removeClass("header__block_show");
		});
	}

	// Open & close menu
  $(".toggle-menu").on("click", function () {

    $(this).toggleClass("toggle-menu_open");
    $(this).parent("header").find(".header__block").toggleClass("header__block_show");

    return false;
  });
	

	$('.radio').on('click', function (e) {

		let radioInput = $(this).children('.radio__input');

		if (e.target !== radioInput[0]) {
			radioInput.click();
		}

		$('.radio').children('.show-field').removeClass('show');
		$(this).children('.show-field').addClass('show');
		
	});
});




