layui.use(['jquery', 'layer', 'util'], function () {
    var $ = layui.jquery,
        layer = layui.layer,
        util = layui.util;
    util.fixbar();
    //导航控制remarkEditor
    master.start($);
});
var slider = 0;
var pathname = window.location.pathname.replace('Read', 'Article');
var master = {};
master.start = function ($) {
    $('#nav li').hover(function () {
        $(this).addClass('current');
    }, function () {
        var href = $(this).find('a').attr("href");
        if (pathname.indexOf(href) == -1) {
            $(this).removeClass('current');
        }
    });
    selectNav();
    function selectNav() {
        var navobjs = $("#nav a");
        $.each(navobjs, function () {
            var href = $(this).attr("href");
            if (pathname.indexOf(href) != -1) {
                $(this).parent().addClass('current');
            }
        });
    };
    $('.phone-menu').on('click', function () {
        $('#nav').toggle(500);
    });
    $(".blog-user img").hover(function () {
        var tips = layer.tips('点击退出', '.blog-user', {
            tips: [3, '#009688'],
        });
    }, function () {
        layer.closeAll('tips');
    })
};
