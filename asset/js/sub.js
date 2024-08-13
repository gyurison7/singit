/* Info
 ========================================================================== */
/**
 * 1. Writer: Gyuri Son. (Weaverloft Corp.)
 * 2. Production Date: 2024-08-13
 * 3. Client: MEDIASCOPE Inc.
 */

/*========== faq, 서비스 이용 약관 ==========*/
$(function() {
    $(".toggle-title").click(function() {
        if($(this).hasClass("on")) {
            $(this).closest(".toggle-item").find(".toggle-content").slideUp(); // 토글 닫기
            $(this).removeClass("on"); // 화살표 아이콘 방향 전환
        } else {
            $(".toggle-content").slideUp();
            $(".toggle-title").removeClass("on");
            
            $(this).closest(".toggle-item").find(".toggle-content").slideDown(); // 토글 열기
            $(this).addClass("on"); // 화살표 아이콘 방향 전환
        }
    });
});