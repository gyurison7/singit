/* ------------------------------------------------------------------------
	스크롤 활성화/비활성화 기능 240805
------------------------------------------------------------------------ */
let scrollPosition = 0;
function scrollDisable(){ // body 스크롤 비활성화
	scrollPosition = window.pageYOffset; // 현재 스크롤 위치를 저장
	$('body').addClass('scroll-disable');
	$('html, body').scrollTop(scrollPosition);
	document.body.addEventListener('scroll touchmove mousewheel',function(e){
		e.preventDefault();
	},{passive: false});
	document.documentElement.style.overscrollBehaviorY = 'none';
	document.documentElement.style.scrollBehavior = 'auto';
}
function scrollAble(){ // body 스크롤 활성화
	$('body').removeClass('scroll-disable').off('scroll touchmove mousewheel');
	$('html, body').scrollTop(scrollPosition);
	document.documentElement.style.removeProperty('overscroll-behavior-y');
	document.documentElement.style.removeProperty('scroll-behavior');
}
/* //스크롤 활성화/비활성화 기능 끝 */

/* ------------------------------------------------------------------------
	Modal Popup Focus 240805
------------------------------------------------------------------------ */
let beforeFocus; // 이전 포커스 저장
// Modal Popup 열기 & 닫기
function modalPopup(modal) {
	const $modal = $(modal);
	const $modalWrap = $modal.children(".modal-wrap");
	const $tabbableElements = $modalWrap.find("a, button, input:not([type='hidden']), select, textarea, [href], [tabindex]:not([tabindex='-1'])");

	scrollDisable();
	$modal.addClass('open');
	beforeFocus = $(document.activeElement);
	beforeFocus.blur();

	// 모달 내 첫 번째 포커스 가능 요소에 포커스
	if ($tabbableElements.length) {
		$tabbableElements.first().focus();
	} else {
		$modalWrap.attr('tabindex', '-1').focus();
	}

	// 모달 내에서 포커스 순환
	$modal.on('keydown', function(e) {
		if (e.key === 'Tab' || e.keyCode === 9) {
			if (e.shiftKey) { // Shift + Tab
				if (document.activeElement === $tabbableElements[0]) {
					e.preventDefault();
					$tabbableElements.last().focus();
				}
			} else { // Tab
				if (document.activeElement === $tabbableElements[$tabbableElements.length - 1]) {
					e.preventDefault();
					$tabbableElements.first().focus();
				}
			}
		}
	});
}
function modalPopupClose(modal) {
	scrollAble();
	$(modal).removeClass('open');	
	$(beforeFocus).focus();
}
function modalPopAllClose(){
	scrollAble();
	$(".modal").removeClass('open');
}
$(document).mouseup(function (e){
	var modalPop = $(".modal:not(.alert)");
	var modalFull = $(".modal.full");
	if($(".modal.open").length > 0 && modalPop.has(e.target).length === 0 && !modalFull.has(e.target).length === 0 && !($(".modal.alert").hasClass("open"))){
		modalPopAllClose();
	}
});

// 모달팝업 안에 tab 포커스가 안들어가있을경우,
$(document).on("keydown", function(e) {
	if ((e.keyCode || e.which) === 9) {
		const $openModal = $(".modal.open");
		if ($openModal.length && !$openModal.find(':focus').length) {
			e.preventDefault();
			const $tabbableElements = $openModal.find("a, button, input:not([type='hidden']), select, textarea, [href], [tabindex]:not([tabindex='-1'])");
			$tabbableElements.first().focus();
		}
	}
});
/* //Modal Popup Focus 끝 */

/* ------------------------------------------------------------------------
	Bottom Sheet & Handle Bar 240805
------------------------------------------------------------------------ */
// 전역 변수 선언
let sheetOpen = false;
let sheetInitialHeight = 0;
let sheetCurrentHeight = 0;
let sheetStartY = 0;
let sheetStartHeight = 0;

function openBottomSheet(el) {
	// 이미 열려있는 bottom sheet가 있다면 닫기
	if($(".bottom-sheet-wrap.open").length > 0){
		closeBottomSheet();
	}
	const sheetWrap = document.querySelector(el);
	const sheet = sheetWrap.querySelector('.bottom-sheet');
	sheetInitialHeight = sheet.offsetHeight;
	// 댓글 bottom sheet일때 초기 높이 지정(특수한 경우) : 화면 높이의 70%가 default 초기 높이값이 됩니다.
	if(sheetWrap.classList.contains("comment")){
		sheetInitialHeight = window.innerHeight * 0.7;
	}
	sheetCurrentHeight = sheetInitialHeight;
	sheetWrap.classList.add('open');
	scrollDisable();
	sheet.style.transform = 'translate(-50%,0)';
	$('.bottom-sheet-wrap.open .bottom-sheet.sheet-stretch .sheet-content').outerHeight(sheetCurrentHeight);
	sheetOpen = true;
}

function closeBottomSheet() {
	const sheets = document.querySelectorAll('.bottom-sheet-wrap.open .bottom-sheet');

	sheets.forEach(function(sheet){
		sheet.style.transform = 'translate(-50%,110%)';
		sheet.closest('.bottom-sheet-wrap.open').classList.remove('open');
		// 바텀 시트를 닫을 때 높이를 초기 값으로 재설정
		sheet.style.height = `${sheetInitialHeight}px`;
		if(sheet.classList.contains("sheet-stretch")){
			sheet.querySelector(".sheet-content").style.height = "";
		}
	});
	scrollAble();
	sheetOpen = false;
	sheetCurrentHeight = sheetInitialHeight;

	/* Toast popup이 있는 경우(옵션) */
	if($(".toast-popup").length > 0 && $(".toast-popup").hasClass('active')){
		if(toastTimer){
			clearTimeout(toastTimer);
		}
		closeToast();
	}
}

