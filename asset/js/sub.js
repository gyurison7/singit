/* Info
 ========================================================================== */
/**
 * 1. Writer: Ajin Lee. Sunhyeong Kim, Gyuri Son (Weaverloft Corp.)
 * 2. Production Date: 2024-08-13
 * 3. Client: MEDIASCOPE Inc.
 */

/* ------------------------------------------------------------------------  
    PLAY
------------------------------------------------------------------------ */
/*========== PLAY 상세페이지 ==========*/
$(function(){
    if($(".play-vid").length <= 0) return;

    /*== 스크롤 시 영상 높이 셋팅 ==*/
    let vidRatio = 375/520; // Default aspect ratio
    let vidHt = 0;
    let scrollTop = 0;
    let varHt = 0;

    // Function to set video height
    function setVidHt(){
        const secWd = $(".play-vid-sec").width();
        let defaultHt = $(".play-duet-sec").length > 0 ? secWd : secWd / 375 * 520; // duet : solo 기본 비율

        let minHt = secWd / 16 * 9;
        const maxHt = secWd / vidRatio;

        // 예제
        if($(".play-duet-ex-2-1").length > 0){
            minHt = secWd / 2;
        }
        if($(".play-duet-ex-8-3").length > 0){
            minHt = secWd / 8 * 3;
        }

        // Calculate vidHt with constraints
        vidHt = $(".play-duet-sec").length > 0 ? Math.max(minHt, defaultHt) : Math.max(minHt, Math.min(defaultHt, maxHt));
        // 듀엣은 무조건 1:1 비율에서 시작.

        // 예제
        if($(".play-duet-ex-2-1").length > 0){
            vidHt = secWd / 2;
        }
        if($(".play-duet-ex-8-3").length > 0){
            vidHt = secWd / 8 * 3;
        }

        scrollTop = $(window).scrollTop();
        varHt = Math.max(minHt, vidHt - scrollTop);

        $(".play-vid-sec .play-vid-box").height(varHt);
        $(".progress-bar-wrap").css("top",varHt);
        if($(".play-duet-sec").length > 0 && $(".play-vid-sec").length <= 0){ 
            $(".play-vid-sec .play-vid-box .play-vid-wrap").width(varHt);
        }
        $(".play-vid-sec .play-vid-cont").css("marginTop", vidHt);
        $(".play-vid-sec .play-vid-wrap").toggleClass("horizontal", varHt <= secWd);
    }

    // Function to get video dimensions
    function getVideoDimensions(video) {
        return new Promise(resolve => {
            if (video.readyState > 0) {
                resolve({ width: video.videoWidth, height: video.videoHeight });
            } else {
                video.addEventListener('loadedmetadata', () => {
                    resolve({ width: video.videoWidth, height: video.videoHeight });
                });
            }
        });
    }

    // Initialize video
    const videoWrappers = document.querySelectorAll('.play-vid');
	videoWrappers.forEach(videoWrapper => {
		const video = videoWrapper.querySelector('video');
		if (video) {
			getVideoDimensions(video).then(dimensions => {
				vidRatio = dimensions.width / dimensions.height;
				setVidHt();
			});
		}
	});

    // Event listeners
    $(window).on('resize scroll', setVidHt);
	videoWrappers.forEach(videoWrapper => {
		const video = videoWrapper.querySelector('video');
		if (video) {
			video.addEventListener('loadeddata', setVidHt);
		}
	});

    /*== 영상 전체화면 ==*/
    $(".full-vid-btn").on("click",function(){
        if(!$(".play-vid-sec").hasClass("full")){
            $(".play-vid-sec").addClass("full");
            $('body').addClass('scroll-disable');
            document.body.addEventListener('scroll touchmove mousewheel',function(e){
                e.preventDefault();
            },{passive: false});
            document.documentElement.style.overscrollBehaviorY = 'none';
	        document.documentElement.style.scrollBehavior = 'auto';
        } else {
            $(".play-vid-sec").removeClass("full");
            $('body').removeClass('scroll-disable').off('scroll touchmove mousewheel');
            document.documentElement.style.removeProperty('overscroll-behavior-y');
	        document.documentElement.style.removeProperty('scroll-behavior');
        }
    });

    /*== 좋아요, 북마크 버튼 클릭 - on 클래스 토글 ==*/
    $(".basic-btn.compact").on("click",function(){
        if($(this).hasClass("compact-like-btn") || $(this).hasClass("compact-bookmark-btn")){
            $(this).toggleClass("on");
        }
    });

    /*== related vid (관련영상) swiper ==*/
    let relatedVidSwiper = new Swiper(".related-vid-swiper", {
        keyboard: {
            enabled: true,
        },
        slidesPerView: 2.3,
        spaceBetween: 12,
        simulateTouch: true,
        grabCursor: true
    });
    // focus시 slide 이동 추가
    $(".related-vid-swiper .swiper-slide").focus(function(){
        if(!$(this).hasClass("swiper-slide-active")){
            var focusIdx = $(this).index();
            relatedVidSwiper.slideTo(focusIdx,0,false);
        }
    });
});

