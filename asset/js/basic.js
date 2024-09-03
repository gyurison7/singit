/* Info
 ========================================================================== */
/**
 * 1. Writer: Ajin Lee. Sunhyeong Kim, Gyuri Son. (Weaverloft Corp.)
 * 2. Production Date: 2024-07-30
 * 3. Client: MEDIASCOPE Inc.
 */

/*========== vh ==========*/
$(function () {
	var vh = window.innerHeight * 0.01
	document.documentElement.style.setProperty('--vh', '${vh}px')
	window.addEventListener('resize', () => {
		var vh = window.innerHeight * 0.01
		document.documentElement.style.setProperty('--vh', '${vh}px')
	});
});

/*========== Skeleton ==========*/
$(function () {
	if ($(".skeleton").length > 0) {
		const skeletonItem = document.querySelectorAll('.skeleton');

		const hideSkeleton = () => {
			skeletonItem.forEach(element => {
				element.classList.remove('skeleton');
			});
		};

		window.onload = setTimeout(hideSkeleton, 500);
	}
});

/*========== Tab Menu ==========*/
$(function(){
	if ($(".tab-container").length > 0) {
		$('ul.tab-menu li.tab-link a').click(function (e) {
			e.preventDefault();
			var tab_id = $(this).parent('li').attr('data-tab');
			$(this).parent('li').siblings('li').removeClass('current');
			$(this).parent('li').addClass('current');
			$("#" + tab_id).addClass('current').siblings().removeClass('current');
		});
		
		$(".tab-menu:not(.tab-menu02) li.tab-link a").click(function () {
			var ul = $(this).closest(".tab-menu:not(.tab-menu02)");
			var idx = $(this).parent().index() - 1;
			var position = $(ul).find("li.tab-link:first").position();
			var totalWidth = 0;
			for(var li = 0; li < $(ul).children("li.tab-link").length; li++){
				if(li == idx){
					var idxWidth = totalWidth;
				}
				totalWidth += $(ul).children("li.tab-link").eq(li).width();
			}
			if(totalWidth > $(window).width()){
				var posLeft = 0;
			} else {
				var posLeft = position.left;
			}
			$(".tab-menu:not(.tab-menu02) li.slider").animate({
				"left": posLeft + idxWidth,
			},200);
		});
		/* 첫 세팅 */
		var actPosition = $(".tab-menu:not(.tab-menu02) .current").position();
		$(".tab-menu:not(.tab-menu02) li.slider").css({
			"left": actPosition.left,
			"opacity": 1
		});
		var resizeTimer;
		$(window).resize(function(){
			clearTimeout(resizeTimer);
			$(".tab-menu:not(.tab-menu02) li.slider").css("opacity", 0); // 리사이즈가 시작될 때 opacity를 0으로 설정

			resizeTimer = setTimeout(function(){
				var actPosition = $(".tab-menu:not(.tab-menu02) li.tab-link:first").position();
				var actIdx = $(".tab-menu:not(.tab-menu02) li.current").index() - 1;
				var actTotalWidth = 0;
				for(var a = 0; a < $(".tab-menu:not(.tab-menu02) li.tab-link").length; a++){
					if(a == actIdx){
						var actIdxWidth = actTotalWidth;
					}
					actTotalWidth += $(".tab-menu:not(.tab-menu02) li.tab-link").eq(a).width();
				}
				if(actTotalWidth > $(window).width()){
					var actPosLeft = 0;
				} else {
					var actPosLeft = actPosition.left;
				}
				$(".tab-menu:not(.tab-menu02) li.slider").css({
					"left": actPosLeft + actIdxWidth,
					"opacity": 1 // 리사이즈가 멈춘 후에 opacity를 1로 변경
				});
			}, 250); // 250 밀리초 후에 실행되도록 타이머 설정
		});
	};
});

/*========== Tab Btn Menu ==========*/
$(function(){
	if ($(".tab-btn-container").length > 0) {
		$('ul.tab-btn-menu li.tab-btn-link a').click(function (e) {
			e.preventDefault();
			var tabBtn = $(this).parent('li').attr('data-tab');
			$(this).parent('li').siblings('li').removeClass('current');
			$(this).parent('li').addClass('current');
			$("#" + tabBtn).addClass('current').siblings().removeClass('current');
		});
	};
});

