$(document).ready(function () {

    /*fixed header*/
    $(window).scroll( function () {

        if ( $(this).scrollTop() > 1) {
            $('.header').addClass("js-header-fixed");
        }  else {
            $('.header').removeClass("js-header-fixed");
        }

    });
    /*close script*/

    /*header mobile menu*/
    $(document).on('click', '#mobile-menu', function (event) {
        var menu = $(this).parent().find('.header__nav');
        event.preventDefault();
        if ($(this).hasClass('js-trigger-active')) {
            $(this).removeClass('js-trigger-active');
            menu.slideUp('slow');
        } else {
            $(this).addClass('js-trigger-active');
            menu.slideDown('slow');
        }
        return false;
    });
    // if (window.innerWidth < 670) {
    //     $(document).on('click', function (e) {
    //         if ($(e.target).closest('.header__navigation').length != 1) {
    //             $('.header__nav').slideUp('fast');
    //             $('#burger').removeClass('show');
    //         }
    //     });
    // }
    /*close header mobile menu*/

    /*animate scroll menu*/
    $(document).on('click', '.header__nav a', function (event) {
        event.preventDefault();
        var href = $(this).attr('href'),
            header = $('.header').height(),
            target = $(href),
            top = target.offset().top - header;
        if($(this).hasClass('js-link-active')) {
            $(this).removeClass('js-link-active');
            $('html, body').animate({scrollTop: 0}, 'slow');
        } else {
            $('.header__nav li a').removeClass('js-link-active');
            $(this).addClass('js-link-active');
            $('html,body').animate({scrollTop: top}, 1000);
        }
        return false;
    });
    /*close animate scroll menu*/

    /*profile blocks*/
    $(document).on('click', '.profile__wrapper--element', function (event) {
        event.preventDefault();
        if( $(this).hasClass('js-active-element') ) {
            $(this).removeClass('js-active-element');
        } else {
            $('.profile__wrapper--element').removeClass('js-active-element');
            $(this).addClass('js-active-element');
        }
    });
    /*close*/

    /*video tabs*/
    $('.video__tabs-wrapper--box').each(function (i) {
        if (i != 0) {
            $(this).hide(0)
        }
    });
    $(document).on('click', '.video__tabs a', function (event) {
        event.preventDefault();
        var tabId = $(this).attr('href');
        $('.video__tabs a').removeClass('video__tabs--active');
        $(this).addClass('video__tabs--active');
        $('.video__tabs-wrapper--box').hide(0);
        $(tabId).fadeIn();
    });
    /*close script*/

    /*go to top*/
    $('#go-top').click(function (event) {
        event.preventDefault();
        $('html, body').animate({scrollTop: 0}, 'slow');
        $('.header__nav li a').removeClass('js-link-active');
    });

    $(window).scroll(function () {
        if ($(this).scrollTop() != 0) {
            $('#go-top').fadeIn();
        } else {
            $('#go-top').fadeOut();
        }
    });
    /*close script*/

    /*form validation*/
    $('#contacts-name, #contacts-email, #contacts-textarea').unbind().blur(function () {

        var id = $(this).attr('id');
        var val = $(this).val();

        switch (id) {
            case 'contacts-name':
                var rv_name = /^[a-zA-Zа-яА-Я]+$/;
                if (val.length > 2 && val != '' && rv_name.test(val)) {
                    $(this).removeClass('error').addClass('not_error');
                } else {
                    $(this).removeClass('not_error').addClass('error');
                }
                break;

            case 'contacts-email':
                var rv_email = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
                if (val != '' && rv_email.test(val)) {
                    $(this).removeClass('error').addClass('not_error');
                } else {
                    $(this).removeClass('not_error').addClass('error');
                }
                break;

            case 'contacts-textarea':
                if (val != '' && val.length < 5000) {
                    $(this).removeClass('error').addClass('not_error');
                } else {
                    $(this).removeClass('not_error').addClass('error');
                }
                break;

        } // end switch(...)

    }); // end blur()
    $('#contacts-form').submit(function (event) {
        event.preventDefault();
        var name = $('#contacts-name').val(),
            mail = $('#contacts-email').val(),
            message = $('#contacts-textarea').val();
        $.ajax({
            url: myajax.url,
            type: "POST",
            data: {
                action: 'contact',
                name: name,
                mail: mail,
                message: message
            },
            success: function(data){
                $('#contact-form input:text, textarea').val('').removeClass('error, not_error').text('');
                // alert(data);
            }
        }); // end ajax({...})
        return false;
    }); // end submit()

    $('#footer-textarea').unbind().blur(function () {

        var id = $(this).attr('id');
        var val = $(this).val();

        switch (id) {

            case 'footer-textarea':
                if (val != '' && val.length < 5000) {
                    $(this).removeClass('error').addClass('not_error');
                } else {
                    $(this).removeClass('not_error').addClass('error');
                }
                break;

        } // end switch(...)

    }); // end blur()
    $('#footer-form').submit(function (event) {
        event.preventDefault();
        var message = $('#footer-textarea').val();
        $.ajax({
            url: myajax.url,
            type: "POST",
            data: {
                action: 'massage',
                message: message
            },
            success: function(data){
                $('#contact-form input:text, textarea').val('').removeClass('error, not_error').text('');
                // alert(data);
            }
        }); // end ajax({...})
        return false;
    }); // end submit()
    /*close script*/

    /*show map trigger*/
    $(document).on('click', '.contacts__map--trigger', function (event) {
        event.preventDefault();
        var hover_block = $(this).parent();
        hover_block.fadeOut('slow');
    });
    /*close scriot*/

});