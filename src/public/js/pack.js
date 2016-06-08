deeplink.setup({
    iOS: {
        appName: "often-search-collect-share",
        appId: "1053313047",
    }
});

function filterItems(type) {
    $('.item').fadeOut();
    $('.item.'+type).fadeIn();
}

$(document).on('click', '.tab', function(e) {
    var selectedTab = $('.tab.selected');
    var tab = $(e.target);

    if (selectedTab.attr('id') === tab.attr('id')) {
        return;
    }

    selectedTab.removeClass('selected');
    tab.addClass('selected');

    filterItems(tab.attr('id'));
});

$('.download-btn').click(function(e) {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        e.preventDefault();
        var link = $(this).attr('href');
        deeplink.open(link);
    } else {
       window.location = 'http://oftn.me/app';
    }
});

filterItems($('.tab.selected').attr('id'));

$('.nano').nanoScroller();