/*========== Song Type Tab ==========*/
$(function(){
	if ($(".tab-song-container").length > 0) {
		$('ul.tab-song-menu li.tab-song-link a').click(function (e) {
			e.preventDefault();
			var tabSong = $(this).parent('li').attr('data-tab');
			$(this).parent('li').siblings('li').removeClass('current');
			$(this).parent('li').addClass('current');
			$("#" + tabSong).addClass('current').siblings().removeClass('current');
		});
	};
});

/*========== Input number + comma ==========*/
$(document).on('keyup', 'input[name=number]', function (event) {
	if (event.keyCode === 65 || event.keyCode === 17) return; //Ctrl + A 시 전체선택 안됨 이슈 해결
	if (this.value == '0') return;
	let cursorIndex = this.selectionStart;
	const before = this.value.substring(0, cursorIndex).match(/,/g)?.length;
	// this.value = this.value.replace(/[^0-9]/g, ''); // 입력값이 숫자가 아니면 공백
	this.value = this.value.replace(/[^-0-9]/g, ''); // 입력값이 숫자가 아니면 공백 (.제외)
	this.value = (this.value.indexOf("-") === 0 ? "-" : "") + this.value.replace(/[-]/gi, ''); //-가 있다면 replace
	this.value = this.value.replace(/(^0+)/g, ''); // 맨 앞이 0이면 공백
	this.value = this.value.replace(/,/g, ''); // ,값 공백처리
	this.value = this.value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 정규식을 이용해서 3자리 마다 , 추가
	const after = this.value.substring(0, cursorIndex).match(/,/g)?.length;
	if (before != after) cursorIndex++; // ',' 추가시 커서 위치 조정
	this.setSelectionRange(cursorIndex, cursorIndex);
});

/*========== 일반 num comma ==========*/
$(function(){
	if($('.num').length > 0){
		$('.num').each(function(index,el){
			var num = $(el).text();
			var numCom = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			$('.num').eq(index).text(numCom);
		});
	}
});

/*========== Input Style ==========*/
$(function () {
	// border animation
	$(".input-box input").focusin(function () {
		$(this).next('.line-focus').addClass('on');
	});
	$(".input-box input").focusout(function () {
		$(this).next('.line-focus').removeClass('on');
	});
	// Label
	$(".label-box .label-input").focusin(function () {
		$(this).parent('.label-box').children('.input-label').addClass('on');
	});
	$(".label-box .label-input").focusout(function () {
		if ($(this).val() === '') {
			$(this).parent('.label-box').children('.input-label').removeClass('on');
		} else {
			$(this).parent('.label-box').children('.input-label').addClass('on');
		}
	});

	// input password eye-btn
	$(".input-box.password .eye-btn").click(function() {
		$(this).toggleClass("open");
		var input = $($(this).parent().find('input'));
		if (input.attr("type") == "password") {
			input.attr("type", "text");
		} else {
			input.attr("type", "password");
		}
	});
	// input password animation
	$(".input-box.password").focusin(function () {
		$(this).find('span').addClass('on');
	});
	$(".input-box.password").focusout(function () {
		$(this).find('span').removeClass('on');
	});
	// signup input check
	$(".signup-wrap .input-box").focusin(function () {
		$(this).next('.check-text-wrap').addClass('on');
	});
	$(".signup-wrap .input-box").focusout(function () {
		$(this).next('.check-text-wrap').removeClass('on');
	});
	// signup email input check
	$('.email-input-box .input-box-wrap *').focusin(function(){
		$('.email-input-box .input-box-wrap ~ .check-text-wrap').show();
	});
	$('.email-input-box .input-box-wrap *').focusout(function(){
		$('.email-input-box .input-box-wrap ~ .check-text-wrap:not(.on)').hide();
	});
});
/* Switch */
$(function () {
    document.querySelectorAll('.checkbox-switch').forEach(function(checkbox) {
        const label = document.querySelector(`label[for="${checkbox.id}"]`);
        // 초기 상태에 따라 텍스트 설정
        label.textContent = checkbox.checked ? '공개' : '비공개';

        // 상태 변경 시 텍스트 업데이트
        checkbox.addEventListener('change', function() {
            label.textContent = checkbox.checked ? '공개' : '비공개';
        });
    });
});

