(function ($) {
    "use strict";

    jQuery(document).ready(function ($) {
        $(document).on('submit', '#contact_form_submit', function (e) {
            e.preventDefault();
            var first_name = $('#first_name').val();
            var last_name = $('#last_name').val();
            var email = $('#email').val();
            var subject = $('#subject').val();
            var company_name = $('#company_name').val();
            var message = $('#message').val();
            var house = $('#house').val();
            var postcode = $('#postcode').val();

            if (first_name && last_name && subject && email && message) {
                $.ajax({
                    type: "POST",
                    url: 'contact.php',
                    data: {
                        'first_name': first_name,
                        'last_name': last_name,
                        'email': email,
                        'subject': subject,
                        'company_name': company_name,
                        'message': message,
                        'house': house,
                        'postcode': postcode,
                    },
                    success: function (data) {
                        $('#contact_form_submit').children('.email-success').remove();
                        $('#contact_form_submit').prepend('<span class="alert alert-success email-success">' + data + '</span>');
                        $('#first_name').val('');
                        $('#company_name').val('');
                        $('#last_name').val('');
                        $('#subject').val('');
                        $('#house').val('');
                        $('#email').val('');
                        $('#postcode').val('');
                        $('#message').val('');
                        $('.email-success').fadeOut(3000);
                    },
                    error: function (res) {

                    }
                });
            } else {
                $('#contact_form_submit').children('.email-success').remove();
                $('#contact_form_submit').prepend('<span class="w-100 alert alert-danger email-success">All Fields are Required.</span>');
                $('.email-success').fadeOut(3000);
            }

        });
    })

}(jQuery));