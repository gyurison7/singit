/* Info
 ========================================================================== */
/**
 * 1. Writer: Ajin Lee. (Weaverloft Corp.)
 * 2. Production Date: 2024-07-30
 * 3. Client: MEDIASCOPE Inc.
 */

/*========== 앱바 메뉴 Active Style ==========*/
$(function(){
	$(document).ready(function() {
		var $container = $('#container');
        var targetClasses = ['play', 'sing', 'battle', 'my'];
        
        // 모든 li에서 'active' 클래스 제거
        $('#footer .app-bar-wrap li').removeClass('active');
        
        // container의 클래스 중 targetClasses에 해당하는 것을 찾음
        var activeClass = targetClasses.find(function(className) {
            return $container.hasClass(className);
        });
        
        // 해당하는 클래스가 있으면 그에 맞는 li에 'active' 클래스 추가
        if (activeClass) {
            $('#footer .app-bar-wrap li.' + activeClass).addClass('active');
        }
    });
});