/*========== Keyup ==========*/
$(function(){
	// input keyup
	if ($(".input-box.keyup").length > 0) {
		$('.input-box.keyup input').on('keyup', function() {
			const maxLength = $(this).attr('maxlength');
			const $typingNum = $(this).siblings('.write-typing').find('.typing-num');
			
			const currentLength = $(this).val().length;
			$typingNum.html(currentLength);
	
			if (currentLength > 0) {
				$typingNum.addClass('on');
			} else {
				$typingNum.removeClass('on');
			}
	
			if (currentLength > maxLength) {
				$(this).val($(this).val().substring(0, maxLength));
				$typingNum.html(maxLength);
			}
		});

		$(document).ready(function() {
			$('.input-box.keyup input').each(function() {
				const $typingNum = $(this).siblings('.write-typing').find('.typing-num');
				const currentLength = $(this).val().length;
				$typingNum.html(currentLength);
		
				if (currentLength > 0) {
					$typingNum.addClass('on');
				} else {
					$typingNum.removeClass('on');
				}
			});
		
			$('.input-box.keyup input').on('focus', function() {
				const $typingNum = $(this).siblings('.write-typing').find('.typing-num');
				const currentLength = $(this).val().length;
				$typingNum.html(currentLength);
		
				if (currentLength > 0) {
					$typingNum.addClass('on');
				} else {
					$typingNum.removeClass('on');
				}
			});
		});
	
		// 초기화
		$('.input-box.keyup input').each(function() {
			const initialMaxLength = $(this).attr('maxlength');
			const $typingMaxNum = $(this).siblings('.write-typing').find('.typing-max-num'); 
			const $typingNum = $(this).siblings('.write-typing').find('.typing-num');
			
			$typingMaxNum.html(initialMaxLength);
			$typingNum.html('0');
			$typingNum.removeClass('on');
		});
	}

	//textarea keyup
	if ($(".textarea-box.keyup").length > 0) {
		$('.textarea-box.keyup textarea').on('keyup', function() {
			const maxLengthTxt = $(this).attr('maxlength');
			const $typingNumTxt = $(this).parent().next('.write-typing').find('.typing-num');
			
			const currentLength = $(this).val().length;
			$typingNumTxt.html(currentLength);
	
			if (currentLength > 0) {
				$typingNumTxt.addClass('on');
			} else {
				$typingNumTxt.removeClass('on');
			}
	
			if (currentLength > maxLengthTxt) {
				$(this).val($(this).val().substring(0, maxLengthTxt));
				$typingNumTxt.html(maxLengthTxt);
			}
		});
	
		// 포커스
		$(document).ready(function() {
			const $autofocusTextarea = $('.textarea-box.keyup textarea[autofocus]');
			if ($autofocusTextarea.length > 0) {
				const $typingNumTxt = $autofocusTextarea.parent().next('.write-typing').find('.typing-num');
				const currentLength = $autofocusTextarea.val().length;
				$typingNumTxt.html(currentLength);
		
				if (currentLength > 0) {
					$typingNumTxt.addClass('on');
				} else {
					$typingNumTxt.removeClass('on');
				}
			}
			
			$('.textarea-box.keyup textarea').on('focus', function() {
				const $typingNumTxt = $(this).parent().next('.write-typing').find('.typing-num');
				const currentLength = $(this).val().length;
				$typingNumTxt.html(currentLength);
		
				if (currentLength > 0) {
					$typingNumTxt.addClass('on');
				} else {
					$typingNumTxt.removeClass('on');
				}
			});
		});
	
		// 초기화
		$('.textarea-box.keyup textarea').each(function() {
			const initialMaxLengthTxt = $(this).attr('maxlength');
			const $typingMaxNumTxt = $(this).parent().next('.write-typing').find('.typing-max-num'); 
			const $typingNumTxt = $(this).parent().next('.write-typing').find('.typing-num');
			
			$typingMaxNumTxt.html(initialMaxLengthTxt);
			$typingNumTxt.html('0');
			$typingNumTxt.removeClass('on');
		});
	}

	//Search Box
	if ($(".search-input-wrap").length > 0) {
		$(document).ready(function() {
			const $searchWrap = $('.search-input-wrap');
			const $searchInput = $searchWrap.find('input');
			const $searchDeleteBtn = $('.search-del-btn');
			const $searchBtn = $('.search-btn');
			const $searchTxt = $('.search-keyword-wrap');

			// 초기화 함수
			function initializeSearch() {
				$searchInput.val('');
				$searchWrap.removeClass('on');
			}

			// 페이지 로드 시 초기화
			initializeSearch();

			// 1. 포커스 될 때 + 검색어 입력할 때 > 클래스 on 붙여주기
			$searchInput.on('focus keyup', function() {
				if ($(this).val().length > 0) {
					$searchWrap.addClass('on');
					$searchTxt.addClass('on');
				} else {
					$searchWrap.removeClass('on');
					$searchTxt.removeClass('on');
				}
			});

			// 2. 검색버튼 클릭시 페이지 이동으로 클래스 on 제거
			$searchBtn.on('click', function() {
				$searchWrap.removeClass('on');
				$searchTxt.removeClass('on');
			});

			// 3. 검색어 지우기 버튼 클릭 시 클래스 on 제거, input에 검색어 삭제
			$searchDeleteBtn.on('click', function() {
				initializeSearch();
				$searchTxt.removeClass('on');
			});

			// 4. 연관 검색어 
			$(".keyword-list li").on("click",function(){
				let keyword = $(this).children(".keyword").text();
				$searchInput.val(keyword);
			});

			// 5. 외부 영역 클릭 시 클래스 on 제거
			$(document).on('mouseup', function(e) {
				if (!$searchWrap.is(e.target) && $searchWrap.has(e.target).length === 0) {
					$searchWrap.removeClass('on');
					$searchTxt.removeClass('on');
				}
			});

			// 윈도우 리사이즈 시 초기화 (필요한 경우)
			$(window).on('resize', initializeSearch);
		});
	}
});

