/* Info
 ========================================================================== */
/**
 * 1. Writer: Ajin Lee. Sunhyeong Kim. (Weaverloft Corp.)
 * 2. Production Date: 2023-01-02
 * 3. Client: 서울대학교병원 융합의학기술원
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

/*========== Basic ==========*/
// skeleton
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

/* 본문 바로가기 */
// $(function(){
// 	var skipNavDiv = document.createElement('div');
// 	skipNavDiv.className = 'skip-nav';
// 	skipNavDiv.innerHTML = '<a href="#main" tabindex="0">본문바로가기</a>';

// 	var bodyElement = document.body;
// 	bodyElement.insertBefore(skipNavDiv, bodyElement.firstChild);
// });

/* Tab Menu */
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

/* Tab Btn Menu */
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

/* Floating Button */
// $(function () {
// 	$(window).scroll(function(e) {
// 		e.preventDefault(); 
//         FloatBtn();
// 		if ($(this).scrollTop() > 100) {
// 			$('#singit-box"').fadeIn();
// 		} else {
// 			$('#singit-box"').fadeOut();
// 		}
// 	});
// 	function FloatBtn(){
// 		var WindowT = $(window).scrollTop();
// 		var FooterHt = $('#footer').outerHeight();
// 		var DocHt = $(document).height();
//         var FloationgVal = DocHt - $(window).height() - FooterHt - ($(window).height()*0.02);

//         if (WindowT >= FloationgVal) {
//             $('#singit-box').addClass('on');
//         } else {
//             $('#singit-box').removeClass('on');
//         }
// 	}
// 	$('#singit-box').click(function () {
// 		$("html, body").animate({ scrollTop: 0 }, 400);
// 		return false;
// 	});
// });


/* Input number + comma */
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

// Input
$(function () {
	// border animation
	$(".input-box input").focusin(function () {
		$(this).next().addClass('on');
	});
	$(".input-box input").focusout(function () {
		$(this).next().removeClass('on');
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
});

/* Touch-mark */
$(document).ready(function() {
	var isDragging = false;
	// 드래그 시작 시
	$('.touch-area').on('mousedown touchstart', function() {
		isDragging = true;
		$(this).children('.touch-mark').addClass('off');
	});
	// 문서의 다른 부분을 터치할 때
	$(document).on('mousedown touchstart', function(event) {
		// 현재 터치 이벤트가 발생한 요소가 .touch-area인지 확인
		if (!$(event.target).closest('.touch-area').length) {
			$('.touch-mark').removeClass('off');
		}
	});
});


// 20240806 서브페이지 타이틀 가져오기
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


// $(document).ready(function() {
//     var mainTitle = $('.main-title').text();

//     var observer = new MutationObserver(function(mutations) {
//         mutations.forEach(function(mutation) {
//             if (mutation.addedNodes) {
//                 var headerTitleElement = $('#header-section-tit');
//                 if (headerTitleElement.length > 0) {
//                     headerTitleElement.text(mainTitle);
//                     observer.disconnect(); // 작업이 완료되면 관찰 중지
//                 }
//             }
//         });
//     });

//     observer.observe(document.body, { childList: true, subtree: true });
// });
