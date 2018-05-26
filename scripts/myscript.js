$(document).ready(() => {
    //dynamically render contents from JSON
    $.getJSON("https://s3.amazonaws.com/byujsa.com/scripts/Data.json", data => {
        //variable to prevent callback function to be called multiple times
        let done = false;

        //scroll to stop
        $("html,body").scrollTop(0);

        //loader functions
        const onReady = callback => {
            const intervalID = window.setInterval(checkReady, 250);

            function checkReady() {
                if (document.getElementsByTagName("body")[0] !== undefined) {
                    window.clearInterval(intervalID);
                    callback.call(this);
                };
            };
        };

        //hide child elements of pages 2+
        const hideChildren = callback => {
            for (let i = 2; i <= $('.page').length; i++) {
                h = $(`#page${i}`).height();
                $(`#page${i}`).height(h);
                $(`#page${i}`).children().children().hide();
            };
            callback.call();
        };

        onReady(() => {
            hideChildren(() => {
                $('.jqs').hide(() => {
                    $("#loader-container").fadeOut(750, () => {
                        $('.background').animate({
                            width: '100%'
                        }, {
                            duration: 1000,
                            easing: 'linear',
                            complete: () => {
                                setTimeout(() => {
                                    $('.s1').fadeIn({
                                        duration: 1000,
                                        easing: 'linear',
                                        complete: () => {
                                            setTimeout(() => {
                                                $('.s2').fadeIn({
                                                    duration: 1000,
                                                    easing: 'linear',
                                                    complete: () => {
                                                        if ($('body').is('#about')) {
                                                            if (!done) {
                                                                chart();
                                                            };
                                                        };
                                                        $('.mentor').show('slide', {
                                                            direction: 'right'
                                                        }, 500);
                                                    }
                                                });
                                            }, 500);
                                        }
                                    });
                                }, 500);
                            }
                        });

                    });
                });
            });
        });

        //clock
        startTime();

        function startTime() {
            let today = new Date();
            let mo = today.getMonth() + 1;
            let h = today.getHours();
            let m = today.getMinutes();
            let s = today.getSeconds();
            let jp_h = h + 16;
            if (jp_h >= 24) {
                jp_h = jp_h - 24;
            };

            //daylight saving: https://stackoverflow.com/questions/5590429/calculating-daylight-saving-time-from-only-date
            let saving_on = false;
            let previousSunday = today.getDate() - today.getDay();
            if (mo > 3 && mo < 11) {
                saving_on = true
            } else if (mo == 3) {
                saving_on = (previousSunday >= 8);
            } else if (mo == 11) {
                saving_on = (previousSunday <= 0);
            }
            //substract 1 if DST
            if (saving_on) {
                jp_h = jp_h - 1;
            };

            m = checkTime(m);
            s = checkTime(s);
            $("#ut-time").text(`${h}:${m}:${s}`);
            $("#jp-time").text(`${jp_h}:${m}:${s}`);
            let t = setTimeout(startTime, 500);
        }

        function checkTime(i) {
            if (i < 10) {
                i = "0" + i
            }; // add zero in front of numbers < 10
            return i;
        }

        //Mentor
        $('.mentor').on('click', event => {
            $(event.currentTarget).hide('slide', {
                direction: 'right'
            }, 500);
        });

        //when scroll show page content
        $(window).on('scroll', event => {
            for (let i = 1; i < $('.page').length; i++) {
                if ($(this).scrollTop() >= 895 * i - 400) {
                    $(`#page${i+1}`).find('.left-content').show('slide', {
                        direction: 'left',
                    }, 500);
                    $(`#page${i+1}`).find('.right-content').show('slide', {
                        direction: 'right'
                    }, 500);
                };
            };
        });

        //render upcoming event
        event_list = data.events;
        event_list.sort((a, b) => b.date - a.date);

        //render events
        for (let i = 0; i < event_list.length; i++) {
            event = event_list[i];
            $("ul#events").append(
                `<li class=\"event col-md-6\">
                    <p class=\"date\"><span class=\"fa fa-calendar\"></span> ${event.date}</p>
                    <h3 class=\"sub-heading\">${event.title}</h3>
                    <div class=\"container\">
                        <img src=\"${event.image[0]}\" />
                        <p>${event.description}</p>
                    </div>
                    <div class=\"overlay\">
                        <div class=\"container\">
                            <p>See More Photo</p>
                        </div>
                    </div>
                </li>`
            );
        };

        //render jobs
        for (let i = 0; i < data.jobs.length; i++) {
            job = data.jobs[i];
            $("ul#jobs").append(
                `<li class=\"job\">
                    <div>
                        <div class=\"summary\">
                            <h2 class=\"company\"><strong>${job.company}</strong></h2>
                            <h3 class=\"title\">${job.title}</h3>
                            <table class=\"text-center\">
                                <tr>
                                    <td class=\"cell-left\">Date Posted</td>
                                    <td class=\"cell-right\">${job.posted_date}</td>
                                </tr>
                                <tr>
                                    <td class=\"cell-left\">Type</td>
                                    <td class=\"cell-right\">${job.type}</td>
                                </tr>
                                <tr>
                                    <td class=\"cell-left\">Location</td>
                                    <td class=\"cell-right\">${job.location}</td>
                                </tr>
                                <tr>
                                    <td class=\"cell-left\">Major</td>
                                    <td class=\"cell-right\">${job.major}</td>
                                </tr>
                                <tr>
                                    <td class=\"cell-left\">Salary</td>
                                    <td class=\"cell-right\">${job.compensation}</td>
                                </tr>
                            </table>
                        </div>
                        <div class=\"detail\">
                            <div class=\"detail-container\">
                                <h4 class=\"lead-text\">Description</h4>
                                <p>${job.description}</p>
                                <h4 class=\"lead-text\">Qualification</h4>
                                <p>${job.qualification}</p>
                                <h4 class=\"lead-text\">Apply</h4>
                                <p><a class=\"link\" href=\"https://careers.google.com/jobs?jlo=ja_JP&hl=ja_JP#!t=jo&jid=/google/2018-%E5%B9%B4%E5%BA%A6%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A2-%E3%82%A8%E3%83%B3%E3%82%B8%E3%83%8B%E3%82%A2%E3%83%AA%E3%83%B3%E3%82%B0-%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%B3-%E6%97%A5%E6%9C%AC-%E6%9D%B1%E4%BA%AC%E9%83%BD-3629560237&\">${job.how_to_apply}</a></p>
                            </div>
                        </div>
                    </div>
                </li>`
            );
        };

        //render students
        const stds = $(data.people).filter(function(i, alumni) {
            return alumni.alumni === "No"
        });

        for (let i = 0; i < stds.length; i++) {
            std = stds[i];
            $("ul#stds").append(
                `<li class=\"person\">
                    <div class=\"row\">
                        <div class=\"col-md-4\">
                            <img src=\"${std.profile_picture}\" />
                        </div>
                        <div class=\"col-md-8\">
                            <h4 class=\"name\">${std.firstName.en} ${std.lastName.en}</h4>
                            <table>
                                <tr>
                                    <td class=\"cell-left\">Position</td>
                                    <td class=\"cell-right position\">${std.position.en}</td>
                                </tr>
                                <tr>
                                    <td class=\"cell-left\">Class</td>
                                    <td class=\"cell-right class\">${std.class}</td>
                                </tr>
                                <tr>
                                    <td class=\"cell-left\">From</td>
                                    <td class=\"cell-right from\">${std.from}</td>
                                </tr>
                                <tr>
                                    <td class=\"cell-left\">Major</td>
                                    <td class=\"cell-right major\">${std.major}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class=\"overlay\">
                        <div class=\"container\">
                            <a href=\"${std.facebook}\" target=\"_blank\" class=\"fa fa-facebook\"></a>
                            <a href=\"${std.linkedin}\" target=\"_blank\" class=\"fa fa-linkedin\"></a>
                        </div>
                    </div>
                </li>`
            );
        };

        //render alumni
        alumni_list = $.grep(data.people, alumni => {
            return alumni.alumni === "Yes"
        });

        //get distinct majors and years
        let majors = [];
        let years = [];
        const people = data.people
        for (i = 0; i < people.length; i++) {
            if (majors.indexOf(people[i].major) === -1) {
                majors.push(people[i].major);
            };
            if (years.indexOf(people[i].class) === -1) {
                years.push(people[i].class);
            };
        };

        //sort majors alphabetically
        majors.sort();
        for (i = 0; i < majors.length; i++) {
            $("select#major").append(`<option>${majors[i]}</option>`);
        };

        //sort by year desc
        years.sort((a, b) => b - a);

        for (i = 0; i < years.length; i++) {
            let year = years[i];
            $("#jsrender").append(
                `<div class=\"yrcnt container-${year}\">
                    <h2 class=\"year\">Class of ${year}</h2>
                    <ul class=\"alumni\" id=${year}></ul>
                </div>`);

            alumni_list = $.grep(data.people, alumni => {
                return alumni.class === year
            });

            for (let i = 0; i < alumni_list.length; i++) {
                alum = alumni_list[i];
                $(`ul.alumni#${year}`).append(
                    `<li class=\"person\">
                    <div class=\"row\">
                        <div class=\"col-md-4\">
                            <img src=\"${alum.profile_picture}" />
                        </div>
                        <div class=\"col-md-8\">
                            <h4 class=\"name\">${alum.firstName.en} ${alum.lastName.en}</h4>
                            <table>
                                <tr>
                                    <td class=\"cell-left\">Class</td>
                                    <td class=\"cell-right class\">${alum.class}</td>
                                </tr>
                                <tr>
                                    <td class=\"cell-left\">Major</td>
                                    <td class=\"cell-right major\">${alum.major}</td>
                                </tr>
                                <tr>
                                    <td class=\"cell-left\">Company</td>
                                    <td class=\"cell-right company\">${alum.company}</td>
                                </tr>
                                <tr>
                                    <td class=\"cell-left\">Location</td>
                                    <td class=\"cell-right location\">${alum.location}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class=\"overlay\">
                        <div class=\"container\">
                            <a href=\"${alum.facebook}" target=\"_blank\" class=\"fa fa-facebook\"></a>
                            <a href=\"${alum.linkedin}" target=\"_blank\" class=\"fa fa-linkedin\"></a>
                        </div>
                    </div>
                </li>`
                );
            };
        };

        //hide years when no one is showing for the year
        const hideYears = () => {
            $(".yrcnt").hide();
            for (let j = 0; j < years.length; j++) {

                let li_block = $($(`ul.alumni#${years[j]}`).children()).filter(function() {
                   return $(this).css('display') == 'block';
                });
                if(li_block.length !== 0){
                    $(`.container-${years[j]}`).show();
                };
            };
        };

        const search = () => {
            let filter = $(".search-box").val().toLowerCase();
            for (let i = 0; i < $("li.person").length; i++) {
                let search_text = $($("li.person")[i]).find('.name').text().toLowerCase() + "," + "," +
                    $($("li.person")[i]).find('.position').text().toLowerCase() + "," +
                    $($("li.person")[i]).find('.class').text().toLowerCase() + "," +
                    $($("li.person")[i]).find('.from').text().toLowerCase() + "," +
                    $($("li.person")[i]).find('.major').text().toLowerCase() + "," +
                    $($("li.person")[i]).find('.company').text().toLowerCase() + "," +
                    $($("li.person")[i]).find('.location').text().toLowerCase();
                if (search_text.indexOf(filter) === -1) {
                    $($("li.person")[i]).hide();
                } else {
                    $($("li.person")[i]).show();
                };
            };
        };

        const filterByMajor = () => {
            let filter = $("select#major").val().toLowerCase();
            if (filter === "all") {
                $("li.person").show();
            } else {
                for (let i = 0; i < $("li.person").length; i++) {
                    if ($($("li.person")[i]).find('.major').text().toLowerCase().indexOf(filter) === -1) {
                        $($("li.person")[i]).hide();
                    } else {
                        $($("li.person")[i]).show();
                    };
                };
            };
        };
        //search bar
        $("select#major").on("keyup", () => {
            if($('.search-box').val() != ""){
                console.log("major")
                filterByMajor();
            };
            search();
            hideYears();
        });

        //scholl filter
        // $("select#school").on("change", () => {
        //     let filter = $("select#school").val().toLowerCase();
        //     if (filter === "all") {
        //         $("li.person").show();
        //     } else {
        //         for (let i = 0; i < $("li.person").length; i++) {
        //             if ($($("li.person")[i]).find('.school').text().toLowerCase().indexOf(filter) === -1) {
        //                 $($("li.person")[i]).hide();
        //             } else {
        //                 $($("li.person")[i]).show();
        //             };
        //         };
        //     };
        //     hideYears();
        // });

        //major filter
        $("select#major").on("change", () => {
            if($('.search-box').val() != ""){
                console.log("search")
                search();
            };
            filterByMajor();
            hideYears();
        });

        //event photo
        $(".event").on("mouseenter", event => {
            $(event.currentTarget).find(".overlay").fadeIn(250);
        });
        $(".event").on("mouseleave", event => {
            $(event.currentTarget).find(".overlay").fadeOut(250);
        });

        //social media
        $(".person").on("mouseenter", event => {
            $(event.currentTarget).find(".overlay").fadeIn(250);
        });
        $(".person").on("mouseleave", event => {
            $(event.currentTarget).find(".overlay").fadeOut(250);
        });

        //count up
        function chart() {
            done = false;
            const update_chart = () => {
                google.charts.load('current', {
                    'packages': ['corechart']
                });
                google.charts.setOnLoadCallback(chart1);
                google.charts.setOnLoadCallback(chart2);
                let num_ns = parseInt($('#num-ns').text());
                let num_nns = parseInt($('#num-nns').text());

                function chart1() {
                    const data = google.visualization.arrayToDataTable([
                        ['Number of Japanese', 'Category'],
                        ['Native', max_ns],
                        ['Non-Native', num_nns],
                    ]);
                    const option1 = {
                        title: 'Native vs Non-Native Japanese Speakers',
                        titlePosition: 'none',
                        colors: ['#020372', '#0073e6'],
                        backgroundColor: 'none',
                        pieHole: 0.5,
                        chartArea: {
                            width: '100%',
                            height: '90%'
                        },
                        legend: {
                            textStyle: {
                                color: '#f2f2f2'
                            },
                            position: 'labeled',
                        },
                        titleTextStyle: {
                            color: '#f2f2f2'
                        },
                        pieSliceBorderColor: "none",
                        reverseCategories: "true"
                    };
                    const chart = new google.visualization.PieChart(document.getElementById('chart1'));
                    chart.draw(data, option1);
                }

                function chart2() {
                    const data = google.visualization.arrayToDataTable([
                        ['Number of Japanese', 'Category'],
                        ['Native', 10],
                        ['Non-Native', 60],
                    ]);
                    const option2 = {
                        title: 'Native vs Non-Native Japanese Speakers',
                        titlePosition: 'none',
                        colors: ['#020372', '#0073e6'],
                        backgroundColor: 'none',
                        pieHole: 0.5,
                        chartArea: {
                            width: '100%',
                            height: '90%'
                        },
                        legend: {
                            textStyle: {
                                color: '#f2f2f2'
                            },
                            position: 'labeled',
                        },
                        titleTextStyle: {
                            color: '#f2f2f2'
                        },
                        pieSliceBorderColor: "none",
                        reverseCategories: "true"
                    };
                    const chart = new google.visualization.PieChart(document.getElementById('chart2'));
                    chart.draw(data, option2);
                }
            };

            //all members
            // function ()
            const max_mem = parseInt($('#max-mem').text());
            const update_num_mem = () => {
                let count = parseInt($('#num-mem').text());
                count++;
                $('#num-mem').text(count);
            };
            const count_up_mem = setInterval(() => {
                update_num_mem();
                if (parseInt($('#num-mem').text()) === max_mem) {
                    clearInterval(count_up_mem);
                };
            }, 50);

            //selector, max,
            //native speakers
            const max_ns = parseInt($('#max-ns').text());
            const update_num_ns = () => {
                let count = parseInt($('#num-ns').text());
                count++;
                $('#num-ns').text(count);
            };
            const count_up_ns = setInterval(() => {
                update_num_ns();
                if (parseInt($('#num-ns').text()) === max_ns) {
                    clearInterval(count_up_ns);
                };
            }, 50);

            //non-native speakers
            const max_nns = parseInt($('#max-nns').text());
            const update_num_nns = () => {
                let count = parseInt($('#num-nns').text());
                count++;
                $('#num-nns').text(count);
            };
            const count_up_nns = setInterval(() => {
                update_num_nns();
                if (parseInt($('#num-nns').text()) === max_nns) {
                    clearInterval(count_up_nns);
                };
            }, 50);

            //update chart
            const count_up_chart = setInterval(() => {
                update_chart();
                if (parseInt($('#num-mem').text()) === max_mem) {
                    clearInterval(count_up_chart);
                };
            }, 25);
            done = true;
        };
    });
});