/*========== 서브페이지 타이틀 가져오기 ==========*/
function updateHeaderTitle() {
    var mainTitle = $('.main-title').text();
    var headerTitleElement = $('#header').find('#header-section-tit');
    
    if (headerTitleElement.length > 0) {
        headerTitleElement.text(mainTitle);
    } else {
        // 헤더가 아직 로드되지 않았다면, 잠시 후 다시 시도
        setTimeout(updateHeaderTitle, 100);
    }
}
$(document).ready(function() {
    updateHeaderTitle();
});

/*========== 댓글 관련 기능 ==========*/
$(function(){
	// 대댓글 보기 버튼
	$(".view-reply-btn").on("click",function(){
		const $replyBtn = $(this);
		if ($replyBtn.hasClass("sliding")) return;

		$replyBtn.addClass("sliding");
		const $replyWrap = $replyBtn.closest(".content-area").find(".comment-reply-wrap");

		if ($replyBtn.hasClass("on")) {
			$replyWrap.animate({
				height: 'toggle',
				opacity: 'toggle'
			}, 300, function() {
				$replyBtn.removeClass("on sliding");
			});
		} else {
			$replyWrap.animate({
				height: 'toggle',
				opacity: 'toggle'
			}, 300, function() {
				$replyBtn.addClass("on").removeClass("sliding");
			});
		}
	});
	// 답글쓰기
	$(".comment-list .reply-btn").on("click",function(){
		if($(".input-txt-box").hasClass("reply")) return;
		// 댓글 작성자 닉네임 가져오기
		const commenter = $(this).closest(".comment-content-wrap").children(".user").text();
		$(".input-txt-box .input-txt-popup .input-popup-cont span").text(commenter);
		$(".input-txt-box").addClass("reply");
	});
	$(".input-txt-box .input-popup-cancel-btn").on("click",function(){
		$(".input-txt-box").removeClass("reply");
	});
	// 댓글 입력 중일시
	$(".input-txt-box input").focusin(function () {
		$(this).closest('.input-txt-box').addClass('typing');
	});
	$(".input-txt-box input").focusout(function () {
		if ($(this).val() === '') {
			$(this).closest('.input-txt-box').removeClass('typing');
		} else {
			$(this).closest('.input-txt-box').addClass('typing');
		}
	});
});

