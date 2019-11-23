$(document).ready(function() {
    $('a').smoothScroll();

    $('.slick-track').slick({
        dots: true,
    });

    $('button.slick-next').click(function(e) {
        $(".slick-track").slick('slickNext');
    });
    $('button.slick-prev').click(function() {
        $(".slick-track").slick('slickPrev');
    });

    $('.slick-dots>li').click(function(e) {

        e.preventDefault();

        //disable all active
        $(".slick-dots>li>img").each(function() {
            var src = $(this).attr("src")
            $(this).attr("src", src.replace('-active', ''));
        });

        //active
        var childSrc = $(this).children('img')
        childSrc.attr('src', childSrc.attr('src').replace('.png', '-active.png'))

        var slideno = $(this).data('slide');
        $('.slick-track').slick('slickGoTo', slideno - 1);


    });

    //change active when click next, prev
    $('.slick-track').on('beforeChange', function(event, slick, currentSlide, nextSlide) {
        var CurrentSlideDom = $(slick.$slides.get(currentSlide));
        var dataId = $(slick.$slides[nextSlide]).data('index');

        /* var list = $(".slick-dots>li>img")
        list.each(function() {
            var src = $(this).attr("src")
            $(this).attr("src", src.replace('-active', ''));
        });

        //active
        var childSrc = $(list[dataId]);
        console.log(dataId);
        childSrc.attr('src', childSrc.attr('src').replace('.png', '-active.png')) */

    });
});

function makeTimer() {

    //		var endTime = new Date("29 April 2018 9:56:00 GMT+01:00");	
    var endTime = new Date("01 December 2019 9:56:00 GMT+01:00");
    endTime = (Date.parse(endTime) / 1000);

    var now = new Date();
    now = (Date.parse(now) / 1000);

    var timeLeft = endTime - now;

    var days = Math.floor(timeLeft / 86400);
    var hours = Math.floor((timeLeft - (days * 86400)) / 3600);
    var minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600)) / 60);
    var seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));

    if (hours < "10") { hours = "0" + hours; }
    if (minutes < "10") { minutes = "0" + minutes; }
    if (seconds < "10") { seconds = "0" + seconds; }

    $("#days").html(days);
    $("#hours").html(hours);
    $("#minutes").html(minutes);
    $("#seconds").html(seconds);

}

setInterval(function() { makeTimer(); }, 1000);