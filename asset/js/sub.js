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
    if($(".play-vid").length <= 0 || $(".play-vid-sec").length <= 0) return;

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
        if($(".play-vid-sec .play-vid-wrap").hasClass("horizontal")){
			let calcWd;
			if($(".vid-solo").length > 0){
				calcWd = $(".play-vid-sec .play-vid-wrap").height() * vidRatio;
			} else if($(".play-duet-sec").length > 0){ // 1:1비율
				calcWd = $(".play-vid-sec .play-vid-wrap").height();
			}
			$(".play-vid-sec .play-vid-wrap").width(calcWd);
		} else {
			$(".play-vid-sec .play-vid-wrap").css("width","");
		}
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
			if($(".vid-solo").length > 0 && $(".play-vid-sec").width() / vidRatio > $(window).height()){ // 비율 문제가 솔로 영상에서만 해당됨
				$(".play-vid-sec").addClass("full-ht-over");
				$(".play-vid-wrap").width($(window).height() * vidRatio);
			}
			$('body').addClass('scroll-disable');
			document.body.addEventListener('scroll touchmove mousewheel',function(e){
				e.preventDefault();
			},{passive: false});
			document.documentElement.style.overscrollBehaviorY = 'none';
			document.documentElement.style.scrollBehavior = 'auto';
		} else {
			$(".play-vid-sec").removeClass("full");
			if($(".play-vid-sec").hasClass("full-ht-over")){
				$(".play-vid-wrap").css("width","");
				$(".play-vid-sec").removeClass("full-ht-over");
			}
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
    $(".related-vid-swiper .swiper-slide a").focus(function(){
        if(!$(this).parent(".swiper-slide").hasClass("swiper-slide-active")){
            var focusIdx = $(this).parent(".swiper-slide").index();
            relatedVidSwiper.slideTo(focusIdx,0,false);
        }
    });
});

