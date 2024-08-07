/* Info
   ========================================================================== */
/**
 * 1. Writer: Ajin Lee. Sunhyeong Kim. (Weaverloft Corp.)
 * 2. Production Date: 2023-09-21
 * 3. Client: SNUH E-Sabo
 */

/*========== Basic ==========*/
// Modal Popup
function modalPopup(target) {
	$("html").css('overflow-y','hidden');
	$(target).addClass('open');
}
function modalPopupClose(target){
	$("html").css('overflow-y','auto');
	$(target).removeClass('open');
}
function modalPopAllClose(){
	$("html").css('overflow-y','auto');
	$(".modal").removeClass('open');
}
$(document).mouseup(function (e){
	var modalPop = $(".modal:not(.msg)");
	if(modalPop.has(e.target).length === 0 && !($(".modal.msg").hasClass("open"))){
		$("html").css('overflow-y','auto');
		modalPop.removeClass("open");
	}
});

// Tab Menu
$(function () {
	if ($(".tab-container").length > 0) {
		$('ul.tab-menu li.tab-link a').click(function (e) {
			e.preventDefault();
			var tab_id = $(this).parent('li').attr('data-tab');
			$(this).parent('li').siblings('li').removeClass('current');
			$(this).parent('li').addClass('current');
			$("#" + tab_id).addClass('current').siblings().removeClass('current');
		});
		
		$(".tab-menu:not(.tab-menu02) li.tab-link a").click(function () {
			var position = $(this).parent().position();
			$(".tab-menu:not(.tab-menu02) li.slider").css({
				"left": +position.left,
			});
		});
		var actPosition = $(".tab-menu:not(.tab-menu02) .current").position();
		$(".tab-menu:not(.tab-menu02) li.slider").css({
			"left": +actPosition.left,
		});
		$(window).resize(function(){
			$(".tab-menu:not(.tab-menu02) li.tab-link a").click(function () {
				var position = $(this).parent().position();
				$(".tab-menu:not(.tab-menu02) li.slider").css({
					"left": +position.left,
				});
			});
			var actPosition = $(".tab-menu:not(.tab-menu02) .current").position();
			$(".tab-menu:not(.tab-menu02) li.slider").css({
				"left": +actPosition.left,
			});
		});
	};
});

// Input number + comma
$(document).on('keyup', 'input[name=number]', function (event) {
	if(event.keyCode === 65 || event.keyCode === 17) return; //Ctrl + A 시 전체선택 안됨 이슈 해결
	if(this.value == '0') return;
	let cursorIndex = this.selectionStart;
	const before = this.value.substring(0,cursorIndex).match(/,/g)?.length;
	// this.value = this.value.replace(/[^0-9]/g, ''); // 입력값이 숫자가 아니면 공백
	this.value = this.value.replace(/[^-0-9]/g, ''); // 입력값이 숫자가 아니면 공백 (.제외)
	this.value = (this.value.indexOf("-") === 0 ? "-" : "") + this.value.replace(/[-]/gi, ''); //-가 있다면 replace
	this.value = this.value.replace(/(^0+)/g, ''); // 맨 앞이 0이면 공백
	this.value = this.value.replace(/,/g, ''); // ,값 공백처리
	this.value = this.value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 정규식을 이용해서 3자리 마다 , 추가
	const after = this.value.substring(0,cursorIndex).match(/,/g)?.length;
	if(before != after) cursorIndex++; // ',' 추가시 커서 위치 조정
	this.setSelectionRange(cursorIndex,cursorIndex);
});

// input keyup
if ($(".input-box.keyup").length > 0) {
    $('.input-box.keyup input').on('keyup', function() {
        const maxLength = $(this).attr('maxlength');
        const $typingNum = $(this).siblings('.write-typing').find('.typing-num');
        
        $typingNum.html($(this).val().length);

        if ($(this).val().length > maxLength) {
            $(this).val($(this).val().substring(0, maxLength));
            $typingNum.html(maxLength);
        }
    });

    // 초기화
    $('.input-box.keyup input').each(function() {
        const initialMaxLength = $(this).attr('maxlength');
        const $typingMaxNum = $(this).siblings('.write-typing').find('.typing-max-num'); 
        const $typingNum = $(this).siblings('.write-typing').find('.typing-num');
        
        $typingMaxNum.html(initialMaxLength);
        $typingNum.html('0');
    });
}
//textarea keyup
if ($(".textarea-box.keyup").length > 0) {
    $('.textarea-box.keyup textarea').on('keyup', function() {
        const maxLengthTxt = $(this).attr('maxlength');
        const $typingNumTxt = $(this).parent().next('.write-typing').find('.typing-num');
        
        $typingNumTxt.html($(this).val().length);

        if ($(this).val().length > maxLengthTxt) {
            $(this).val($(this).val().substring(0, maxLengthTxt));
            $typingNumTxt.html(maxLengthTxt);
        }
    });

    // 초기화
    $('.textarea-box.keyup textarea').each(function() {
        const initialMaxLengthTxt = $(this).attr('maxlength');
        const $typingMaxNumTxt = $(this).parent().next('.write-typing').find('.typing-max-num'); 
        const $typingNumTxt = $(this).parent().next('.write-typing').find('.typing-num');
        
        $typingMaxNumTxt.html(initialMaxLengthTxt);
        $typingNumTxt.html('0');
    });
}

