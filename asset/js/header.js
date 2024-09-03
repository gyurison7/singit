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