/*== 영상 관련 공통 기능 ==*/
document.addEventListener('DOMContentLoaded', function() {
    if($(".play-vid").length <= 0) return;

    let video = document.querySelector('.play-cont:not(img)');
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
            $(e.target).closest('.vid-play-btn').length <= 0 && $(e.target).closest('.full-vid-btn').length <= 0 && 
            !$(e.target).closest('.progress-bar-wrap').length) {
            const currentTime = new Date().getTime();
            if (currentTime - lastClickTime > 200) {  // 200ms 디바운스
                toggleIndicator();
                lastClickTime = currentTime;
            }
        }
    });

    /*=== 비디오 재생 시 play 클래스 토글 ===*/
	setTimeout(function(){
		video.pause();
	},100);
    $(document).on("click", ".play-btn", function(e) {
		$(".play-vid-box").addClass("play");
		video.play();
		indicatorShow();
	});
	$(document).on("click", ".pause-btn", function(e) {
		e.preventDefault();
		$(".play-vid-box").removeClass("play");
		video.pause();
		indicatorShow();
	});

    // 진행 바 업데이트 및 시간 표시
    video.addEventListener('timeupdate', function() {
        progress.value = video.currentTime;
        currentTime.textContent = formatTime(video.currentTime);
        totalTime.textContent = formatTime(video.duration);
		updateProgressBar(progress);

		if($(".recording-time-list").length > 0){
			// 현재 시간에 가장 가까운 recording-time-list 선택
			const currentSeconds = Math.floor(video.currentTime);
			const closestTime = timePoints.reduce((prev, curr) => 
				Math.abs(curr - currentSeconds) < Math.abs(prev - currentSeconds) ? curr : prev
			);
			const index = timePoints.indexOf(closestTime);
			
			$(".recording-time-list").removeClass("select");
			$(".recording-time-list").eq(index).addClass("select");
		}
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
        var gradient_value = 100 / event.target.attributes.max.value;
		var timeBg = event.target.style.background;
        event.target.style.background = 'linear-gradient(to right, #FF2B2F 0%, #FF2B2F '+ gradient_value * event.target.value +'%, #666 ' + gradient_value *  event.target.value + '%, #666 100%)';
		if($(".recording-cont-box").length > 0) event.target.style.background = 'linear-gradient(to right, #FF2B2F 0%, #FF2B2F '+ gradient_value * event.target.value +'%, #fff ' + gradient_value *  event.target.value + '%, #fff 100%)';
	});

    /*=== progress bar 터치 hover 효과 ===*/
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

	/*=== 부르기 업로드 커버이미지 설정 페이지 ===*/
	if($(".recording-cont-box").length > 0){
		// timePoints를 동적으로 생성
		const generateTimePoints = (start, interval, count) => 
			Array.from({length: count}, (_, i) => start + i * interval);
		
		const timePoints = generateTimePoints(10, 20, 5); // 10초 시작, 20초 간격, 5개 포인트

		$(".recording-time-list").on("click", function() {
			const index = $(this).index();
			const selectedTime = timePoints[index];

			// 비디오 시간 이동
			video.currentTime = selectedTime;

			// progress bar 업데이트
			progress.value = selectedTime;
			updateProgressBar(progress);

			// 현재 시간 표시 업데이트
			currentTime.textContent = formatTime(selectedTime);

			// 선택된 항목 스타일 변경
			$(".recording-time-list").removeClass("select");
			$(this).addClass("select");
		});

		
	}

	// progress bar 업데이트 함수
	function updateProgressBar(progressBar) {
		const gradientValue = 100 / progressBar.max;
		const percentage = gradientValue * progressBar.value;
		progressBar.style.background = `linear-gradient(to right, #FF2B2F 0%, #FF2B2F ${percentage}%, #666 ${percentage}%, #666 100%)`;
		if($(".recording-cont-box").length > 0) progressBar.style.background = `linear-gradient(to right, #FF2B2F 0%, #FF2B2F ${percentage}%, #fff ${percentage}%, #fff 100%)`;
	}

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
	if ($(".sing-main").length > 0) {
        let singMainSwiper = undefined;
		
		function singMainSlider(){
			if (singMainSwiper != undefined){ 
				singMainSwiper.destroy();
				singMainSwiper = undefined;
			}

			singMainSwiper = new Swiper(".sing-main-banner", {
                keyboard: {
                    enabled: true,
                },
                watchOverflow : true,
                allowSlideNext: true,
                slidesPerView: "auto",
                spaceBetween: 12,
                simulateTouch: true,
                grabCursor: true,
                pagination: {
                    el: '.main-banner-pgn',
                    clickable: true,
                },
                speed: 800,
                autoplay: {
					delay: 4000,
					disableOnInteraction: false,
					stopOnLastSlide: false
				},
                a11y: {
                    enabled: true,
                    prevSlideMessage: '이전 슬라이드',
                    nextSlideMessage: '다음 슬라이드',
                    paginationBulletMessage: '{{index}}번째 슬라이드로 이동',
                },
			});

            // focus시 slide 이동 추가
            $(".sing-main-banner .swiper-slide a").off('focus').on('focus', function(){
                var swiperSlide = $(this).closest(".swiper-slide");
                if(!$(swiperSlide).hasClass("swiper-slide-active")){
                    var focusIdx = $(swiperSlide).index();
                    singMainSwiper.slideTo(focusIdx,0,false);
                }
            });
            // 키보드 네비게이션 추가
            $(".sing-main-banner").off('keydown').on('keydown', function(e) {
                if (e.keyCode === 9) { // Tab 키
                    if (!e.shiftKey && $(e.target).closest('.swiper-slide-active').length) {
                        // 마지막 슬라이드에서 Tab 키를 누르면 페이지네이션으로 이동
                        e.preventDefault();
                        $('.main-banner-pgn .swiper-pagination-bullet:first').focus();
                    }
                }
            });

            // 페이지네이션에서 Shift+Tab으로 마지막 슬라이드로 돌아가기
            $('.main-banner-pgn').off('keydown').on('keydown', function(e) {
                if (e.keyCode === 9 && e.shiftKey) { // Shift + Tab
                    if ($(e.target).is('.swiper-pagination-bullet:first')) {
                        e.preventDefault();
                        $('.sing-main-banner .swiper-slide:last a').focus();
                    }
                }
            });
		} singMainSlider();

		/* Intersection Observer 설정 */
		let observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					singMainSwiper.autoplay.start();
				} else {
					singMainSwiper.autoplay.stop();
				}
			});
		}, {
			root: null, 
			rootMargin: '0px',
			threshold: 0.5 
		});
		observer.observe(document.querySelector(".sing-main"));

        var resizeTimer = null;
        $(window).resize(function(){
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resizeNew, 300);
            function resizeNew() {
                singMainSlider();
            }
        });
	}
});

/*========== Sing 최근 부른곡 ==========*/
$(function(){
    if ($(".sing-rising-tab").length > 0) {
        var swipers = {};

        // 초기 실행 및 리사이즈 이벤트에 대한 처리
        initializeTabs();
        $(window).on('resize', initializeTabs);

        // 탭 클릭 이벤트 처리
        $('.tab-song-link').on('click', function() {
            var tabId = $(this).data('tab');
            activateTab(tabId);
        });

        function initializeTabs() {
            $('.tab-song-cont').each(function() {
                var tabId = $(this).attr('id');
                if ($(this).hasClass('current')) {
                    initSwiper(tabId);
                } else {
                    destroySwiper(tabId);
                }
            });
        }

        function activateTab(tabId) {
            $('.tab-song-link').removeClass('current');
            $('.tab-song-cont').removeClass('current');
            
            $('[data-tab="' + tabId + '"]').addClass('current');
            $('#' + tabId).addClass('current');

            initSwiper(tabId);
            
            // 다른 탭의 Swiper 파괴
            $('.tab-song-cont').not('#' + tabId).each(function() {
                destroySwiper($(this).attr('id'));
            });
        }

        function initSwiper(tabId) {
            if (!swipers[tabId] || swipers[tabId].destroyed) {
                var swiperContainer = $('#' + tabId + ' .profile-area.song-list');
                if (swiperContainer.length) {
                    swipers[tabId] = new Swiper(swiperContainer[0], {
                        keyboard: {
                            enabled: true,
                        },
                        watchOverflow: true,
                        allowSlideNext: true,
                        slidesPerView: "auto",
                        simulateTouch: true,
                        grabCursor: true,
                        spaceBetween: 8,
                        a11y: {
                            enabled: true,
                            prevSlideMessage: '이전 슬라이드',
                            nextSlideMessage: '다음 슬라이드',
                            paginationBulletMessage: '{{index}}번째 슬라이드로 이동',
                        },
                    });

                    // focus 시 slide 이동 추가
                    swiperContainer.find('.profile-list a').off('focus').on('focus', function(){
                        var swiperSlide = $(this).closest(".profile-list");
                        if(!swiperSlide.hasClass("swiper-slide-active")){
                            var focusIdx = swiperSlide.index();
                            swipers[tabId].slideTo(focusIdx, 0, false);
                        }
                    });
                }
            }
        }

        function destroySwiper(tabId) {
            if (swipers[tabId] && !swipers[tabId].destroyed) {
                swipers[tabId].destroy(true, true);
                delete swipers[tabId];
            }
        }

        // 초기 활성 탭에 대한 Swiper 초기화
        initializeTabs();
    }
});

