/* Info
 ========================================================================== */
/**
 * 1. Writer: Ajin Lee. (Weaverloft Corp.)
 * 2. Production Date: 2024-07-30
 * 3. Client: MEDIASCOPE Inc.
 */

/*========== Header 메인 로고 타이틀 명 삽입 ==========*/
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

/*========== Header 싱코인 comma ==========*/
$(function(){
	if($('.num').length > 0){
		$('.num').each(function(index,el){
			var num = $(el).text();
			var numCom = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			$('.num').eq(index).text(numCom);
		});
	}
});

/*========== Search Box ==========*/
$(function(){
	if ($(".search-input-wrap").length > 0) {
		$(document).ready(function() {
			const $searchWrap = $('.search-input-wrap');
			const $searchInput = $searchWrap.find('input');
			const $searchDeleteBtn = $('.search-del-btn');
			const $searchBtn = $('.search-btn');
			const $searchTxt = $('.search-keyword-wrap');
	
			function updateOverflow() {
				if ($searchTxt.length > 0 && $searchTxt.hasClass('on')) {
					$('html').css("overflow", "hidden");
				} else {
					$('html').css("overflow", "auto");
				}
			}
	
			function initializeSearch() {
				$searchInput.val('');
				$searchWrap.removeClass('on');
				$searchTxt.removeClass('on');
				updateOverflow();
			}
	
			initializeSearch();
	
			$searchInput.on('focus keyup', function() {
				if ($(this).val().length > 0) {
					$searchWrap.addClass('on');
					$searchTxt.addClass('on');
				} else {
					$searchWrap.removeClass('on');
					$searchTxt.removeClass('on');
				}
				updateOverflow();
			});
			// $searchInput.on('blur', function() {
			// 	if ($($searchTxt).hasClass('on')) {
			// 		$searchWrap.addClass('on');
			// 	} else {
			// 		$searchWrap.removeClass('on');
			// 	}
			// });
	
			$searchBtn.on('click', function() {
				$searchWrap.removeClass('on');
				$searchTxt.removeClass('on');
				updateOverflow();
			});
	
			$searchDeleteBtn.on('click', function() {
				$(this).closest('.search-input-wrap').find('.search-input').val('');
				$(this).closest('.search-input-wrap').removeClass('on');
				$searchTxt.removeClass('on');
				updateOverflow();
			});
	
			// 연관 검색어와 추천 검색어 클릭 이벤트 통합
			$(".keyword-list li, .recommend-keyword .keyword-list li").on("click touchend", function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				let keyword = $(this).find(".keyword span").text();
				
				// setTimeout을 사용하여 비동기적으로 input 값을 설정
				setTimeout(function() {
					$searchInput.val(keyword).trigger('input');
					$searchWrap.addClass('on');
					$searchTxt.removeClass('on');
					updateOverflow();
				}, 0);
	
				return false;
			});
	
			$(document).on('mouseup touchend', function(e) {
				if (!$searchWrap.is(e.target) && $searchWrap.has(e.target).length === 0) {
					$searchWrap.removeClass('on');
					$searchTxt.removeClass('on');
					updateOverflow();
				}
			});
	
			$(window).on('resize', initializeSearch);
		});
	}
});