$(document).ready(() => {
    //dynamically render contents from JSON
    $.getJSON("https://s3.amazonaws.com/byujsa.com/scripts/Data.json", data => {
        //scroll to stop
        $("html,body").scrollTop(0);

        let i, j = 0;
        let category, ul, member = "";
        for (i = 0; i < data.leader.length; i++) {
            category = data.leader[i].category;
            $(".col-md-3.category").append(`<h3 class=\"role\" id=\"${category}\">${category}</h3>`);
            ul = `<ul id=\"${category}\">`;
            $(".col-md-9.leader").append(ul);
            for (j = 0; j < data.leader[i].member.length; j++) {
                member = data.leader[i].member[j];
                //tiles
                $(`ul#${category}`).append(
                    `<li class=\"person\">
                        <div class=\"row\">
                            <div class=\"col-md-4\">
                                <img src=\"${member.profile_picture}\" width=125px/>
                            </div>
                            <div class=\"col-md-8\">
                                <h4 class=\"position eng\">${member.position.en}</h4>
                                <h4 class=\"position jp\">${member.position.jp}</h4>

                                <h4 class=\"name eng\">${member.firstName.en+" "+member.lastName.en}</h4>
                                <h4 class=\"name jp\">${member.lastName.jp+" "+member.firstName.jp}</h4>
                            </div>
                            <div class=\"overlay\">
                                <a href=\"${member.facebook}\" target=\"_blank\" class=\"fa fa-facebook\"></a>
                                <a href=\"${member.linkedin}\" target=\"_blank\" class=\"fa fa-linkedin\"></a>
                            </div>
                        </div>
                    </li>`
                );
                //descriptions
                $(".comment-box").append(
                    `<table class=\"comment\" id=\"${member.firstName.en}-${member.lastName.en}\">
                        <tr>
                            <td class=\"align-right\">Major :</td>
                            <td class=\"align-left\">${member.major}</td>
                        </tr>
                        <tr>
                            <td class=\"align-right\">From :</td>
                            <td class=\"align-left\">${member.from}</td>
                        </tr>
                        <tr>
                            <td class=\"align-right\">Company :</td>
                            <td class=\"align-left\">${member.company}</td>
                        </tr>
                        <tr>
                            <td class="align-center" colspan="2">${member.comment}</td>
                        </tr>
                    </table>`
                );
            };
        };
        $(`h3#${data.leader[0].category}`).addClass("active");
        $(`ul#${data.leader[0].category}`).addClass("active");

        //loader functions
        const onReady = callback => {
            const intervalID = window.setInterval(checkReady, 250);

            function checkReady() {
                if (document.getElementsByTagName('body')[0] !== undefined) {
                    window.clearInterval(intervalID);
                    callback.call(this);
                };
            };
        };

        onReady(() => {
            //hide page content of page2 to page last so that the content can be loaded based on event
            for (let i = 2; i <= $('.page').length; i++) {
                $(`#page${i}`).children().hide();
            };

            $('.s1').hide();
            $('.s2').hide();
            $('.seve').hide(() => {
                $('#loader-container').fadeOut(750, () => {
                    //slide in contents
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
                                            $('.s2').fadeIn(1000);
                                        }, 500);
                                    }
                                });
                            }, 500);
                        }
                    });
                });
            });
        });

        // function ShowItems(items, delay) {
        //     $(items[0]).fadeIn(50)
        //         .delay(delay)
        //         .promise()
        //         .done(function() {
        //             items.splice(0, 1);
        //             if (items.length > 0)
        //             {
        //                 ShowItems(items, delay);
        //             }
        //     });
        // };

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
            $('#ut-time').text(`${h}:${m}:${s}`);
            $('#jp-time').text(`${jp_h}:${m}:${s}`);
            let t = setTimeout(startTime, 500);
        }

        function checkTime(i) {
            if (i < 10) {
                i = "0" + i
            }; // add zero in front of numbers < 10
            return i;
        }

        //when leadership category click, show people
        $('h3.role').on('click', event => {
            if ($(event.currentTarget).attr('class') != 'role active') {
                $('h3.role').removeClass('active');
                $(event.currentTarget).addClass('active');

                const id = '#' + $('h3.active').attr('id');
                $('.col-md-9').find('ul').hide();
                $('.col-md-9').find(id).fadeIn();
            }
        })

        //when scroll, scroll a whole page
        // const divs = $('.page');
        // let dir = 'up'; // wheel scroll direction
        // let div = 0; // current div
        // $(document.body).on('DOMMouseScroll mousewheel', e => {
        //     if (e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) {
        //         dir = 'down';
        //     } else {
        //         dir = 'up';
        //     }
        //     // find currently visible div :
        //     div = -1;
        //     divs.each(function(i) {
        //         if (div < 0 && ($(this).offset().top >= $(window).scrollTop())) {
        //             div = i;
        //         }
        //     });
        //     if (dir == 'up' && div > 0) {
        //         div--;
        //     }
        //     if (dir == 'down' && div < divs.length) {
        //         div++;
        //     }
        //     //console.log(div, dir, divs.length);
        //     $('html,body').stop().animate({
        //         scrollTop: divs.eq(div).offset().top
        //     }, 750);
        //     return false;
        // });
        // $(window).resize(function() {
        //     $('html,body').scrollTop(divs.eq(div).offset().top);
        // });

        //when scroll button is clicked, scrolls
        $('.scroll-button').on('click', event => {
            $('html, body').animate({
                scrollTop: $('.scroll-button').offset().top + $('.scroll-button').height() + Number($('.scroll-button').css('bottom').replace('px', ''))
            }, 750);
        });

        //when scrolls, hide scroll button and commentbox. show scroll button again when at top
        $(window).on('scroll', () => {
            $('.comment-box').hide('slide', {
                direction: 'right'
            }, 500);
        });

        $(window).on('scroll', event => {
            //when scroll show page content
            for (let i = 1; i < $('.page').length; i++) {
                if ($(this).scrollTop() >= 895 * i - 145) {
                    $(`#page${i+1}`).children().fadeIn(1000);
                };
            };
        });

        //when mouse enters in to person, show jp text and pull detail box to left
        $('.person').on('mouseenter', event => {
            $(event.currentTarget).find('.overlay').slideDown(250);
            $(event.currentTarget).find('.eng').hide();
            $(event.currentTarget).find('.jp').show();
            $('.comment-box').show('slide', {
                direction: 'right'
            }, 500);

            //comment
            let id = '#' + $(event.currentTarget).find('.name.eng').text().replace(' ', '-');
            $('.comment').hide(0, () => {
                $(id).show();
            });
        });
        $('.person').on('mouseleave', event => {
            $(event.currentTarget).find('.overlay').slideUp(250);
            $(event.currentTarget).find('.jp').hide();
            $(event.currentTarget).find('.eng').show();
        });

        //opportunities
        $('.opp-content').hide();
        $('.opp-item').on('click', event => {
            $(event.currentTarget).next().slideToggle();
        });
    });
});