/*========== Sing 최신 업데이트 ==========*/
$(function(){
	if ($(".sing-update").length > 0) {
        let singUpdateSwiper = undefined;
		
		function initsingUpdateSwiper(){
			if (singUpdateSwiper != undefined){ 
				singUpdateSwiper.destroy();
				singUpdateSwiper = undefined;
			}

			singUpdateSwiper = new Swiper(".sing-update .song-update-swiper", {
                keyboard: {
					enabled: true,
				},
				watchOverflow: true,
				allowSlideNext: true,
				slidesPerView: 1, 
				centeredSlides: false, 
				slideToClickedSlide: true, 
				spaceBetween: 24,
				simulateTouch: true, 
				grabCursor: true, 
				pagination: {
					el: '#song-update-pgn',
					clickable: true,
				},
				speed: 800,
				autoplay: {
					delay: 4000,
					disableOnInteraction: false,
					stopOnLastSlide: false
				},
				a11y: {
					enabled: true,
					prevSlideMessage: '이전 슬라이드',
					nextSlideMessage: '다음 슬라이드',
					paginationBulletMessage: '{{index}}번째 슬라이드로 이동',
				},
			});

            // focus시 slide 이동 추가
            $(".song-update-swiper .swiper-slide a").off('focus').on('focus', function(){
                var swiperSlide = $(this).closest(".swiper-slide");
                if(!$(swiperSlide).hasClass("swiper-slide-active")){
                    var focusIdx = $(swiperSlide).index();
                    singUpdateSwiper.slideTo(focusIdx,0,false);
                }
            });
            // 키보드 네비게이션 추가
            $(".song-update-swiper").off('keydown').on('keydown', function(e) {
                if (e.keyCode === 9) { // Tab 키
                    if (!e.shiftKey && $(e.target).closest('.swiper-slide-active').length) {
                        // 마지막 슬라이드에서 Tab 키를 누르면 페이지네이션으로 이동
                        e.preventDefault();
                        $('.song-update-pgn .swiper-pagination-bullet:first').focus();
                    }
                }
            });

            // 페이지네이션에서 Shift+Tab으로 마지막 슬라이드로 돌아가기
            $('.song-update-pgn').off('keydown').on('keydown', function(e) {
                if (e.keyCode === 9 && e.shiftKey) { // Shift + Tab
                    if ($(e.target).is('.swiper-pagination-bullet:first')) {
                        e.preventDefault();
                        $('.song-update-swiper .swiper-slide:last a').focus();
                    }
                }
            });
		} initsingUpdateSwiper();

		/* Intersection Observer 설정 */
		let observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					singUpdateSwiper.autoplay.start();
				} else {
					singUpdateSwiper.autoplay.stop();
				}
			});
		}, {
			root: null, 
			rootMargin: '0px',
			threshold: 0.5 
		});
		observer.observe(document.querySelector(".sing-update"));

        var resizeTimerUpdate = null;
        $(window).resize(function(){
            clearTimeout(resizeTimerUpdate);
            resizeTimerUpdate = setTimeout(resizeNewUpdate, 300);
            function resizeNewUpdate() {
                initsingUpdateSwiper();
            }
        });
	}
});

/*========== Sing Recording 부르기 업로드 커버이미지 설정 ==========*/
$(function(){
	if($(".recording-cont-box").length <= 0) return;
	let relatedVidSwiper = new Swiper(".recording-time-swiper", {
        keyboard: {
            enabled: true,
        },
        slidesPerView: 4.3,
        spaceBetween: 12,
        simulateTouch: true,
        grabCursor: true,
		breakpoints: {
          421: {
			slidesPerView: 3.5,
            spaceBetween: 8,
          }
        },
    });
});


let cropperContainer;
let cropperImage;
let cropperFrame;
let isCropDragging = false;
let cropStartX, cropStartY, cropInitialX, cropInitialY;

