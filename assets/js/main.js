(function ($) {

    var $window = $(window),
        $body = $('body'),
        $nav = $('#nav');
    settings = {

        // Carousels
        carousels: {
            speed: 4,
            fadeIn: true,
            fadeDelay: 250
        },

    };

    // Breakpoints.
    breakpoints({
        xlarge: ['1281px', '1680px'],
        large: ['981px', '1280px'],
        medium: ['737px', '980px'],
        small: [null, '736px']
    });

    // Play initial animations on page load.
    $window.on('load', function () {
        window.setTimeout(function () {
            $body.removeClass('is-preload');
        }, 100);
    });

    // Scrolly.
    $('#nav a, .scrolly').scrolly({
        speed: 1000,
        offset: function () {
            return $nav.height();
        }
    });

})(jQuery);