/*== 영상 관련 기능 ==*/
document.addEventListener('DOMContentLoaded', function() {
    if($(".play-vid").length <= 0) return;

    let video;
    let video2;
    let isVidDouble = false;
    if($(".vid-solo").length > 0){
        video = document.querySelector('.vid-solo');
    }
    if($(".vid-duet01").length > 0){
        video = document.querySelector('.vid-duet01');
    }
    if($(".vid-duet02").length > 0){
        isVidDouble = true;
        video2 = document.querySelector('.vid-duet02');
    }
    const progress = document.querySelector('.progress');
    const currentTime = document.querySelector('.current-time');
    const totalTime = document.querySelector('.total-time');
    const playVidBox = document.querySelector('.play-vid-box');

    // 총 재생 시간을 페이지 로드 시 설정
    video.addEventListener('loadedmetadata', function() {
        totalTime.textContent = formatTime(video.duration);
    });

    // play-vid-box 클릭시 vid-indicator-wrap 노출
    let indicatorTimer;
    let isIndicatorVisible = false;
    let lastClickTime = 0;

    function indicatorHide() {
        $(".play-vid-sec .play-vid-box").removeClass("show");
        $(".play-vid-sec .vid-indicator-wrap").fadeOut();
        isIndicatorVisible = false;
    }
    function indicatorShow() {
        $(".play-vid-sec .play-vid-box").addClass("show");
        $(".play-vid-sec .vid-indicator-wrap").fadeIn();
        isIndicatorVisible = true;
        
        clearTimeout(indicatorTimer);
        if($(".play-vid-box").hasClass("play")){
            indicatorTimer = setTimeout(indicatorHide, 3000);
        }
    }
    function toggleIndicator(forceShow = false) {
        if (forceShow || !isIndicatorVisible) {
            indicatorShow();
        } else {
            indicatorHide();
        }
    }

    $(document).on("mousedown touchstart", function(e) {
        if ($(e.target).closest('.play-vid-box').length > 0 && 
            $(e.target).closest('.vid-play-btn').length <= 0 && 
            !$(e.target).closest('.progress-bar-wrap').length) {
            const currentTime = new Date().getTime();
            if (currentTime - lastClickTime > 200) {  // 200ms 디바운스
                toggleIndicator();
                lastClickTime = currentTime;
            }
        }
    });

    /*=== 비디오 재생 시 play 클래스 토글 ===*/
    $(document).on("mousedown touchstart", function(e) {
        if ($(e.target).closest('.play-btn').length > 0) {
            const currentTime = new Date().getTime();
            if (currentTime - lastClickTime > 200) {  // 200ms 디바운스
                $(".play-vid-box").addClass("play");
                video.play();
                if(isVidDouble){ video2.play();}
                indicatorShow();
                lastClickTime = currentTime;
            }
        } else if($(e.target).closest('.pause-btn').length > 0){
            const currentTime = new Date().getTime();
            if (currentTime - lastClickTime > 200) {  // 200ms 디바운스
                $(".play-vid-box").removeClass("play");
                video.pause();
                if(isVidDouble){ video2.pause();}
                indicatorShow();
                lastClickTime = currentTime;
            }
        }
    });

    // 진행 바 업데이트 및 시간 표시
    video.addEventListener('timeupdate', function() {
        progress.value = video.currentTime;
        currentTime.textContent = formatTime(video.currentTime);
        totalTime.textContent = formatTime(video.duration);
        var gradient_value = 100 / progress.attributes.max.value;
        progress.style.background = 'linear-gradient(to right, #FF2B2F 0%, #FF2B2F '+ gradient_value * progress.value +'%, #666 ' + gradient_value *  progress.value + '%, #666 100%)';
    });

    // 재생이 끝난 후 처리
    video.addEventListener('ended', function() {
        indicatorShow();
        playVidBox.classList.remove('play');
    });

    // progress-bar
    video.addEventListener('loadedmetadata', () => {
        progress.max = video.duration;
    });
    progress.addEventListener('input', (event) => {
        video.currentTime = progress.value;
        if($(".vid-duet02").length > 0){ video2.currentTime = progress.value;}
        var gradient_value = 100 / event.target.attributes.max.value;
        event.target.style.background = 'linear-gradient(to right, #FF2B2F 0%, #FF2B2F '+ gradient_value * event.target.value +'%, #666 ' + gradient_value *  event.target.value + '%, #666 100%)';
    });

    /*=== progress bar 터치 효과 ===*/
    let progressTouchTimer;
    $(document).on("mousedown mouseover touchstart", function(e) {
        if ($(e.target).closest('.progress-bar-wrap').length > 0) {
            const currentTime = new Date().getTime();
            if (currentTime - lastClickTime > 200) {  // 200ms 디바운스
                clearTimeout(progressTouchTimer);
                $(".progress-bar-wrap").addClass("hover");
                progressTouchTimer = setTimeout(function(){
                    $(".progress-bar-wrap").removeClass("hover");
                }, 3000);
            }
        }
    });

    // 시간을 mm:ss 형식으로 포맷팅하는 함수
    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
});