/*========== Bottom Sheet : Check Type ==========*/
$(function() {
	$(".sheet-check-list li a").click(function() {
		const selectedTxt = $(this).text();

		$(".sheet-check-list li a").removeClass("active");
		$(this).toggleClass("active");
		$(".selected-txt").text(selectedTxt)
	});
});

/*========== Tab Scroll Top ==========*/
$(function(){
	if($(".scroll-tab-wrap").length > 0){
		const $tab = $(".scroll-tab");
		const $tabCont = $(".scroll-tab-cont");
		let tabHt = $tab.outerHeight();
		let tabTop = $tab.offset().top;
		let headerResponsive = window.innerWidth * 0.04267 * 2.75 > 55 ? 55 : window.innerWidth * 0.04267 * 2.75;
		let headerHt = headerResponsive < 44 ? 44 : headerResponsive;
		if(window.innerWidth < 421){ headerHt = 44; } 
		let innerWd = $(".scroll-tab-wrap").width();

		tabFixed();

		$(window).resize(function () {
			// fixed 풀기
			$tab.removeClass('fixed');
			$tab.css({
				top: '',
				width: ''
			});
			$tabCont.css('paddingTop', '');
			// 재설정
			tabHt = $tab.outerHeight();
			tabTop = $tab.offset().top;
			headerResponsive = window.innerWidth * 0.04267 * 2.75 > 55 ? 55 : window.innerWidth * 0.04267 * 2.75;
			headerHt = headerResponsive < 44 ? 44 : headerResponsive;
			if(window.innerWidth < 421){ headerHt = 44; } 
			innerWd = $(".scroll-tab-wrap").width();
			
			tabFixed();
		});
		
		$(window).scroll(function () {
			tabFixed();
		});	

		function tabFixed(){
			if ($(window).scrollTop() > tabTop - headerHt) {
				$tab.addClass('fixed');
				$tab.css({
					top: headerHt+"px",
					width: innerWd+"px"
				});
				$tabCont.css('paddingTop',tabHt+"px");
			} else {
				$tab.removeClass('fixed');
				$tab.css({
					top: '',
					width: ''
				});
				$tabCont.css('paddingTop', '');
			}
		}
	}
});

/*========== Button Style ==========*/
$(function(){
	/* 좋아요 버튼 */
	$(".like-btn").on("click",function(e){
		e.preventDefault();
		$(this).toggleClass("on");
	});
	
	/* 공개 버튼 */
	$(document).ready(function() {
		$(".lock-btn").each(function() {
			lockBtnText($(this));
		});
	});
	$(".lock-btn").on("click", function(e) {
		e.preventDefault();
		$(this).toggleClass("on");
		lockBtnText($(this));
	});
	function lockBtnText(lockBtn) {
		if (lockBtn.hasClass("on")) {
			lockBtn.children('span').text("공개");
		} else {
			lockBtn.children('span').text("비공개");
		}
	}

	/* 내 팔로우 */
	$(document).ready(function() {
		$(".follow .pink").each(function() {
			followBtnText($(this));
		});
	});
	$(".follow .pink").on("click", function(e) {
		e.preventDefault();
		$(this).toggleClass("on");
		followBtnText($(this));
	});
	function followBtnText(followBtn) {
		if (followBtn.hasClass("on")) {
			followBtn.children('span').text("팔로우");
		} else {
			followBtn.children('span').text("팔로잉");
		}
	}

	/* 북마크 */
	$(".img-btn-wrap .img-btn.bookmark").on("click",function(e){
		e.preventDefault();
		$(this).toggleClass("on");
	});

	/* 팔로우 버튼 */
	$(".follow-btn-wrap .follow-btn").on("click",function(){
		$(this).parent(".follow-btn-wrap").addClass("following");
	});
	$(".follow-btn-wrap .following-btn").on("click",function(){
		$(this).parent(".follow-btn-wrap").removeClass("following");
	});

	/* sorting 버튼 active */
	$(".sorting-list > li").on("click",function(){
		$(this).parent(".sorting-list").children("li").removeClass("active");
		$(this).addClass("active");
	});
});