document.addEventListener('DOMContentLoaded', function() {
	if($(".cropper-image").length > 0) {
		cropperContainer = document.querySelector('.cropper-container');
		cropperImage = document.querySelector('.cropper-image');
		cropperFrame = document.querySelector('.cropper-frame');

		// 듀엣 업로드 높이에 맞게 frame 재조정
		if($(".recording-cover-crop-sec.duet").length > 0){
			if($(window).height() - 55 - 40 < $(".recording-cover-crop-sec.duet").width() / 347 * 616.89){
				$(".cropper-frame").height($(window).height() - 55 - 40);
				$(".cropper-frame").width(($(window).height() - 55 - 40) / 616.89 * 347);
				$(".cropper-frame").css({
					"bottom":"30px",
					"top":"auto",
					"transform":"translate(-50%, 0)"
				})
			}
		}

		cropperImage.addEventListener('mousedown', onDragStart);
		cropperImage.addEventListener('touchstart', onDragStart);
		document.addEventListener('mousemove', onDragMove);
		document.addEventListener('touchmove', onDragMove, { passive: false });
		document.addEventListener('mouseup', onDragEnd);
		document.addEventListener('touchend', onDragEnd);
		document.addEventListener('keydown', onKeyDown);

		// Center the image initially
		cropperImage.onload = () => {
			const frameRect = cropperFrame.getBoundingClientRect();
			const imageRect = cropperImage.getBoundingClientRect();
			
			cropInitialX = (frameRect.width - imageRect.width) / 2;
			cropInitialY = (frameRect.height - imageRect.height) / 2;
			
			updateImagePosition(cropInitialX, cropInitialY);
		};

		if (cropperImage.complete) {
			cropperImage.onload();
		}
	}
});

function onDragStart(e) {
	isCropDragging = true;
	if (e.type === 'mousedown') {
		cropStartX = e.clientX - cropInitialX;
		cropStartY = e.clientY - cropInitialY;
	} else if (e.type === 'touchstart') {
		cropStartX = e.touches[0].clientX - cropInitialX;
		cropStartY = e.touches[0].clientY - cropInitialY;
	}
}

function onDragEnd() {
	isCropDragging = false;
}

function onDragMove(e) {
	if (!isCropDragging) return;
	e.preventDefault();
	let clientX, clientY;
	if (e.type === 'mousemove') {
		clientX = e.clientX;
		clientY = e.clientY;
	} else if (e.type === 'touchmove') {
		clientX = e.touches[0].clientX;
		clientY = e.touches[0].clientY;
	}
	const x = clientX - cropStartX;
	const y = clientY - cropStartY;
	updateImagePosition(x, y);
}

function updateImagePosition(x, y) {
	const frameRect = cropperFrame.getBoundingClientRect();
	const imageRect = cropperImage.getBoundingClientRect();

	// Calculate bounds
	const minX = frameRect.width - imageRect.width;
	const minY = frameRect.height - imageRect.height;
	const maxX = 0;
	const maxY = 0;

	// Constrain movement within bounds
	x = Math.min(Math.max(x, minX), maxX);
	y = Math.min(Math.max(y, minY), maxY);

	// Adjust for the frame's position relative to the container
	const frameOffsetX = frameRect.left - cropperContainer.getBoundingClientRect().left;
	const frameOffsetY = frameRect.top - cropperContainer.getBoundingClientRect().top;

	cropInitialX = x;
	cropInitialY = y;
	cropperImage.style.transform = `translate(${x + frameOffsetX}px, ${y + frameOffsetY}px)`;
}

function onKeyDown(e) {
	const step = 10;
	let x = cropInitialX;
	let y = cropInitialY;

	switch(e.key) {
		case 'ArrowUp': y += step; break;
		case 'ArrowDown': y -= step; break;
		case 'ArrowLeft': x += step; break;
		case 'ArrowRight': x -= step; break;
		default: return;
	}

	updateImagePosition(x, y);
}
	

/* ------------------------------------------------------------------------  
    BATTLE
------------------------------------------------------------------------ */
/*========== Battle 공통 옥타곤 Level Card : Scroll ==========*/
$(document).ready(function() {
    if ($(".scroll-flip").length > 0) {
        const $flipCardScroll = $('.scroll-flip .octagon-card');
        function checkPosition() {
            const elementTop = $flipCardScroll.offset().top; 
            const scrollTop = $(window).scrollTop(); 
            const triggerPosition = scrollTop + 240;

            if (elementTop <= triggerPosition) {
                $flipCardScroll.addClass('flipped');
                $(window).off('scroll', checkPosition);
            }
        }
        $(window).on('scroll', checkPosition);
        checkPosition();
    }
});
/*========== Battle 공통 옥타곤 Level Card : 진입시 ==========*/
$(document).ready(function() {
    if ($(".dom-flip").length > 0) {
        const $flipCard = $('.dom-flip .octagon-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        $flipCard.addClass('flipped');
                        observer.unobserve(entry.target);
                    }, 1100);
                }
            });
        }, { threshold: 1.0 });
        
        observer.observe($flipCard[0]);
    }
});

