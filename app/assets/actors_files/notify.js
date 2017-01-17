(function($) {
$(document).bind('discuss.post', function(e, args) {
    $.post('/list/_ajax/log_discussion', args);
});
})(jQuery);
