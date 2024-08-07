/* Info
   ========================================================================== */
/**
 * 1. Writer: Ajin Lee. Sunhyeong Kim. (Weaverloft Corp.)
 * 2. Production Date: 2023-09-21
 * 3. Client: SNUH E-Sabo
 */

/*========== Main ==========*/
$(function () {
    if ($("#chart-visit-table").length > 0) {

		var options = {
            lang: {
                noData: '데이터가 없습니다',
            },
            chart: {
                width: 1000,
                height: 240,
                animation: {
                    duration: 600
                }
            },
            series: {
                stack: {
                    type: 'normal',
                },
				eventDetectType: 'grouped',
				showDot: true,
				zoomable: true
            },
            exportMenu: {
                visible: false
            },
            legend: {
                visible: false
            },
            theme: {
                series: {
                    barWidth: 40,
                    barThickness: 30,
                    borderRadius: 4,
                    colors: ['#E82929'],
						textBuble: {
							
						},
                },
                legend: {
                    label: {
                        fontFamily: 'Pretendard',
                        fontSize: 12,
                        color: '#999',
                    },
                },
                chart: {
                    backgroundColor: 'transparent',
                },
                yAxis: {
                    label: {
                        fontSize: 0,
                    },
                    color: 'transparent',
                },
                xAxis: {
                    label: {
                        fontFamily: 'Pretendard',
                        fontSize: 14,
                        fontWeight: 500,
                        color: '#555',
                    },
                    color: '#e5eaef',
                },
                plot: {
                    vertical: {
                        lineColor: 'transparent',
                    },
                    horizontal: {
                        lineColor: '#e5eaef',
                    },
                },
            },
			responsive:{
				
			}
        };
        function chartVisitMain(){
            const el = document.getElementById('chart-visit-table');
            const data = {
                categories: ['9월1일','2일','3일','4일','5일','6일','7일','8일','9일','10일','11일','12일', '13일', '14일', '15일', '16일', '17일', '18일', '19일', '20일' , '오늘'],
                series: [{
                        name: '방문 횟수',
                        data: [47, 20, 21, 33, 65, 78, 50, 47, 54, 89, 89, 58, 86, 192, 491, 160, 84, 70, 158, 78, 99],
                    }
                ],
            };
            options

            const chart = toastui.Chart.lineChart({ el, data, options });
            chart.hideSeriesDataLabel();
        } chartVisitMain();
    }
})

/*========== Statistics ==========*/
$(function () {
    if ($(".page-stat").length > 0) {

		const options = {
            lang: {
                noData: '데이터가 없습니다',
            },
            chart: {
                width: 'auto',
                height: 400,
                animation: {
                    duration: 600
                }
            },
            series: {
                stack: {
                    type: 'normal',
                },
				eventDetectType: 'grouped',
            },
            exportMenu: {
                visible: false
            },
            legend: {
                visible: false
            },
            theme: {
                series: {
                    barWidth: 40,
                    barThickness: 30,
                    borderRadius: 4,
                    colors: ['#ea2125'],
						textBuble: {
							
						},
                },
                legend: {
                    label: {
                        fontFamily: 'Pretendard',
                        fontSize: 12,
                        color: '#999',
                    },
                },
                chart: {
                    backgroundColor: 'transparent',
                },
                yAxis: {
                    label: {
                        fontFamily: 'Pretendard',
                        fontSize: 13,
                        fontWeight: 400,
                        color: '#777',
                    },
                    color: 'transparent',
                },
                xAxis: {
                    label: {
                        fontFamily: 'Pretendard',
                        fontSize: 13,
                        fontWeight: 400,
                        color: '#555',
                    },
                    color: '#e5eaef',
                },
                plot: {
                    vertical: {
                        lineColor: 'transparent',
                    },
                    horizontal: {
                        lineColor: '#e5eaef',
                    },
                },
            },
			responsive:{
				
			}
        };
        function chartStatVisitDay(){
            const el = document.getElementById('chart-stat-visit-day-table');
            const data = {
                categories: ['2023.08.21','2023.08.22','2023.08.23','2023.08.24','2023.08.25','2023.08.26','2023.08.27'],
                series: [{
                        name: '방문 현황',
                        data: [120, 250, 200, 300, 500, 148, 37],
                    }
                ],
            };
            options

            const chart = toastui.Chart.columnChart({ el, data, options });
        } chartStatVisitDay();

		function chartStatVisitWeek(){
            const el = document.getElementById('chart-stat-visit-week-table');
            const data = {
                categories: ['2023.08.13 ~ 08.19','2023.08.06 ~ 08.12','2023.07.30 ~ 08.05','2023.07.23 ~ 07.29','2023.07.16 ~ 07.22','2023.07.19 ~ 07.15','2023.07.02 ~ 07.08'],
                series: [{
                        name: '방문 현황',
                        data: [120, 250, 200, 300, 380, 148, 49],
                    }
                ],
            };
            options

            const chart = toastui.Chart.columnChart({ el, data, options });
        } chartStatVisitWeek();

		function chartStatVisitMonth(){
            const el = document.getElementById('chart-stat-visit-month-table');
            const data = {
                categories: ['2022년 9월','2022년 10월','2022년 11월','2022년 12월','2023년 1월','2023년 2월','2023년 3월','2023년 4월','2023년 5월','2023년 6월','2023년 7월','2023년 8월'],
                series: [{
                        name: '방문 현황',
                        data: [120,240,400,700, 850, 550, 900, 1050, 800, 480, 600, 240],
                    }
                ],
            };
            options

            const chart = toastui.Chart.columnChart({ el, data, options });
        } chartStatVisitMonth();
    }
})