/*========== Battle 메인 배너 ==========*/
$(function(){
	if ($(".battle-main").length > 0) {
		let battleMainSwiper = undefined;
		
		function battleMainSlider(){
            if ($(".battle-main-banner").length > 0) {
                if (battleMainSwiper != undefined){ 
                    battleMainSwiper.destroy();
                    battleMainSwiper = undefined;
                }

                battleMainSwiper = new Swiper(".battle-main-banner", {
                    keyboard: {
                        enabled: true,
                    },
                    watchOverflow : true,
                    allowSlideNext: true,
                    slidesPerView: "auto",
                    spaceBetween: 12,
                    simulateTouch: true,
                    grabCursor: true,
                    pagination: {
                        el: '.main-banner-pgn',
                        clickable: true,
                    },
                    speed: 800,
                    autoplay: {
                        delay: 4000,
                        disableOnInteraction: false,
                        stopOnLastSlide: false
                    },
                    a11y: {
                        enabled: true,
                        prevSlideMessage: '이전 슬라이드',
                        nextSlideMessage: '다음 슬라이드',
                        paginationBulletMessage: '{{index}}번째 슬라이드로 이동',
                    },
                });

                // focus시 slide 이동 추가
                $(".battle-main-banner .swiper-slide a").off('focus').on('focus', function(){
                    var swiperSlide = $(this).closest(".swiper-slide");
                    if(!$(swiperSlide).hasClass("swiper-slide-active")){
                        var focusIdx = $(swiperSlide).index();
                        battleMainSwiper.slideTo(focusIdx,0,false);
                    }
                });
                // 키보드 네비게이션 추가
                $(".battle-main-banner").off('keydown').on('keydown', function(e) {
                    if (e.keyCode === 9) { // Tab 키
                        if (!e.shiftKey && $(e.target).closest('.swiper-slide-active').length) {
                            // 마지막 슬라이드에서 Tab 키를 누르면 페이지네이션으로 이동
                            e.preventDefault();
                            $('.main-banner-pgn .swiper-pagination-bullet:first').focus();
                        }
                    }
                });

                // 페이지네이션에서 Shift+Tab으로 마지막 슬라이드로 돌아가기
                $('.main-banner-pgn').off('keydown').on('keydown', function(e) {
                    if (e.keyCode === 9 && e.shiftKey) { // Shift + Tab
                        if ($(e.target).is('.swiper-pagination-bullet:first')) {
                            e.preventDefault();
                            $('.battle-main-banner .swiper-slide:last a').focus();
                        }
                    }
                });
            }
		}  battleMainSlider();

        /* Intersection Observer 설정 */
		let observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					battleMainSwiper.autoplay.start();
				} else {
					battleMainSwiper.autoplay.stop();
				}
			});
		}, {
			root: null, 
			rootMargin: '0px',
			threshold: 0.5 
		});
		observer.observe(document.querySelector(".battle-main"));

        var resizeTimer = null;
        $(window).resize(function(){
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resizeNew, 300);
            function resizeNew() {
                battleMainSlider();
            }
        });
	}
});

/*========== Battle 메인 왕좌의 게임 ==========*/
$(function(){
	if ($(".battle-sec .battle-game").length > 0) {
        let battleMainGameSwiper = undefined;
		
		function battleMainGameSlider(){
			if (battleMainGameSwiper != undefined){ 
				battleMainGameSwiper.destroy();
				battleMainGameSwiper = undefined;
			}

			battleMainGameSwiper = new Swiper(".battle-game .battle-game-slide", {
                keyboard: {
                    enabled: true,
                },
                watchOverflow: true,
                allowSlideNext: true,
                slidesPerView: "auto",
                simulateTouch: true,
                grabCursor: true,
                spaceBetween: 12,
                a11y: {
                    enabled: true,
                    prevSlideMessage: '이전 슬라이드',
                    nextSlideMessage: '다음 슬라이드',
                    paginationBulletMessage: '{{index}}번째 슬라이드로 이동',
                },
			});

            // focus시 slide 이동 추가
            $(".battle-game-slide .swiper-slide a").off('focus').on('focus', function(){
                var swiperSlide = $(this).closest(".swiper-slide");
                if(!$(swiperSlide).hasClass("swiper-slide-active")){
                    var focusIdx = $(swiperSlide).index();
                    battleMainGameSwiper.slideTo(focusIdx,0,false);
                }
            });
		} battleMainGameSlider();

        var resizeTimerUpdate = null;
        $(window).resize(function(){
            clearTimeout(resizeTimerUpdate);
            resizeTimerUpdate = setTimeout(resizeNewUpdate, 300);
            function resizeNewUpdate() {
                battleMainGameSlider();
            }
        });
	}
});

/*========== Battle 2배 챌린지 인기곡 ==========*/
$(function(){
	if ($(".battle-sec .battle-challenge").length > 0) {
        let battleMainChallengeSwiper = undefined;
		
		function battleMainChallengeSlider(){
			if (battleMainChallengeSwiper != undefined){ 
				battleMainChallengeSwiper.destroy();
				battleMainChallengeSwiper = undefined;
			}

			battleMainChallengeSwiper = new Swiper(".battle-challenge .battle-challenge-slide", {
                keyboard: {
                    enabled: true,
                },
                watchOverflow: true,
                allowSlideNext: true,
                slidesPerView: "auto",
                simulateTouch: true,
                grabCursor: true,
                spaceBetween: 8,
                a11y: {
                    enabled: true,
                    prevSlideMessage: '이전 슬라이드',
                    nextSlideMessage: '다음 슬라이드',
                    paginationBulletMessage: '{{index}}번째 슬라이드로 이동',
                },
			});

            // focus시 slide 이동 추가
            $(".battle-challenge-slide .swiper-slide a").off('focus').on('focus', function(){
                var swiperSlide = $(this).closest(".swiper-slide");
                if(!$(swiperSlide).hasClass("swiper-slide-active")){
                    var focusIdx = $(swiperSlide).index();
                    battleMainChallengeSwiper.slideTo(focusIdx,0,false);
                }
            });
		} battleMainChallengeSlider();

        var resizeTimerUpdate = null;
        $(window).resize(function(){
            clearTimeout(resizeTimerUpdate);
            resizeTimerUpdate = setTimeout(resizeNewUpdate, 300);
            function resizeNewUpdate() {
                battleMainChallengeSlider();
            }
        });
	}
});