/*========== 더보기 버튼 : 말줄임 ==========*/
$(function(){
	if($(".more-article").length <= 0) return;

	const moreArticleText = document.querySelector('.more-article-txt');
	const moreButton = document.querySelector('.view-more-btn');
	
	function checkTextOverflow() {
        const lineHeight = parseInt(window.getComputedStyle(moreArticleText).lineHeight);
        const threeLinesHeight = lineHeight * 3;
        
        if (moreArticleText.scrollHeight > threeLinesHeight) {
            moreArticleText.classList.remove('notmore');
        } else {
            moreArticleText.classList.add('notmore');
        }
    }

    // 한 번만 클릭 이벤트 처리
    moreArticleText.addEventListener('click', function() {
        if (!this.classList.contains('overview')) {
            this.classList.add('overview');
            this.classList.remove('notmore');
            // 클릭 이벤트 리스너 제거
            this.removeEventListener('click', arguments.callee);
        }
    });

    // 폰트 로드 완료 후 초기 확인
    document.fonts.ready.then(function() {
        checkTextOverflow();
    });

    // 윈도우 리사이즈 시 다시 확인 (overview 상태가 아닐 때만)
    window.addEventListener('resize', function() {
        if (!moreArticleText.classList.contains('overview')) {
            checkTextOverflow();
        }
    });
});

/*========== 싱코인 선물하기 팝업 ==========*/
$(function(){
	if($(".giftScPop").length <= 0) return;
	const minusBtn = document.querySelector('.minus-gift-sc-btn');
	const plusBtn = document.querySelector('.plus-gift-sc-btn');
	const input = document.querySelector('.gift-sc-input');
	const allCheckBox = document.querySelector('#gift-all-check-box');
	const currentScSpan = document.querySelector('.current-sc.num');

	// 현재 보유 코인 수
	let currentSc = parseInt(currentScSpan.textContent.replace(/,/g, ''));

	// 숫자 포맷팅 함수 (1000 -> 1,000)
	function formatNumber(num) {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	// 쉼표 제거 함수
	function removeCommas(str) {
		return str.replace(/,/g, '');
	}

	// 입력값 업데이트 함수
	function updateInput(value) {
		input.value = formatNumber(value);
		checkAllGiftStatus(value);
	}

	// 모두 주기 체크박스 상태 확인 및 업데이트
	function checkAllGiftStatus(value) {
		if (value < currentSc) {
			allCheckBox.checked = false;
		} else if (value === currentSc) {
			allCheckBox.checked = true;
		}
	}

	// 입력값 변경 처리 함수
	function handleInputChange() {
		let value = parseInt(removeCommas(input.value));
		if (isNaN(value) || value < 0) {
			value = 0;
		} else if (value > currentSc) {
			value = currentSc;
		}
		updateInput(value);
	}

	// 감소 버튼 클릭 이벤트
	minusBtn.addEventListener('click', () => {
		let currentValue = parseInt(removeCommas(input.value));
		if (currentValue > 0) {
			updateInput(currentValue - 1);
		}
	});

	// 증가 버튼 클릭 이벤트
	plusBtn.addEventListener('click', () => {
		let currentValue = parseInt(removeCommas(input.value));
		if (currentValue < currentSc) {
			updateInput(currentValue + 1);
		}
	});

	// 입력값 변경 이벤트
	input.addEventListener('input', handleInputChange);

	// 입력 필드에서 포커스가 벗어날 때 이벤트
	input.addEventListener('blur', handleInputChange);

	// '모두 주기' 체크박스 이벤트
	allCheckBox.addEventListener('change', (e) => {
		if (e.target.checked) {
			updateInput(currentSc);
		}
	});
});