(function($) {
jQuery("div.list div.ll_watchnow").appear(function() {
    var $watchnow = $(this);
    var tconst = $watchnow.attr('data-id');
    var movies_showing_nearby = $('.article.listo .movies-showing-nearby').attr('data-tconsts');
    $watchnow.removeClass('ll_watchnow');    
    $.ajax({
        url: '/list/_ajax/watchitnow',
        type: 'POST',
        data: {
            tconst:tconst,
            movies_showing_nearby: movies_showing_nearby
        },
        beforeSend: window.addClickstreamHeadersToAjax,
        error: function(){},
        success: function(data) {
            if (data.status == 200) {
                $watchnow.html(data.html);
            }
        }
    });
});
jQuery.widget('ui.list_view', {
    options: {
        ajaxURL: '/list/_ajax/',
        start: 1,
        limit: 250,
        listSize: 0
    },
    _init: function() {
        var self = this;
        var o = self.options;
        var $listo = $(self.element);
        var listId = $listo.attr('data-list-id');
        var listClass = $listo.attr('data-list-class');
        var listType = $listo.attr('data-list-type');
        var $header = $('div.header', $listo);
        var $viewB = $('.views a', $header);

        var $dests = $('select.destination', $header); // Bulk operations destinations <select>
        var $bulkI = $('.bulk button', $header).attr('disabled', true);
        var $sortable = $('th.sortable', $listo);
        var $deleteB = $('.list_item .delete', $listo);

        var $discussions = $('input.list_comments', $header);
        var $list_public = $('input.list_public', $header);
        var $email_opt_out = $('input#email_opt_out', $header);

        // TODO: reset select to prevent page reload carryover
        var $sorts = $('select.sort_field', $header);
        var $sortDB = $('.sort button', $header);
        var $sortR = $('input:checkbox', $header);
        var $checks = $('.check input:checkbox', $listo);
        var sortF = $sorts.val();
        var sortD = $sortDB.attr('data-direction');
        var view = $('.views', $header).attr('data-current');
        var listsLoaded = false;
        var itemSelectionStarted = false;

        $listo.bind('reload', function() {
            $('input', $listo).attr('disabled', true);
            var start = '?start=1';
            var paging = window.location.search.match(/[?&](start=\d+)/);
            if (paging) {
                start = '?' + paging[1];
            }
            
            // Cache buster for Safari.
            // Jira: https://jira2.amazon.com/browse/IMDBENGAGE-820.
            // Since jQuery browser detection does not distinguish (currently) between
            // Safari and Chrome (both Chrome and Safari say $.browser.safari == true and
            // $.browser.webkit == true), we use the following testing.
            // Browser detection based on http://api.jquery.com/jQuery.browser/.
            // Fix for Chrome vs Safari: http://stackoverflow.com/questions/3303858/distinguish-chrome-from-safari-using-jquery-browser
            var safari_cache_buster = '',
                is_safari = $.browser.webkit && /safari/.test( navigator.userAgent.toLowerCase() );
            if ( is_safari ) {
                safari_cache_buster = '&scb=' + Math.random();
            }
            
            document.location = start + '&view=' + view + '&sort=' + sortF + ':' + sortD + filter_get_params() + safari_cache_buster;
        });

        // INIT ACTIONS

        // Handle user changing sort field via <select>
        $sorts
            .change(function() {
                sortF = $(this).val();
                sortD = $(':selected', $(this)).attr('data-direction');
                $listo.trigger('reload');
            })
            .attr('disabled', false);

        // Handle user toggling sort direction
        $sortDB
            .click(function() {
                sortD = (sortD == 'asc') ? 'desc' : 'asc';
                $listo.trigger('reload');
            })
            .attr('disabled', false);

        // Handle user changing view
        $viewB
            .click(function() {
                var newView = $(this).attr('data-view');
                if (newView != view) {
                    view = newView;
                    $listo.trigger('reload')
                }
            });

        // clicking on column header to sort compact view
        $listo.delegate('.listo th.sortable', 'click', function() {
            sortD = $(this).attr('data-dir');
            sortF = $(this).attr('data-field');
            // We will always reload as either the field or the direction is changing
            $listo.trigger('reload');
        });

        // Bind rating buttons.
        self.bindRatingButtons();

        // Attach handler and turn on delete buttons
        $listo.delegate( '.list_item .delete', 'click', function() {
            var $b = $(this);
            if ($b.hasClass('pending')) {
                // Double click; ignore
                return;
            }
            $b.addClass('pending');
            message( "Removing items...", "in-progress" );
            var $item = $b.closest('.list_item').fadeTo(0, 0.5);
            doAjax({
                method: 'edit',
                data: {
                    action: 'delete',
                    list_item_id: $item.attr('data-list-item-id'),
                    list_id: $listo.attr('data-list-id')
                },
                error: function() {
                    $item.fadeTo(0, 1);
                    $b.removeClass('pending');
                    message ("An error occured removing the items.", "error" );
                },
                success: function() {
                    if (view == "grid") {
                        $item.fadeTo( 0, 1);
                        $item.find("img").fadeTo(0,0.1);
                        $b.removeClass('pending');
                        $item.html( $item.html() + "<div class='deleted'>Title has been removed from this list.</div>");
                        $item.addClass('deleted'); // Stop showing delete 
                    } else {
                        $item.fadeTo('slow', 0).slideUp(function() {
                            $item.remove();
                        });
                        var number = Math.floor($('.number', $item).html()); // Cheaters way of removing the "."
                        if (number == undefined) {
                            // Numbers not shown in this view/sort.  Detect from existing odd/even class name
                            number = $item.hasClass('odd') ? 0 : 1;
                        }
                        $item.nextAll().each(function() {
                            $(this).removeClass('odd even').addClass( number % 2 ? 'odd' : 'even');
                            $('.number', $(this)).html(number + '.');
                            number++;
                        });
                        clearMessage();
                    }
                }
            });
        });
        
        if (view == 'detail') {
            $deleteB.show();
        }

        // Fetch the lists of lists. 
        if ( view == 'compact' ) { 
            fetchLists( null );
        }
        
        // We explictly set as disabled due to input states surviving reloads
        $dests.attr('disabled', true);
        $('.bulk', $header).show().trigger('check');

        /*
        * Browsers sometimes preserve the state of inputs across
        * reloads, so we manually clear it here.
        */
        $checks.attr('checked', false)
            .attr('disabled', false);

        // When rows are selected, trigger a handler
        $listo.delegate('.listo .list .check', 'click', function(){ doCheck( $(this) ); });

        // Whenever we toggle a checkbox we need to decide whether to (dis)enable the bulk move select box
        $header.bind('check', function() { doCheckHeader( true )});

        // Toggle all checkboxes when the header icon is clicked
        $('th.check', $listo).click(function() {
            $checks.attr('checked', !$checks.attr('checked'));
            $header.trigger('check'); 
        });

        // Copy the <option> class to <select> whenever it changes
        $listo.delegate('select.destination', 'change', function() {
            if ( $(':selected', $(this)).val() == "new" ) {
                showNewListDialog();
            }   
        });
        // Create a delegate to add the ability to update '.message' from other ui widgets (save_reordering for instance)
        // using the same message(..) interface as is used here.
        $listo.delegate( '.message', 'updatemessage', function( event, msg, type ) { message( msg, type ); } );
        

        function listCreateBtnClicked() {
            message( "Creating your new list...", "in-progress" );
            $dests.attr( 'disabled', true );
            var list_name = $('#cboxLoadedContent #new_list_name').val();
            var new_list_public =  $('input.list_public:checked').val();
            var enable_discussions = $('#cboxLoadedContent input.list_comments').is(':checked') ? "YES" : "NO";
            var email = $('#cboxLoadedContent input.email_pref').is(':checked') ? 0 : 1;
            doAjax({
                method: 'create_list',
                data: {
                    list_type: listType,
                    list_name: list_name
                },
                error: function(data) {
                    message("Sorry, an error occured creating your new list. Please try again.", "error");
                },
                success: function(data) {
                    if (data.status != 200) {
                        message("Sorry, an error occured creating your new list. Please try again.", "error");
                        return;
                    }

                    // Set the list privacy
                    doAjax({
                        data: {
                            'public': new_list_public,
                            action: 'privacy',
                            list_id: data.list_id
                        },
                        method: 'edit',
                        success: function( data ) { },
                        failure: function( data ) { message("Unable to set list privacy.", "error"); }
                    });
    
                    // Set list comments
                    doAjax({
                        data: {
                            enable_discussions: enable_discussions,
                            list_id: data.list_id
                        },
                        method: 'edit',
                        success: function( data ) { },
                        failure: function( data ) { message("Unable to set list comments.", "error"); }
                    });

                    // Set the email preferences
                    doAjax({
                        data: {
                            action: 'email_opt_out',
                            list_id: data.list_id,
                            no_email: email
                        },
                        method: 'edit',
                        success: function( data ) { },
                        failure: function( data ) { message("Unable to set email prefs.", "error"); }
                    });

                    // Perform the copy or move
                    performMoveOrCopy( data.list_id, list_name, null );

                    // Reload the lists dropdown, pre-selected the returned list
                    fetchLists( data.list_id );
                }
            });

            closeNewListDialog(); 
            $dests.attr( 'disabled', false );
        };



        // Handle bulk operations
        $listo.delegate('.bulk button', 'click', function() {
            // Disable the checkboxes, the bulk <select> and bulk buttons
            // $checks.add($dests).add($bulkI).attr('disabled', true);

            // If the user has selected "New list..." then show the new list dialog.
            var action = $(this).attr('data-action');
            if ( $dests.val() == "new" && action != 'delete' ) {
                showNewListDialog();
                return;
            } else {
                performMoveOrCopy( null, null, action );
            }

        });

        $('body').delegate('input.list_public','change', function (e) {  
            // Update the "Allow comments" checkbox.
            $('input.list_comments').attr('disabled', $(this).val() == 'NO');
        });


        // EVENT HANDLERS
        function doCheck ($c) {
            $header.trigger('check');
        }

        function doCheckHeader( bShowMessage ) {
            $bulkI.attr('disabled', $('input:checked:.list_item_checkbox', $listo).size() == 0 || !listsLoaded );
            // Show the user how many items are selected. IMDBENGAGE-560.
            // But only show this once they've started selecting. IMDBENGAGE-620
            var numSelected = $('.list input:checked', $listo).length;
            if( numSelected > 0 ) {
                itemSelectionStarted = true;
            }
            if (bShowMessage && (itemSelectionStarted || numSelected > 0)) {
                if ( numSelected == 1 ) {
                    message( numSelected + " item selected.", "");
                } else {
                    message( numSelected + " items selected.", "");
                }
            }
        }

        // UTILITIES
    
        function performMoveOrCopy( dest_list_id, list_name, action ) {
            // If we haven't specified a list_id, then use the information from the $dests dropdown.
            // The use-case for when the dest_list_id and the list_name are specified are when we
            // are being called from the new list dialog.
            if ( !dest_list_id ) {
                dest_list_id = $dests.val();
                list_name = $('select.destination :selected', $header).text();
            }
            list_name = list_name.replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;");
            var $items = $('.list input:checked', $listo);  // All checked boxes
            var $rows = $items.closest('.list_item');
            var itemIds = $.map( $rows, function(element, idx) { return $(element).attr('data-item-id'); } );
            action = (action == 'delete') ? 'delete' : $('.action', $header).val();
            var in_progress = $( 'option:selected', $dests).attr("data-state") == "INPROGRESS";

            // If "move", fade out the candidate rows
            if (action == 'move') {
                $rows.fadeTo(0, 0.5);
            }

            var data;
            if( action == "move" ) {
                message( "Moving items...", "in-progress");
                data = {
                    from_list_id: listId,
                    list_type: listType,
                    to_list_id: dest_list_id,
                    items: JSON.stringify( itemIds ),
                    action: action,
                    start: o.start,
                    limit: o.limit,
                    sort_field: sortF,
                    sort_direction: sortD
                };
            } else if ( action == "delete") {
                message( "Removing items...", "in-progress"); 
               data = {
                    from_list_id: listId,
                    to_list_id: listId, // The handler requires a to_list_id, but it's irrelevant for deletion.
                    list_type: listType,
                    items: JSON.stringify( itemIds ),
                    action: action,
                    start: o.start,
                    limit: o.limit,
                    sort_field: sortF,
                    sort_direction: sortD
                };

            } else if ( action == "copy" ) {
                message( "Copying items...", "in-progress");
                data = {
                    from_list_id: listId,
                    list_type: listType,
                    to_list_id: dest_list_id,
                    items: JSON.stringify( itemIds ),
                    action: action,
                    start: o.start,
                    limit: o.limit,
                    sort_field: sortF,
                    sort_direction: sortD
                };

            }
            doAjax({
                method: 'bulk',
                data: data,
                error: function( err ) {
                    // See check_browser_exceptions() for explanation.
                    var make_browser_exception = check_browser_exceptions();
                    if ( make_browser_exception && err.status == 200 ) {
                        // Reload the page.
                        $listo.trigger('reload');
                    } else {
                        message("We're sorry; an error occured and we were not able to complete your task. Please try again.", 'error');
                        // Re-enable everything we disabled
                        $checks.add($dests).add($bulkI).attr('disabled', false);
                        $rows.fadeTo(0, 1);
                    }
                },
                success: function(data) {
                    var $verb;
                    var $link_to_dest = '.';
                    var filter_params = filter_get_params();
                    if (action == 'move' || action == 'delete' ) {
                        // Suppress the numbering from items that will move
                        $('.num', $rows.first().nextAll().andSelf()).fadeTo(0,0);

                        // TODO: check data.item exists, otherwise alert move was successful but reload needed

                        // Animate: slow fade, slide up, then replace with new list
                        // TODO: skip animation if too many items moved
                        if ( !filter_params ) {
                            $rows.fadeTo('slow', 0)
                                .slideUp(function() {
                                    $rows.remove()
                                    // TODO: this via trigger?
                                    $('.list', $listo).html(data.items);
                                    $checks = $('.check input:checkbox', $listo)
                                        .attr('checked', false)
                                        .attr('disabled', false);
                                });
                        }
                        if( action == 'move' ) {
                            $verb = "moved";
                            if( in_progress) {
                                $link_to_dest = ' to <a href="/list/edit?list_id=' + dest_list_id + '">' + list_name + '</a>.';
                            } else {
                                $link_to_dest = ' to <a href="/list/' + dest_list_id + '/">' + list_name + '</a>.';
                            }
                        } else { // action == 'delete'
                            $verb = "removed";
                        }
                        if ( filter_params ) {
                            $listo.trigger('reload');  // filters and display sync
                        }

                    } else {
                        $verb = "copied";
                        if( in_progress ) {
                            $link_to_dest = ' to <a href="/list/edit?list_id=' + dest_list_id + '">' + list_name + '</a>.';
                        } else {
                            $link_to_dest = ' to <a href="/list/' + dest_list_id + '/">' + list_name + '</a>.';
                        }
                        $checks.add($dests).add($bulkI).attr('disabled', false);
                    }
                    // Show success message to user.
                    var $noun = ($rows.length == 1) ? " item " : " items ";
                    message( $rows.length + $noun + $verb + $link_to_dest, 'success');
                }
            });
        }
    
        function closeNewListDialog() {
            // Hide the panel
            $.colorbox.close();
    
            // Clear out any value the user may have entered
            $('#new_list_name').val('');

            // Re-enable buttons if appropriate.
            doCheckHeader( false );
        }

        function showNewListDialog() {
            $.colorbox({ 
                html: '<div class="new_list_panel">' + $('div.new_list_panel').html() + '</div>',
                close: '',
                innerWidth: 385,
                innerHeight: 320
            });
            // Hook up the colorbox's buttons. (For some reason we cannot do this earlier as the
            // handlers don't take.)
            $('div.new_list_panel').delegate('.list_create', 'click', listCreateBtnClicked );
            $('div.new_list_panel').delegate('.list_cancel', 'click', function() {
                closeNewListDialog();
            });
        }

        function fetchLists( listIdToSelect ) {
            // Disable the dropdown.
            $dests.attr('disabled', true);
            // Message the user.
            message( "Updating lists...", "in-progress" );
            // Actually pull the lists from the server
            doAjax({
                method: 'lists',
                data: {
                    list_type: listType
                },
                error: function(err) {
                    message( "Sorry, we encountered a problem retrieving your lists.", "error");
                    // Make sure the drop down is de-selected
                    // if we couldn't fetch any
                    $dests.attr('disabled', true );
                },
                success: function(data) {
                    $dests.html("");
                    if ( listType == "Titles" && listClass != "watchlist" ) {
                        $dests.append($('<option value="watchlist">Watchlist</option>')).val('watchlist').addClass('watchlist');
                    }
                    // Add all lists (except the current one) as valid targets for bulk move/copy
                    $.map(data.lists, function(i) {
                        if (i.list_id != listId) {
                            var $this_option = $("<option></option>")
                                .attr('data-state', i.state)
                                .addClass(listType)
                                .val(i.list_id)
                                .text(i.name);
                            if( i.list_id == listIdToSelect ) {
                                $this_option.attr('selected', 'selected');
                            }
                            $dests.append($this_option);
                        }
                    });

                    // Allow users to create a new list.
                    $dests.append($('<option></option>').attr('value', 'new').attr('class', 'new').attr('data-state', 'INPROGRESS').html("New list..."));
                    // Clear the message
                    clearMessage();

                    listsLoaded = true;
                    doCheckHeader( true );
                    $dests.attr('disabled', false);

                }
            });
        }

        function clearMessage( force ) {
            // Only delete in-progress messages, unless we're forcing it
            if( force || $('.listo .message div').attr("class") == "" || $('.listo .message div').attr("class") == "in-progress" ) {
                message( "", "" );
            }
        }
    
        function message (message, type) {
            // If there's nothing to show, collapse the div
            if ( message == "" ) {
                $('.listo .message').hide('slow');
                return;
            }
            var $icon = '';
            if ( type == 'error' ) {
                $icon = '<img src="/images/icons/error_small.png">';
            } else if ( type == 'success' ) {
                $icon = '<img src="/images/icons/notify_small.png">';
            } else if ( type == 'in-progress' ) {
                $icon = '<img src="/images/spinning-progress.gif">';
            }
            var $m = $( '<div class="' + type + '"><div class="icon">' + $icon + '</div><div class="text">' + message + '</div></div>' );
            $('.listo .message').html($m);
            $('.listo .message').show( 'slow' );
            // $m.delay(10000).fadeOut('slow', function() { $m.remove() });
        }
        function doAjax (options) {
            var url = o.ajaxURL + options.method;
            $.ajax({
                url: url,
                type: 'POST',
                data: options.data,
                beforeSend: window.addClickstreamHeadersToAjax,
                error: options.error,
                success: function(data) {
                    if (data.status != 200) {
                        return options.error(data);
                    }
                    return options.success(data);
                }
            });
        }
    },

    // Bind rating buttons. This is also called from outside the widget in
    // filter.js after the ajax call that apply filters.
    bindRatingButtons: function () {
        var $listo = $(this.element);
        var $rateB = $('.list .your_ratings a', $listo);
        var $rateCancelB = $('a.rw_hide_button', $listo);

        // User clicking on their rating link
        $rateB
            .click(function() {
                var $row = $(this).parent().parent();
                $('.your_ratings,.user_rating,.num_votes,.created,.ratings_date', $row).hide();
                $('.rating_widget', $row).show();
                $('.rw_hide_button', $row).show();
            });

        $rateCancelB
            .click(function() {
                $(this).hide();
                var $row = $(this).parent().parent();
                $('.rating_widget', $row).fadeOut('fast', function() {
                    $('.your_ratings,.user_rating,.num_votes,.created,.ratings_date', $row).show();
                });
            });

        // Update the rating and click "hide" after the rating is made
        $('.rating-list', $listo).bind('change.rating', function(e,data) {
            $('.your_ratings a', $(this).closest('.list_item')).html((data.rating == 0) ? 'Rate' : data.rating);
            $(this).next('a').click();
        });
    },
    version: '1,0'
});
jQuery.widget('ui.save_reordering', {
    options : {
    ajaxURL: '/list/_ajax/bulk',
    start  : 1,
    limit  : 1
    }, /*options*/
    _create: function() {
        var self       = this;
        var $listo     = $('.article.listo');
        var $message   = $('.article.listo .message');
        var list_id    = $('.article.listo').attr('data-list-id');    // list id.
        var list_class = $('.article.listo').attr('data-list-class'); // watchlist or not.
        var list_type  = $('.article.listo').attr('data-list-type');
        var number_re = /^[0-9]+$/;
    
        var $save_reordering = $('.save-reordering');

        $listo.delegate( '.save-reordering', 'enable',  function() { enable_save_reordering();  } );
        $listo.delegate( '.save-reordering', 'disable', function() { disable_save_reordering(); } );
        $listo.delegate( '.save-reordering', 'click',   function() { save_reordering();         } );
        $listo.delegate( '.sequence',        'keypress',function() { $save_reordering.trigger('enable'); } );
        $listo.delegate( '.sequence',        'change',  function() { validate_sequence_number( this ); } );

        function validate_sequence_number( element ) {
            if ( number_re.test( $(element).val() ) && parseInt( $(element).val(), 10 ) > 0 ) {
                $(element).data('is_dirty', true);
            } else {
                alert('Invalid sequence number entered!');
                $(element).attr('value', $(element).attr('defaultValue'));
            }
        }
        function enable_save_reordering() {
            if ( $save_reordering.hasClass('disabled') ) {
                $save_reordering.removeClass('disabled');
            }
        }   
        function disable_save_reordering() {
            if ( !$save_reordering.hasClass('disabled') ) {
                $save_reordering.addClass('disabled');
            }
        }
        function save_reordering() {
            if ( $save_reordering.hasClass('disabled') ) {
                return;
            }
            $save_reordering.trigger('disable');
            var item_ids      = [];
            var new_positions = [];
            var list_idx      = 0;
            var elements      = $('.sequence');
            for ( var seq_idx = 0; seq_idx < elements.length; seq_idx++ ) {
                if ( $(elements[seq_idx]).data('is_dirty') ) {
                    var list_item_id = $(elements[seq_idx]).closest('tr.list_item').attr('data-item-id');
                    var new_position = $(elements[seq_idx]).val();
                    item_ids[list_idx]      = parseInt( list_item_id, 10 );
                    new_positions[list_idx] = parseInt( new_position, 10 );
                    list_idx++;
               }
            }
         
            var $header = $('div.header', $listo);
            var sortF   = $('select.sort_field', $header).val();
            var sortD   = $('.sort button', $header).attr('data-direction');
            
            doAjax({
                data    : {
                    action         : 'reorder',
                    from_list_id   : list_id,
                    to_list_id     : list_id,
                    list_type      : list_type,
                    start          : self.options.start,
                    limit          : self.options.limit,
                    sort_field     : sortF,
                    sort_direction : sortD,
                    items          : JSON.stringify( item_ids ),
                    new_positions  : JSON.stringify( new_positions )
                },
                error   : function( data ) { reorder_failure( data ); },
                success : function( data ) { reorder_success( data ); }
            });
            $message.trigger( 'updatemessage', ['Re-ordering sequence. Please wait for update ...', 'in-progress'] );
            var icon = '<img src="/images/spinning-progress-large.gif">';
            var $m = $( '<div class="in-progress"><div class="icon">' + icon + '</div></div>' );
            $('.spinner-only').html($m);
        }
        function reorder_failure( data ) {
            // See check_browser_exceptions() for explanation.
            var make_browser_exception = check_browser_exceptions();
            if ( make_browser_exception && data.status == 200 ) {
                document.location = document.location;
                $message.trigger( 'updatemessage', ['Re-order succeeded.', 'success'] );
            } else {
                $message.trigger( 'updatemessage', ['Failed to re-order as requested. Please try again.', 'error'] );
                $save_reordering.trigger('enable');
            }
            $('.spinner-only').html('');
        }
        function reorder_success( data ) {
            var filter_params = filter_get_params();
            if ( filter_params ) {
                $listo.trigger('reload'); // sync filters and display
            } else {
                $('.list', $listo).html(data.items);
                $message.trigger( 'updatemessage', ['Re-order succeeded.', 'success'] );
                var $checks = $('.check input:checkbox', $listo);
                $checks.attr('checked', false).attr('disabled', false);
                $('.spinner-only').html('');
            }
            $message.trigger( 'updatemessage', ['Re-order succeeded.', 'success'] );
        }
        function doAjax( args ) {
            $.ajax({
                url     : self.options.ajaxURL,
                method  : 'POST',
                data    : args.data,
                beforeSend: window.addClickstreamHeadersToAjax,
                error   : args.error,
                success : args.success
            });
        }
    }, /*_create*/
    version: '1,0'
});

function filter_get_params () {
    var filter_params = $('.view-all a', $('.filters')).attr('href');
    if ( filter_params ) {
        var query_start_idx = filter_params.indexOf('?');
        if ( query_start_idx < 0 ) {
            filter_params = '';
        } else {
            filter_params = '&' + filter_params.substr( query_start_idx+1 );                    
        }
    } else {
        filter_params = '';
    }
    return filter_params;
}

function check_browser_exceptions() {
    // We handle the special case of Firefox 3.* bug which throws
    // a parse error for json return values of size > 64k. This
    // is a Mozilla bug.
    // https://bugzilla.mozilla.org/show_bug.cgi?id=420869
    // There's a jQuery workaround with jQuery 1.4.4:
    // http://bugs.jquery.com/ticket/7587
    // Other links: https://bugzilla.mozilla.org/show_bug.cgi?id=502836
    // If the return value is > 64k but the status says success,
    // we simply reload the page in this case.
    // Also, note that jQuery.browser.version is the rendering engine
    // version, not the browser version. So for Firefox 4.0,
    // its 2.0 (Mozilla version).
    return (jQuery.browser.mozilla && jQuery.browser.version < '2.0');
}

})(jQuery);