/*========== Battle 옥타브 레벨업 ==========*/
$(function(){
	if ($(".battle-level").length > 0) {
        let battleMainLevel = undefined;
		
		function battleMainLevelSwiper(){
			if (battleMainLevel != undefined){ 
				battleMainLevel.destroy();
				battleMainLevel = undefined;
			}

			battleMainLevel = new Swiper(".battle-level .battle-level-slide", {
                keyboard: {
					enabled: true,
				},
				watchOverflow: true,
				allowSlideNext: true,
				slidesPerView: 1, 
				centeredSlides: false, 
				slideToClickedSlide: true, 
				spaceBetween: 24,
				simulateTouch: true, 
				grabCursor: true, 
				pagination: {
					el: '#battle-level-pgn',
					clickable: true,
				},
				speed: 800,
				autoplay: {
					delay: 4000,
					disableOnInteraction: false,
					stopOnLastSlide: false
				},
				a11y: {
					enabled: true,
					prevSlideMessage: '이전 슬라이드',
					nextSlideMessage: '다음 슬라이드',
					paginationBulletMessage: '{{index}}번째 슬라이드로 이동',
				},
			});

            // focus시 slide 이동 추가
            $(".battle-level-slide .swiper-slide a").off('focus').on('focus', function(){
                var swiperSlide = $(this).closest(".swiper-slide");
                if(!$(swiperSlide).hasClass("swiper-slide-active")){
                    var focusIdx = $(swiperSlide).index();
                    battleMainLevel.slideTo(focusIdx,0,false);
                }
            });
            // 키보드 네비게이션 추가
            $(".battle-level-slide").off('keydown').on('keydown', function(e) {
                if (e.keyCode === 9) { // Tab 키
                    if (!e.shiftKey && $(e.target).closest('.swiper-slide-active').length) {
                        // 마지막 슬라이드에서 Tab 키를 누르면 페이지네이션으로 이동
                        e.preventDefault();
                        $('.battle-level-pgn .swiper-pagination-bullet:first').focus();
                    }
                }
            });

            // 페이지네이션에서 Shift+Tab으로 마지막 슬라이드로 돌아가기
            $('.battle-level-pgn').off('keydown').on('keydown', function(e) {
                if (e.keyCode === 9 && e.shiftKey) { // Shift + Tab
                    if ($(e.target).is('.swiper-pagination-bullet:first')) {
                        e.preventDefault();
                        $('.battle-level-slide .swiper-slide:last a').focus();
                    }
                }
            });
		} battleMainLevelSwiper();

		/* Intersection Observer 설정 */
		let observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					battleMainLevel.autoplay.start();
				} else {
					battleMainLevel.autoplay.stop();
				}
			});
		}, {
			root: null, 
			rootMargin: '0px',
			threshold: 0.5 
		});
		observer.observe(document.querySelector(".battle-level"));

        var resizeTimerUpdate = null;
        $(window).resize(function(){
            clearTimeout(resizeTimerUpdate);
            resizeTimerUpdate = setTimeout(resizeNewUpdate, 300);
            function resizeNewUpdate() {
                battleMainLevelSwiper();
            }
        });
	}
});

/*========== Battle 왕좌의 게임 section-header 고정 ==========*/
$(function() {
    function checkHeight() {
        var sectionHeaderHeight = $(".section-header").innerHeight();
        var sectionContentHeight =  $(".section-content").innerHeight();
        var contAreaHeight =  $(".cont-area-wrap").innerHeight();

        // 헤더 고정 기준 높이 계산
        var fixedHeader = sectionContentHeight > window.innerHeight * 0.835 || contAreaHeight > window.innerHeight * 0.881;
        
        if(fixedHeader) {
            $(".section-header").addClass("fixed");
            $(".battle-game-list-sec .section-content").css("margin-top", sectionHeaderHeight);
            $(".battle-game-score-popup .cont-area-wrap").css("margin-top", sectionHeaderHeight);
        } else {
            $(".section-header").removeClass("fixed");
            $(".battle-game-list-sec .section-content").css("margin-top", 0);
            $(".battle-game-score-popup .cont-area-wrap").css("margin-top", 0);
        }
    }
    checkHeight();

    $(window).resize(function() {
        checkHeight();
    });
});

