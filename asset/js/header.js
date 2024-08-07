$(function(){
	// 공통 변수
	// let html = document.querySelector("html");
	// let header = document.querySelector("#header");
	// let headerHeight = header.offsetHeight;

	// // Scroll
    // function htmlScroll() {
    //     $(window).scroll(function () {
    //         var sT = $(window).scrollTop();
    //         if (sT >= headerHeight) {
    //             $(html).addClass("scroll");
    //         } else {
    //             $(html).removeClass("scroll");
    //         }
    //     });
    // }
    // htmlScroll();

	// $(window).resize(function(){
	// 	if($(window).width() > 1100) {
	// 		$('.nav-sub-menu').css("display","");
	// 		$('.nav-list').removeClass("on");
	// 	}
	// });

	// $(window).on('resize', function () {
    //     windowWidth = $(window).width();
    //     let sT = $(window).scrollTop();
    //     if (sT >= headerHeight) {
    //         $(html).addClass("scroll");
    //     } else {
    //         $(html).removeClass("scroll");
    //     }
    // });
});

$(function(){
	$(document).ready(function() {
		var containerClass = $('#container').attr('class');
		
		if (containerClass === 'play') {
			$('.header-logo a').text('play');
		} else if (containerClass === 'sing') {
			$('.header-logo a').text('sing');
		} else if (containerClass === 'battle') {
			$('.header-logo a').text('battle');
		} else if (containerClass === 'my') {
			$('.header-logo a').text('my');
		}
	});
});


// 일반 num comma
$(function(){
	if($('.num').length > 0){
		$('.num').each(function(index,el){
			var num = $(el).text();
			var numCom = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			$('.num').eq(index).text(numCom);
		});
	}
});