/* ------------------------------------------------------------------------  
    SING
------------------------------------------------------------------------ */
/*========== Sing 메인 배너 ==========*/
$(function(){
    var singMainSwiper = undefined;

    function initsingMainSwiper(){
        if (singMainSwiper !== undefined) {
            singMainSwiper.destroy(true, true);
        }
        
        singMainSwiper = new Swiper(".sing-main-banner", {
            keyboard: {
                enabled: true,
            },
            slidesPerView: "auto",
            spaceBetween: 12,
            simulateTouch: true,
            grabCursor: true,
            pagination: {
                el: '.main-banner-pgn',
                clickable: true,
            },
            on: {
                init: updatePagination,
                resize: updatePagination
            }
        });

        // focus시 slide 이동 추가
        $(".sing-main-banner .swiper-slide a").off('focus').on('focus', function(){
            var swiperSlide = $(this).closest(".swiper-slide");
            if(!$(swiperSlide).hasClass("swiper-slide-active")){
                var focusIdx = $(swiperSlide).index();
                singMainSwiper.slideTo(focusIdx,0,false);
            }
        });
    }

    function updatePagination() {
        if (this.pagination && typeof this.pagination.render === 'function') {
            this.pagination.render();
            this.pagination.update();
        }
    }
    initsingMainSwiper();

    var resizeTimer;
    $(window).on('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            initsingMainSwiper();
        }, 250);
    });
});

/* ------------------------------------------------------------------------  
    SETTING
------------------------------------------------------------------------ */
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