//error MSG
$(function(){
    /* --- datapicker error 메세지 --- */
    $("li.period .input-box").each(function(){
        let periodError = $(this).closest("li.period");
        let periodErrorInput = $(periodError).find(".input-box");
        let periodErrorMsg = $(periodError).find(".error-wrap");
        
        if ($(periodErrorInput).hasClass('error')) {
            $(periodErrorMsg).addClass('on');
        }
    });
    /* --- Email error 메세지 --- */
    $("li.email .input-box").each(function(){
        let emailError = $(this).closest("li.email");
        let emailErrorInput = $(emailError).find(".input-box");
        let emailErrorMsg = $(emailError).find(".error-wrap");
        let emailPassMsg = $(emailError).find(".pass-wrap");
        if ($(emailErrorInput).hasClass('error')) {
            $(emailErrorMsg).addClass('on');
        }
        if ($(emailErrorInput).hasClass('pass')) {
            $(emailPassMsg).addClass('on');
        }
    });
});

// Input
$(function () {
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

// flie Upload 
var fileArr = [], fileArr2 = [];
var fileIndex = 0, fileIndex2 = 0;

$(function () {
	if ($(".upload-file").length > 0) {
		const handler = {
			init() {
				const fileInput = document.querySelector('.upload-file input[type="file"]');
				const preview = document.querySelector('.file-list');
				fileInput.addEventListener('change', () => {
					const files = Array.from(fileInput.files)
					files.forEach(file => {
						fileArr.push(file);
						preview.innerHTML += `
						<div class="file">
							<p id="${fileIndex}">${file.name}</p>
							<button data-index="${fileIndex}" class='file-remove'>X</button>
						</div>`;
						fileIndex++;
					});
					fileInput.value = "";
				});
			},
			removeFile: () => {
				document.addEventListener('click', (e) => {
					if (e.target.className !== 'file-remove') return;
					const removeTargetId = e.target.dataset.index;
					const removeTarget = document.getElementById(removeTargetId).parentElement;
					const files = document.querySelector('.upload-file input[type="file"]').files;
					const dataTranster = new DataTransfer();

					Array.from(files)
						.filter(file => file.lastModified != removeTargetId)
						.forEach(file => {
							dataTranster.items.add(file);
						});
					if (fileArr.length > 0 && removeTargetId !== undefined && !isNaN(removeTargetId)) {
						fileArr[removeTargetId].is_delete = true;
					}
					document.querySelector('.upload-file input').files = dataTranster.files;
					removeTarget.remove();
				})
			}
		}
		handler.init()
		handler.removeFile()
	}
});

// header, title
window.addEventListener('load',function(){ headerSticky(); });
window.addEventListener('scroll', function () { headerSticky();});

function headerSticky() {
    var header = document.querySelector('#header');
    var pageTitleWrap = document.querySelector('.page-title-wrap');
    var scrollTop = window.scrollY;

    if (header && pageTitleWrap) {
        if (scrollTop > 20) {
            header.classList.add('sticky');
            pageTitleWrap.classList.add('sticky');
        } else {
            if (header.classList.contains('sticky')) {
                header.classList.remove('sticky');
                pageTitleWrap.classList.remove('sticky');
            }
        }
    }
}

/*========== Calendar ==========*/
if ($(".calendar").length > 0) {
    const daysTag = document.querySelector(".days");
    const currentDate = document.querySelector(".current-date");
    const prevNextIcon = document.querySelectorAll(".month-btn-wrap .btn");

    let currYear = new Date().getFullYear();
    let currMonth = new Date().getMonth();

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const renderCalendar = () => {
        const date = new Date(currYear, currMonth, 1);
        let firstDayofMonth = date.getDay();
        let lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();
        let lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay();
        let lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();

        let liTag = "";

        for (let i = firstDayofMonth; i > 0; i--) {
            liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
        }

        for (let i = 1; i <= lastDateofMonth; i++) {
            let isToday = i === new Date().getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? "active" : "";
            liTag += `<li class="${isToday}">${i}</li>`;
        }

        for (let i = lastDayofMonth; i < 6; i++) {
            liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
        }

        currentDate.innerText = `${months[currMonth]}, ${currYear}`;
        daysTag.innerHTML = liTag;
    };

    renderCalendar();

    prevNextIcon.forEach(icon => {
        icon.addEventListener("click", () => {
            currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

            if (currMonth < 0 || currMonth > 11) {
                currYear = icon.id === "prev" ? currYear - 1 : currYear + 1;
                currMonth = currMonth < 0 ? 11 : 0;
            }

            renderCalendar();
        });
    });
}

/*========== Datepicker ==========*/
$(function(){
	if($(".datepicker-box").length > 0) {
		$('.datepicker').not(".monthpicker").datepicker({
            closeText: "닫기",
            prevText: "이전달",
            nextText: "다음달",
            currentText: "오늘",
			dateFormat: 'yy-mm-dd',
            // minDate: 0,
			inline: true,
			showOtherMonths: true,
			showMonthAfterYear: true,
			monthNames: [ '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월' ],
			monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
			dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
            dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
            dayNamesMin: ["S", "M", "T", "W", "T", "F", "S"],
            firstDay: 0,
            isRTL: false,
            yearSuffix: "년",
			constrainInput: false,
			changeMonth: true,
			changeYear: true,
			yearRange: "-10:+10",
		});
		
		$('.datepicker.monthpicker').datepicker({ 
			closeText: "확인",
            prevText: "이전달",
            nextText: "다음달",
            currentText: "오늘",
			dateFormat: 'yy-mm',
			monthNames: [ '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월' ],
			monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
			yearSuffix: "년",
			changeMonth: true,
		    changeYear: true,
		    showButtonPanel: true,
		    onClose: function(dateText, inst) {  
	            var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val(); 
	            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val(); 
	            $(this).val($.datepicker.formatDate('yy-mm', new Date(year, month, 1)));
	        }
		});
		$('.datepicker.monthpicker').focus(function () {
			$(".ui-datepicker-calendar").hide();
			$("#ui-datepicker-div").position({
				  my: "center top",
				  at: "center bottom",
				  of: $(this)
			});
		});

		// 자동 오늘날짜 설정
		$('.datepicker.set').datepicker('setDate', 'today');
	}
});

/*========== Timepicker ==========*/
$(function(){
	if($(".timepicker").length > 0) {
        $(".timepicker").timepicker({
			/*timeFormat: "p hh:mm",*/
            timeFormat: "HH:mm",
            interval: 30, 
            minTime: "06",
            maxTime: "23:55pm", 
            defaultTime: "06",
            startTime: "01:00",
            dynamic: true, 
            dropdown: true, 
            scrollbar: false 
        });
    }
});

/*========== Tooltip ==========*/
$(function () {
    if ($(".tooltip").length > 0) {
        $(".tooltip img").click(function () {
            // $(this).toggleClass('on');
            $(this).next('.tooltip-con').toggleClass('on');
        });
        $(document).mouseup(function (e) {
            if ($(".tooltip-con, .tooltip.on").has(e.target).length === 0) {
                $(".tooltip").removeClass('on');
                $(".tooltip-con").removeClass('on');
            }
        });
    }
});

/*========== Radio ~ Div show/hide ==========*/
$(document).ready(function () {
    function addChangeListener(element, callback) {
        $(element).on("change", callback);
    }

    function setupShowHideElements(group) {
        const triggerElements = $(`.show-hide-radio[data-group='${group}'] .basic-radio-box input[type='radio']`);
        const targets = $(`.show-hide-radio[data-group='${group}'] .show-hide-div`);

        $(triggerElements).each(function () {
            addChangeListener(this, function () {
                const otherTargets = $(`.show-hide-radio[data-group='${group}'] .show-hide-div:not([data-target='${$(this).attr("data-target")}'])`);
                targets.hide();
                $(this.getAttribute("data-target")).show();
            });
        });

        // 초기 상태 설정 - 첫 번째로 checked 되어 있는 요소의 대상 요소 보여주기
        const checkedElement = triggerElements.filter(":checked");
        if (checkedElement.length > 0) {
            targets.hide();
            $(checkedElement.attr("data-target")).show();
            console.log(triggerElements);
            console.log(checkedElement);
        }
    }

    setupShowHideElements("form-radio-group");
    setupShowHideElements(".");
    setupShowHideElements(".");
    // 필요한 만큼 더 그룹에 대해 호출할 수 있습니다.
});

/*========== 체크박스 추가 기능 스크립트 ==========*/
$(function(){
    // Input checkbox All check
    $(document).on('click', 'input[name="selectAll"]', function () {
        $('.chkgroup:not(:disabled)').not(this).prop('checked', this.checked);
    });

    $(document).on('click', '.chkgroup', function () {
        if ($('.chkgroup:not(:disabled)').length == $('.chkgroup:checked').length) {
            $('input[name="selectAll"]').prop('checked', true);
        } else {
            $('input[name="selectAll"]').prop('checked', false);
        }
    }); 
}); 
$(function(){
    /* 같은 행 내에서 '전체' 체크시 all check */
    $(document).on('click', 'input.chk-all', function () {
        let thisTr = $(this).closest("tr");
        $(thisTr).find(".chkgroup:not(:disabled)").not(this).prop('checked', this.checked);
    });
    /* 같은 행 내에서 모두 체크시 '전체' check */
    $(document).on('click', '.chkgroup', function () {
        if($(this).hasClass("chk-th")){
            let thisTable = $(this).closest(".common-table");
			let allTr = $(thisTable).find("tr");
            if ($(thisTable).find('.chkgroup:not(:disabled)').not('input.chk-all').length == $(thisTable).find('.chkgroup:checked').not('input.chk-all').length) {
                $(thisTable).find('.basic-check-box.all-check-box input').prop('checked', true);
                $(thisTable).find('input.chk-all').prop('checked', true);
            } else {
				// 231218 조회 all 혹은 등록 all 시, 전체 check 확인
				$(allTr).each(function(index,tr){
					if ($(tr).find('.chkgroup:not(:disabled)').not('input.chk-all').length == $(tr).find('.chkgroup:checked').not('input.chk-all').length) {
						$(tr).find('input.chk-all').prop('checked', true);
					} else {
						$(tr).find('input.chk-all').prop('checked', false);
					}
				});
                //$(thisTable).find('.basic-check-box.all-check-box input').prop('checked', false);
                //$(thisTable).find('input.chk-all').prop('checked', false);
            }
        } else {
            let thisTr = $(this).closest("tr");
            if ($(thisTr).find('.chkgroup:not(:disabled)').not('input.chk-all').length == $(thisTr).find('.chkgroup:checked').not('input.chk-all').length) {
                $(thisTr).find('input.chk-all').prop('checked', true);
            } else {
                $(thisTr).find('input.chk-all').prop('checked', false);
            }
        }
    });
    /* '조회' All 체크시 check */
    $("input.viewAll").on('click', function () {
        let thisTable = $(this).closest(".common-table");
        $(thisTable).find(".chk-view:not(:disabled)").prop('checked', this.checked);
    });
    /* '등록/수정' All 체크시 check */
    $("input.editAll").on('click', function () {
        let thisTable = $(this).closest(".common-table");
        $(thisTable).find(".chk-edit:not(:disabled)").prop('checked', this.checked);
    });
    
    /* 같은 열 내에서 모두 체크시 */
    $(document).on('click', '.chkgroup', function () {
        let thisTable = $(this).closest(".common-table");
        if ($(thisTable).find('.chk-view:not(:disabled)').length == $(thisTable).find('.chk-view:checked').length) {
            $(thisTable).find("input.viewAll").prop('checked', true);
        } else {
            $(thisTable).find("input.viewAll").prop('checked', false);
        }

        if ($(thisTable).find('.chk-edit:not(:disabled)').length == $(thisTable).find('.chk-edit:checked').length) {
            $(thisTable).find("input.editAll").prop('checked', true);
        } else {
            $(thisTable).find("input.editAll").prop('checked', false);
        }
    });

    /* 전체 체크 재설정 (테이블 구분) */
    $(document).on('click', 'input.chkAllTable', function () {
        let thisTable = $(this).closest(".common-table");
        $(thisTable).find('.chkgroup:not(:disabled)').not(this).prop('checked', this.checked);
    });

    $(document).on('click', '.chkgroup', function () {
        let thisTable = $(this).closest(".common-table");
        if ($(thisTable).find('.chkgroup:not(:disabled)').length == $(thisTable).find('.chkgroup:checked').length) {
            $(thisTable).find('input.chkAllTable').prop('checked', true);
        } else {
            $(thisTable).find('input.chkAllTable').prop('checked', false);
        }
    }); 
});