/*========== Battle 2배 챌린지 Progress Bar ==========*/
$(document).ready(function () {
    if ($(".process-container.challenge").length > 0) {
        const $container = $('.process-container.challenge');
        const $currentScoreBar = $('#challenge-bar');
        const $nextGoalBar = $('#next-goal-bar');
        const $targetLine = $('.process-container.challenge .target-line');
        const $targetTooltip = $('.target-tooltip p');

        const currentScore = parseFloat($currentScoreBar.data('current'));
        const nextScore = parseFloat($currentScoreBar.data('next'));
        const targetScore = parseFloat($targetLine.data('target'));
        const totalWidth = 100;

        const currentWidth = (currentScore / totalWidth) * 100;
        const nextWidth = (nextScore / totalWidth) * 100;
        const targetPosition = (targetScore / totalWidth) * 100;

        $targetLine.css('left', targetPosition + '%');

        const isTargetAchieved = currentScore >= targetScore;

        if (isTargetAchieved) {
            $container.addClass('pass');
            $targetTooltip.text('목표 점수 달성 !');
        } else {
            $container.addClass('false');
            $targetTooltip.text('목표 달성 실패 !');
        }

        $currentScoreBar.css('width', '0%');
        let currentAnimationWidth = 0;
        const step = currentWidth / 100;

        function animateCurrentScore() {
            if (currentAnimationWidth < currentWidth) {
                currentAnimationWidth += step;
                $currentScoreBar.css('width', currentAnimationWidth + '%');

                if (currentAnimationWidth >= targetPosition) {
                    $targetLine.addClass('on');
                }

                requestAnimationFrame(animateCurrentScore);
            } else {
                $currentScoreBar.css('width', currentWidth + '%');
                $targetLine.addClass('on');
                if (isTargetAchieved) {
                    setTimeout(animateNextGoal, 500);
                }
            }
        }

        function animateNextGoal() {
            $nextGoalBar.css({
                'width': '0%',
                'left': currentWidth + '%'
            });
            let nextAnimationWidth = 0;
            const nextStep = (nextWidth - currentWidth) / 100;

            function animateNextSegment() {
                if (nextAnimationWidth < (nextWidth - currentWidth)) {
                    nextAnimationWidth += nextStep;
                    $nextGoalBar.css('width', nextAnimationWidth + '%');
                    requestAnimationFrame(animateNextSegment);
                } else {
                    $nextGoalBar.css('width', (nextWidth - currentWidth) + '%');
                    $nextGoalBar.addClass('on');
                    $container.addClass('on');
                }
            }
            animateNextSegment();
        }
        animateCurrentScore();
    }
});

/*========== Battle 옥타브 레벨 곡 Progress Bar ==========*/
$(document).ready(function() {
    if ($(".process-container.default").length > 0) {
        const $defaultBars = $('.process-container.default');
        let activatedBars = 0;

        function checkBarPosition() {
            const scrollTop = $(window).scrollTop();
            const triggerPosition = scrollTop + 350;

            $defaultBars.each(function() {
                const $bar = $(this);
                if (!$bar.hasClass('on')) {
                    const barTop = $bar.offset().top;

                    if (barTop <= triggerPosition) {
                        if ($bar.hasClass('active')) {
                            $bar.addClass('on');
                            activatedBars++;
                        }
                    }
                }
            });

            if (activatedBars === $defaultBars.length) {
                $(window).off('scroll', checkBarPosition);
            }
        }
        $(window).on('scroll', checkBarPosition);
        checkBarPosition(); 
    }
});

/* ------------------------------------------------------------------------  
    SETTING
------------------------------------------------------------------------ */
/*========== faq, 서비스 이용 약관 공통 toggle ==========*/
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

/*========== 고객센터 ==========*/
$(function() {
    /* Bottom Sheet */
    $(".faq-sec .select-btn").click(function() {
        var tabIndex = $(this).closest(".tab-container").find(".tab-link.current").attr("data-tab");
        if(tabIndex === "tab-1") {
            openBottomSheet('#selectedFaq');
        } else {
            openBottomSheet('#selectedInquiry');
        }
    });

    if($(".faq-sec").length > 0) {
        $(".tab-link a").click(function() {
            var defaultTxt = "노래 부르기";

            $(".selected-txt").text(defaultTxt);

            $(".sheet-check-list li a").removeClass("active");
            $(".sheet-check-list li a").filter(function() {
                return $(this).text() === defaultTxt;
            }).addClass("active")
        });
    }
});

