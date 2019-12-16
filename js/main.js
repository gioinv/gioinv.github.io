$(document).ready(function () {
  var regist_msg = 'Chúc mừng bạn đã nhận được ưu đãi từ MMTN.VN!';
  var consult_msg = 'Chúc mừng bạn đã gửi câu hỏi thành công tới MMTN.VN!';
  var errorMsg = 'Không thể gửi thông tin!\n Vui lòng lien lạc ban quản trị để biết thông tin chi tiết.';

  $('a').smoothScroll();

  $('.student-feedback').slick({
    autoplay: true,
    arrows: true
  });

  $("form#tuvan").on("submit", function (e) {
    e.preventDefault();
    $('#spinTv').show()
    $.ajax({
      url: "https://script.google.com/macros/s/AKfycbzctdc_JfS_0IYKpYzBvS9NlHWeHWg6jHGHR08s-NoTE-2QWsU9/exec",
      type: "POST",
      data: {
        anhchi: $('#anhchiTv').val(),
        hoten: $('#hotenTv').val(),
        sdt: '\'' + $('#sdtTv').val(),
        cauhoi: $('#cauhoiTv').val()
      },
      contentType: "application/javascript",
      dataType: 'jsonp'
    })
      .done(function (res) {
        console.log('success')
        $('#spinTv').hide()
      })
      .fail(function (e) {
        console.log("error")
        $('#spinTv').hide()
      });

    window.receipt = function (res) {
      if (res.success) {
        $('#message').text(consult_msg);

        $('#successModal').modal('show');
        $("form#tuvan").trigger("reset");
      } else {
        alert(errorMsg);
      }

      $('#spinTv').hide()
    }
  });
  
  $("form#dangky").on("submit", function (e) {
    e.preventDefault();
    $('#spinDk').show()
    
    $.ajax({
      url: "https://script.google.com/macros/s/AKfycbzRGoHL1kOxkVbdfvuhMNI_06eZI1dSlpJ-Ti9XpJB7XUJH5aU/exec",
      type: "POST",
      data: {
        anhchi: $('#anhchi').val(),
        hoten: $('#hoten').val(),
        sdt: '\'' + $('#sdt').val(),
        email: $('#email').val()
      },
      contentType: "application/javascript",
      dataType: 'jsonp'
    })
      .done(function (res) {
        console.log('success')
        $('#spinDk').hide()
      })
      .fail(function (e) {
        console.log("error")
        $('#spinDk').hide()
      });

    window.receipt = function (res) {
      
      if (res.success) {
        $('#message').text(regist_msg);
        $('#successModal').modal('show');
        $("form#dangky").trigger("reset");
      } else {
        alert(errorMsg);
        $('#spinDk').hide()
      }

      $('#spinDk').hide()
    }
  });

});

function makeTimer() {

  //		var endTime = new Date("29 April 2018 9:56:00 GMT+01:00");	
  var endTime = new Date("12 December 2019 0:00:00 GMT+01:00");
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

setInterval(function () { makeTimer(); }, 1000);