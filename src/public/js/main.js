function repositionFooter() {
  var docHeight = $(window).height();
  var footerHeight = $('footer').height();
  var footerTop = $('footer').position().top + footerHeight;

  if (footerTop < docHeight) {
    $('footer').css('margin-top', 10 + (docHeight - footerTop) + 'px');
  }
}

$(function() {
  deeplink.setup({
      iOS: {
          appName: "often-search-collect-share",
          appId: "1053313047",
      }
  });
  
  var $submitButton = $('#mc-embedded-subscribe');

  $('#mce-email').keyup(function() {
    var length = $(this).val().length;
    $submitButton.prop("disabled", length == 0);
  });

  $submitButton.click(function() {
    $('#myModal').modal();

    var $form = $('#mc-embedded-subscribe-form');
    $form.submit(function(e) {
      e.preventDefault();
      var rand = Math.floor(Math.random() * 10000);
      
      $.ajax({
        url: $form.attr('action'),
        type: $form.attr('method'),
        jsonp: 'c',
        cache: false,
        dataType: 'jsonp',
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
        data: $form.serialize(),
        success: function(data) {
          console.log("it worked", data);
        },
        error: function() {
          console.log("error");
        }
      });
    });
  });

  String.prototype.decodeHTML = function() {
    return $("<div>", {html: "" + this}).html();
  };

  var $main = $(".main-content"),
  
  init = function() {
    // Do this when a page loads.
    if (window.location.pathname.startsWith('/pack/')) {
      filterItems($('.tab.selected').attr('id'));
    }

    $('.main-nav .navbar-collapse').collapse('hide');
    window.scrollTo(0, 0);
    repositionFooter();
  },
  
  ajaxLoad = function(html) {
    document.title = html
      .match(/<title>(.*?)<\/title>/)[1]
      .trim()
      .decodeHTML();

    init();
  },
  
  loadPage = function(href) {
    $main.load(href + " .main-content>*", ajaxLoad);
  };
  
  init();
  
  $(window).on("popstate", function(e) {
    if (e.originalEvent.state !== null) {
      loadPage(location.href);
    }
  });

  $(document).on("click", "a, area", function() {
    var href = $(this).attr("href");

    if (href.indexOf(document.domain) > -1
      || href.indexOf(':') === -1)
    {
      history.pushState({}, '', href);
      loadPage(href);
      return false;
    }
  });

  repositionFooter();
});