/*========== 알림 센터 ==========*/
$(function() {
    // alarm-header 고정
    function fixedAlarmHeader() {
        var tabMenuHeight = $(".tab-btn-menu").innerHeight();
        $(".alarm-header").css("top", tabMenuHeight);
    }
    fixedAlarmHeader();
    
    $(window).resize(function() {
        fixedAlarmHeader();
    });

    // 체크박스 숨김/노출 처리
    function showCheckbox() {
        $(".alarm-header, .alarm-item").addClass("on");
        $(".alarm-check-btn").text("취소");
    }

    function hideCheckbox() {
        $(".alarm-header, .alarm-item").removeClass("on");
        $(".alarm-check-btn").text("선택");
        $("#alarm-check-box-all, .alarm-check-box").prop("checked", false);
    }

    // 선택/취소 버튼
    $(".alarm-check-btn").click(function() {
        if($(".alarm-item").hasClass("on")) {
            hideCheckbox();
        } else {
            showCheckbox();
        } 
    });

    // 삭제 버튼
    $(".alarm-delete-btn").click(function() {
        if($(".alarm-check-box:checked").length > 0) {
            modalPopup("#deleteAlarm");
        } else {
            modalPopup("#noCheckedAlarm");
        }
    });

    $(".delete-alarm-check").click(function() {
        hideCheckbox();
    });

    // 읽음 버튼
    $(".alarm-read-btn").click(function() {
        var chckedBox = $(".alarm-check-box:checked");
        if(chckedBox.length > 0) {
            chckedBox.each(function() {
                var index = $(this).closest(".alarm-item").data("index");
                $(`.alarm-item[data-index=${index}]`).addClass("already-read");
            });
        } else {
            modalPopup("#noCheckedAlarm");
        }
    });

    // 체크박스 전체 선택
    $("#alarm-check-box-all").click(function() {
        var isCheck = $(this).prop("checked");
        $(".tab-btn-cont.current .alarm-check-box").prop("checked", isCheck);
    });

    $(".alarm-check-box").change(function() {
        var allCheck = $(".tab-btn-cont.current .alarm-check-box").length === $(".tab-btn-cont.current .alarm-check-box:checked").length;
        $("#alarm-check-box-all").prop("checked", allCheck);
    });

    // 탭 이동 시 초기화
    if($("#m-alarm-popup").length > 0) {
        $(".tab-btn-link a").click(function() {
            hideCheckbox();
        });
    }

    // 체크박스 노출 상태에서 링크 이동 막기
    $(".alarm-link").click(function(e) {
        if($(".alarm-item").hasClass("on")) {
            e.preventDefault();
        }
    });
});


/* ------------------------------------------------------------------------  
    MYPAGE
------------------------------------------------------------------------ */
/*========== Mypage Home 내 영상 ==========*/
$(function(){
	if ($(".mypage-sec .myhome-video").length > 0) {
        let myhomeVideoSwiper = undefined;
		
		function myhomeVideoSlider(){
			if (myhomeVideoSwiper != undefined){ 
				myhomeVideoSwiper.destroy();
				myhomeVideoSwiper = undefined;
			}

			myhomeVideoSwiper = new Swiper(".myhome-video .myhome-video-slide", {
                keyboard: {
                    enabled: true,
                },
                watchOverflow: true,
                allowSlideNext: true,
                slidesPerView: "auto",
                simulateTouch: true,
                grabCursor: true,
                spaceBetween: 12,
                a11y: {
                    enabled: true,
                    prevSlideMessage: '이전 슬라이드',
                    nextSlideMessage: '다음 슬라이드',
                    paginationBulletMessage: '{{index}}번째 슬라이드로 이동',
                },
			});

            // focus시 slide 이동 추가
            $(".myhome-video-slide .swiper-slide a").off('focus').on('focus', function(){
                var swiperSlide = $(this).closest(".swiper-slide");
                if(!$(swiperSlide).hasClass("swiper-slide-active")){
                    var focusIdx = $(swiperSlide).index();
                    myhomeVideoSwiper.slideTo(focusIdx,0,false);
                }
            });
		} myhomeVideoSlider();

        var resizeTimerUpdate = null;
        $(window).resize(function(){
            clearTimeout(resizeTimerUpdate);
            resizeTimerUpdate = setTimeout(resizeNewUpdate, 300);
            function resizeNewUpdate() {
                myhomeVideoSlider();
            }
        });
	}
});

/*========== Mypage Home 북마크 ==========*/
$(function(){
	if ($(".mypage-sec .myhome-bookmark").length > 0) {
        let myhomeBookmarkSwiper = undefined;
		
		function myhomeBookmarkSlider(){
			if (myhomeBookmarkSwiper != undefined){ 
				myhomeBookmarkSwiper.destroy();
				myhomeBookmarkSwiper = undefined;
			}

			myhomeBookmarkSwiper = new Swiper(".myhome-bookmark .myhome-bookmark-slide", {
                keyboard: {
                    enabled: true,
                },
                watchOverflow: true,
                allowSlideNext: true,
                slidesPerView: "auto",
                simulateTouch: true,
                grabCursor: true,
                spaceBetween: 12,
                a11y: {
                    enabled: true,
                    prevSlideMessage: '이전 슬라이드',
                    nextSlideMessage: '다음 슬라이드',
                    paginationBulletMessage: '{{index}}번째 슬라이드로 이동',
                },
			});

            // focus시 slide 이동 추가
            $(".myhome-bookmark-slide .swiper-slide a").off('focus').on('focus', function(){
                var swiperSlide = $(this).closest(".swiper-slide");
                if(!$(swiperSlide).hasClass("swiper-slide-active")){
                    var focusIdx = $(swiperSlide).index();
                    myhomeBookmarkSwiper.slideTo(focusIdx,0,false);
                }
            });
		} myhomeBookmarkSlider();

        var resizeTimerUpdate = null;
        $(window).resize(function(){
            clearTimeout(resizeTimerUpdate);
            resizeTimerUpdate = setTimeout(resizeNewUpdate, 300);
            function resizeNewUpdate() {
                myhomeBookmarkSlider();
            }
        });
	}
});