$(function(){
	$('.bottom-sheet-dimmed').on('click', function(e) {
		if ($(e.target).is('.bottom-sheet-dimmed')) {
			closeBottomSheet();
		}
	});
	$('.handle-area').on('mousedown touchstart', startDragging);
});


function startDragging(e) {
	e.preventDefault();

	let event = e.originalEvent || e; // jQuery 이벤트 객체에서 원본 이벤트 객체 추출
	sheetStartY = event.type.includes('mouse') ? event.clientY : event.touches[0].clientY;
	sheetStartHeight = sheetCurrentHeight;
	$('.bottom-sheet-wrap.open .bottom-sheet').css('transition', 'none');
	$(document).on('mousemove touchmove', drag);
	$(document).on('mouseup touchend', stopDragging);

	if($(".toast-popup").length > 0 && $(".toast-popup").hasClass('active')){
		if(toastTimer){
			clearTimeout(toastTimer);
		}
		closeToast();
	}
}

function drag(e) {
	let event = e.originalEvent || e;
	const currentY = event.type.includes('mouse') ? event.clientY : event.touches[0].clientY;
	const deltaY = sheetStartY - currentY;
	sheetCurrentHeight = Math.max(0, Math.min(window.innerHeight - 50, sheetStartHeight + deltaY));
	// 커지지 못하는 .unable-stretch 일 경우, 시작 높이가 최대 높이
	if($(".bottom-sheet-wrap.open .unable-stretch").length > 0 
	&& sheetCurrentHeight > sheetInitialHeight){
		sheetCurrentHeight = sheetInitialHeight;
	}
	$('.bottom-sheet-wrap.open .bottom-sheet').height(sheetCurrentHeight);
	$('.bottom-sheet-wrap.open .bottom-sheet.sheet-stretch .sheet-content').outerHeight(sheetCurrentHeight);
}

function stopDragging() {
	$(document).off('mousemove touchmove', drag);
	$(document).off('mouseup touchend', stopDragging);

	$('.bottom-sheet-wrap.open .bottom-sheet').css('transition', 'height 0.3s ease-out, transform 0.3s ease-out');
	if (sheetCurrentHeight > sheetInitialHeight) {
		$('.bottom-sheet-wrap.open .bottom-sheet').height(sheetCurrentHeight);
		$('.bottom-sheet-wrap.open .bottom-sheet.sheet-stretch .sheet-content').outerHeight(sheetCurrentHeight);
	} else if (sheetCurrentHeight < sheetInitialHeight * 0.5) {
		closeBottomSheet();
	} else {
		$('.bottom-sheet-wrap.open .bottom-sheet').height(sheetInitialHeight);
		$('.bottom-sheet-wrap.open .bottom-sheet.sheet-stretch .sheet-content').outerHeight(sheetInitialHeight);
		sheetCurrentHeight = sheetInitialHeight;
	}
}

/* ------------------------------------------------------------------------
	Toast Popup 240805
------------------------------------------------------------------------ */
let toastTimer;
let dragStartY;
const DRAG_THRESHOLD = 50;

function toastPopup(toast){
	if(toastTimer){
		clearTimeout(toastTimer);
	}
	
	const toastPop = document.querySelector(".toast-popup");
	toastPop.querySelectorAll("p").forEach(function(el){ el.classList.remove('on'); });
	toastPop.querySelector(`p.${toast}`).classList.add('on');

	// bottom sheet 있는 경우(옵션)
	if($(".bottom-sheet-wrap.open").length > 0){
		const btmSheetHeight = parseInt($(".bottom-sheet").css("height"));
		if(btmSheetHeight > 0){
			toastPop.style.bottom = `${btmSheetHeight}px`;
		}
		if(btmSheetHeight >= window.innerHeight * 0.7){ // 바텀시트가 화면의 70% 이상일때
			toastPop.style.bottom = 0;
			toastPop.style.zIndex = $(".bottom-sheet").css("z-index") + 1;
		}
	}
	
	toastPop.classList.add('active');
	toastTimer = setTimeout(function(){
		closeToast();
	}, 1500);

	// 드래그 이벤트 리스너 추가
	toastPop.addEventListener('touchstart', toastDragStart);
	toastPop.addEventListener('touchend', toastDragEnd);

	// 마우스 이벤트도 추가 (데스크톱 지원)
	toastPop.addEventListener('mousedown', toastDragStart);
	toastPop.addEventListener('mouseup', toastDragEnd);
}

function toastDragStart(e) {
	dragStartY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
}

function toastDragEnd(e) {
	if (dragStartY === undefined) return;
	
	const endY = e.type.includes('mouse') ? e.clientY : e.changedTouches[0].clientY;
	const deltaY = endY - dragStartY;

	if (deltaY > DRAG_THRESHOLD) {
		if(toastTimer){ clearTimeout(toastTimer);}
		closeToast();
	}
	dragStartY = undefined;
}


function closeToast(){
	document.querySelector(".toast-popup").classList.remove('active');
	
	setTimeout(function(){
		document.querySelector(".toast-popup").style.bottom = 0;
		document.querySelector(".toast-popup").style.zIndex = "";
	},300);
}
/* //Toast Popup 끝 */