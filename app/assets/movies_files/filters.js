(function($) {
jQuery.widget('ui.filter_lists', {
    options : {
        ajaxURL : '/list/_ajax/list_filter'
    },

    constants : {
        votes_slider  : { 
            range : true, 
            min : -1,    
            max : 6, 
            step : 0.1,  
            values : [-1, 6], 
            fixed : 0, 
            labels: ['0', '1', '10', '100', '1k', '10k', '100k', 'All'] 
        },
        rating_slider : { 
            range : true, 
            min : 1,    
            max : 10,     
            step : 0.1, 
            values : [1,10],      
            fixed : 1, 
            labels: ['1 star', '10 stars'] 
        },
        year_slider : { 
            range : true, 
            min : 1880, 
            max : 2021,   
            step : 1,   
            values : [1880,2021], 
            fixed : 0 
        },
        sparkline : { 
            width : '100%', 
            minSpotColor : false, 
            maxSpotColor : false, 
            lineColor : '#666666', 
            fillColor : '#F6F6F5', 
            spotColor: 'none', 
            lineWidth: '1' 
        }
    },

    _init : function() {

        var self = this;
        var sort_direction  = $('.sort_field option:selected').attr('data-direction');
        var sort_field      = $('.sort_field option:selected').attr('value');
        var view            = $('.views').attr('data-current');
        var $filter_panel   = $('.panel-filters.filters');
        var $histogram      = $('.histogram', $filter_panel);
        var $accordion      = $('#accordion');
        var $listo          = $('.article.listo');
        var items_per_page  = parseInt($listo.attr('data-items-per-page'));
        var list_type       = $listo.attr('data-list-type'); 
        
        // Setup accordion.
        $filter_panel.css('display', 'block');
        $accordion.accordion({ 
            header: '.accordion-header', 
            animated: false, 
            autoHeight: false, 
            collapsible: false 
        }); 

        
        // Number of votes range
        var votes_range;
        if ( $('.slider-range-votes').length > 0 ) {
            votes_range = new self.sliderGroup({
                slider_selector : '.slider-range-votes',
                min_field   : '.votes-from',
                max_field   : '.votes-to',
                fixed       : self.constants.votes_slider.fixed,
                slider_min  : self.constants.votes_slider.min,
                // Todo: If design changes: 
                // $filter_panel.attr("data-minvotes") 
                //     ? parseInt($filter_panel.attr("data-minvotes"),10) : self.constants.votes_slider.min,
                slider_max  : self.constants.votes_slider.max,
                // Todo: If design changes: 
                // $filter_panel.attr("data-maxvotes")
                //     ? parseInt($filter_panel.attr("data-maxvotes"),10) : self.constants.votes_slider.max,
                slider_step : self.constants.votes_slider.step,
                values      : [parseFloat($filter_panel.attr("data-minvotesvaluelog"),10), 
                               parseFloat($filter_panel.attr("data-maxvotesvaluelog"),10)],
                labels      : self.constants.votes_slider.labels,
                use_log_scale : true,
                refreshFilter : function() { filterChanged(); }
            });
        }

        // Ratings range
        var rating_range;
        if ( $('.slider-range-rating').length > 0 ) {
            rating_range = new self.sliderGroup({
                slider_selector : '.slider-range-rating',
                min_field   : '.rating-from',
                max_field   : '.rating-to',
                fixed       : self.constants.rating_slider.fixed,
                slider_min  : self.constants.rating_slider.min,
                // Todo: If design changes: 
                // $filter_panel.attr("data-minrating") 
                //     ? parseFloat($filter_panel.attr("data-minrating")) : self.constants.rating_slider.min,
                slider_max  : self.constants.rating_slider.max,
                // Todo: If design changes: 
                // $filter_panel.attr("data-maxrating") 
                //     ? parseFloat($filter_panel.attr("data-maxrating")) : self.constants.rating_slider.max,
                slider_step : self.constants.rating_slider.step,
                values      : [parseFloat($filter_panel.attr("data-minratingvalue")), 
                               parseFloat($filter_panel.attr("data-maxratingvalue"),10)],
                labels      : self.constants.rating_slider.labels,
                refreshFilter : function() { filterChanged(); }
            });
        }

        // Year range
        var year_range;
        if ( $('.slider-range-year').length > 0 ) {
            year_range = new self.sliderGroup({
                slider_selector : '.slider-range-year',
                min_field   : '.year-from',
                max_field   : '.year-to',
                fixed       : self.constants.year_slider.fixed,
                slider_min  : $filter_panel.attr("data-minyear") 
                    ? parseInt($filter_panel.attr("data-minyear"),10) : self.constants.year_slider.min,
                slider_max  : $filter_panel.attr("data-maxyear") 
                    ? parseInt($filter_panel.attr("data-maxyear"),10) : self.constants.year_slider.max,
                slider_step : self.constants.year_slider.step,
                values      : [parseInt($filter_panel.attr("data-minyearvalue"),10), 
                               parseInt($filter_panel.attr("data-maxyearvalue"),10)],
                labels      : [parseInt($filter_panel.attr("data-minyear"),10), 
                               parseInt($filter_panel.attr("data-maxyear"),10)],
                refreshFilter : function() { filterChanged(); }
            });
        }

        $histogram.sparkline( 'html', self.constants.sparkline );
        
        if ( view != 'compact' && view != 'detail' && view != 'grid' ) {
            return;
        }
        
        // Bind event handlers for checkboxes.
        $accordion.delegate( ':checkbox', 'change', function() { filterChanged(); } );
        $accordion.delegate( ':radio', 'change', function( ev ) { radioChanged( ev ); filterChanged(); } );
        $accordion.bind( 'accordionchange', function( ev, ui ) { $.sparkline_display_visible(); } );
        $filter_panel.delegate( '.clear-all',  'click', function() { clearAll(); } );

        // Update filter params
        var filter_params = self.options.filter_params ? self.options.filter_params : '';
        updatePagination( filter_params );
        updateAccordionHeaders();

        // On reloading page by clicking on back-button on browser, the following code sets the
        // appropriate filter states and filters if necessary.
        var current_filter_state  = {};
        var proposed_filter_state = {};

        // Even when the page does not have any filter parameters, the bowser
        // may remember the previously selected check boxes in the case of user
        // click back button. So in that case, we call filterChanged and if
        // there are selected checkboxes, it will issue an ajax call and filter
        // properly. When the page have filter parameters, it will be already
        // filtered by the server, and we should not call filterChanged.
        // Otherwise it will issue an wrong ajax call and display wrong results.
        // https://jira2.amazon.com/browse/WATCH-399
        if(!filter_params) {
            filterChanged();
        } else {
            // Current filter state needs to be recorded if options are set
           current_filter_state = getFilterState();
        }
        
        // Begin helper methods.
        function clearAll() {
            // Todo: If any selection is made, it is reflected in the '.clear-all-selections'
            //       section following the '.accordion-header'. Also, we bind a click()
            //       handler to each '.clear-all-selections' section to clear selections in that
            //       section alone. Thus triggering a 'click' method on all matching 
            //       '.clear-all-selections' will clear all selections out. The following code
            //       will do that:
            //$('.selections .clear-all-selections', $accordion).trigger('click');
            //$('.view-all a', $filter_panel).attr('href', encodeURI( '/search/title' ) );
            //       However, this triggers a sequence of individual ajax events, that each 
            //       clear out the individual .clear-all-selections sections. In order to avoid
            //       this sequence of ajax events, which can be handled by a single one, we 
            //       (for now) reload the document. There may be better ways of doing this
            //       through ajax calls.
            document.location = '?view=' + view + '&sort=' + sort_field + ':' + sort_direction;
        }
        function doAjax ( args ) {
            $.ajax({
                url     : self.options.ajaxURL,
                method  : 'POST',
                data    : args.data,
                beforeSend: window.addClickstreamHeadersToAjax,
                error   : args.error,
                success : args.success,
                dataType: 'json'
            });
        }
        function filterChanged() { 

            // The following is to handle the back-button on browsers. Consider a user who browses
            // away from a list page, without setting any filters, to a title page. Then on clicking
            // on the back-button, the user comes back to the list page; no point in dispatching ajax.
            proposed_filter_state = getFilterState();
            if ( JSON.stringify( proposed_filter_state ) == JSON.stringify( current_filter_state ) ) {
                return;
            }
            
            var args  = {};
            args.data = {
                list_id   : $listo.attr('data-list-id'),
                list_class: $listo.attr('data-list-class'),
                view      : view,
                list_type : list_type,
                filter    : JSON.stringify( proposed_filter_state ),
                sort_field     : sort_field,
                sort_direction : sort_direction,
                user_id   : $filter_panel.attr('data-userid')
            };
            args.error   = filterChanged_error;
            args.success = filterChanged_success;

            if ( view == 'compact' ) {
                setStatus( 'Filtering your list ...', 'in-progress' );
            }

            spinner( true );

            doAjax( args );
        }
        function getFilterState() {
            var filter = {};
            var providersList = getCheckboxChoice( 'online_availability' );
            if ( providersList.length > 0 ) {
                filter.online_availability = providersList;
            }
            var genreList = getCheckboxChoice( 'genres' );
            if ( genreList.length > 0 ) {
                filter.genres = genreList;
            }
            var titleTypeList = getCheckboxChoice( 'title_type' );
            if ( titleTypeList.length > 0 ) {
                filter.title_type = titleTypeList;
            }
            var waysToWatch = getCheckboxChoice( 'has' );
            if ( waysToWatch.length > 0 ) {
                filter.has = waysToWatch;
            }
            var aboutYouWatchlist = getRadioChoice( 'personal-watchlist' );
            if( aboutYouWatchlist.length > 0 ) {
                filter.lists = aboutYouWatchlist;
            }
            var aboutYouRatings = getRadioChoice( 'personal-ratings' );
            if( aboutYouRatings.length > 0 ) {
                filter.my_ratings = aboutYouRatings;
            }
            if ( year_range ) {
                min_val = year_range.getMin();
                max_val = year_range.getMax();
                if (
                    !(    year_range.getMinMin() == min_val
                          && year_range.getMaxMax() == max_val ) 
                ) {
                    filter.release_date = [min_val, max_val];
                }
            }
            if ( rating_range ) {
                min_val = rating_range.getMin();
                max_val = rating_range.getMax();
                if (
                    !(    rating_range.getMinMin() == min_val
                          && rating_range.getMaxMax() == max_val ) 
                ) {
                    filter.user_rating = [min_val, max_val];
                }
            }
            if ( votes_range ) {
                min_val = votes_range.getMin();
                max_val = votes_range.getMax();
                if (
                    !(    votes_range.getMinMin() == min_val
                          && votes_range.getMaxMax() == max_val ) 
                ) {
                    filter.num_votes = [min_val, max_val];
                }
            }
            // For any other search parameter, repeat the above pattern.
            
            return filter;
        }
        function setFilterState( filter_state ) {
            setCheckboxChoice( 'online_availability', filter_state.online_availability, true);
            setCheckboxChoice( 'genres', filter_state.genres, true );
            setCheckboxChoice( 'title_type', filter_state.title_type, true );
            setCheckboxChoice( 'has', filter_state.has, true );
            setRadioChoice( 'personal-watchlist', filter_state.lists );
            setRadioChoice( 'personal-ratings', filter_state.my_ratings );
        }
        function filterChanged_success ( data ) {
            if ( data.status != 200 ) {
                filterChanged_error( data );
                return;
            }
            current_filter_state = proposed_filter_state;
            if ( view == 'compact' ) {
                updateCompactView( data );
            } else if ( view == 'detail' ) {
                updateDetailView( data );
            } else if ( view == 'grid' ) {
                updateGridView( data );
            }
            // Common handlers
            var search_url = '/search/title';
            if ( data.search_query ){
                search_url += '?' + data.search_query;
            }

            if (window.location.search.match(/[?&]start=([^1]|1\d+)/)) {
                // We are not on page 1, so we need to reload to fixup the pagination
                // (we want the url to match the display).
                var reload = '?view=' + view + '&sort=' + sort_field + ':' + sort_direction;
                if (data.search_query) {
                    reload += '&' + data.search_query;
                }
                document.location = reload;
                return;
            }

            $('.view-all a', $filter_panel).attr('href', encodeURI( search_url ) );
            var total_filtered_results = parseInt(data.list_size);
            var total_unfiltered_results = parseInt(data.unfiltered_results);

            var num_pages = Math.floor((total_filtered_results - 1) / items_per_page) + 1;
            var current_page = 1;
            if (!total_unfiltered_results) {
                total_unfiltered_results = total_filtered_results;
            }
            if ( total_filtered_results == 0) {
                $('.nav .desc').html( 'No filtered results' );
            } else if (num_pages == 1) {
                $('.nav .desc').html( 'Showing ' 
                                      + total_filtered_results
                                      + ' of ' + total_unfiltered_results + ' ' + list_type );
            } else {
                $('.nav .desc').html( 'Page ' + current_page + ' of ' + num_pages 
                                      + '&nbsp;&nbsp;(' + total_filtered_results + ' of ' 
                                      + total_unfiltered_results + ' ' + list_type + ')');
            }
            
            // Enable the add to watchlist button appropriately.
            if ( $listo.length > 0 && $('.wlb_wrapper', $listo).length > 0) {
                $('.wlb_wrapper', $listo).wlb_lite();
            }
            // Trigger the late loading images binding, so any
            // late-loaded images we put on the page will be hooked up
            $(window).trigger("bindloadlate");
            updateAccordionHeaders();
            updatePagination( data.search_query, num_pages, current_page );
            updatePermalink( data.search_query );
            spinner( false );
        }
        function filterChanged_error ( data ) {
            
            if ( data.status == 200 ) {
                // Handle the case where in FF3.*, the Ajax JSON return is filtered through
                // a parser that throws if the return value has more than 64K content in it.
                // The data might still be valid, so we try to parse the data with the JSON
                // parser we ship with js/json.js.
                try {
                    data = JSON.parse( data.responseText );
                    filterChanged_success( data );
                    return;
                } catch( e ) {
                    // Go through regular error handling below.
                }
            }
            if ( view == 'compact' ) {
                setStatus( 'Failed to filter your list as requested. Please try again.', 'error' );
            } else {
                alert( 'Failed to filter. Please try again.' );
            }
            setFilterState( current_filter_state );
            spinner( false );
        }
        function getCheckboxChoice( name_selector ) {
            var id_list = [];
            $( ':checkbox[name=' + name_selector + ']:checked' )
                .each( function() { id_list.push( $(this).val() ); } );
            return id_list;
        }
        function setCheckboxChoice( name_selector, value_selectors, state ) {
            $( ':checkbox[name=' + name_selector + ']' ).attr('checked', !state);
            if ( value_selectors ) {
                $.each( value_selectors, function( idx, val ) {
                    $( ':checkbox[name=' + name_selector + '][value=' + val + ']' ).attr('checked', state);
                } );
            }
        }
        function getRadioChoice( name_selector ) {
            var id_list  = [];
            $( ':radio[name=' + name_selector + ']:checked' )
                .each( function() { id_list.push( $(this).val() ); } );
            return id_list;
        }
        function setRadioChoice( name_selector, value_selector ) {
            if ( value_selector && value_selector[0] ) {
                $( ':radio[name=' + name_selector + '][value=' + value_selector + ']' ).attr('checked', true);
            }
        }
        function radioChanged( ev ) {
            if ( $(ev.currentTarget).val() === 'show-all' ) {
                // Clear all the other radios.
                $(':radio[name^="personal"]')
                    .not('[name="personal-showall"]')
                    .attr('checked', false);
            } else {
                // Clear show-all radio.
                $(':radio[name=personal-showall]').attr('checked', false);
            }
        }
        function spinner( enable_spinner ) {

            var $disable_filter = $('.disable-pane', $filter_panel);
            var $disable_lists  = $('.disable-pane', $listo);

            if ( enable_spinner ) {
                // Disable filter panel and setup spinner.
                $disable_filter.width(  $filter_panel.innerWidth()  );
                $disable_filter.height( $filter_panel.innerHeight() );
                // Place the spinner image at the center of the accordion.
                var spinner_top = ( $filter_panel.innerHeight()-
                                    $('img.center-spinner', $filter_panel).innerHeight() )/2;
                $('img.center-spinner', $filter_panel).css('margin-top', spinner_top+'px' );

                $disable_filter.css( 'z-index', (parseInt($accordion.css('z-index'),10)+1) );
                $disable_filter.css( 'visibility', 'visible' );


                // Disable lists panel and setup spinner.
                $disable_lists.width(  $listo.innerWidth()  );
                $disable_lists.height( $listo.innerHeight() );
                
                $disable_lists.css( 'z-index', 1 );
                $disable_lists.css( 'visibility', 'visible' );
            } else {
                // Enable filter panel.
                $disable_filter.css( 'z-index',  (parseInt($accordion.css('z-index'),10)-1) );
                $disable_filter.css( 'visibility', 'hidden' );
                
                // Enable lists panel.
                $disable_lists.css( 'z-index', 0 );
                $disable_lists.css( 'visibility', 'hidden' );
            }
        }
        function setStatus( text, msg_id ) {
            var $message = $('.article.listo .message');
            $message.trigger( 'updatemessage', [text, msg_id] );
        }
        function updateAccordionHeaders() {
            var selections = [];
            var $accordion_headers = $('#accordion .accordion-header');
            
            // Handle checkboxes and radio buttons.
            $.each( $accordion_headers, function( idx, header ) {
                var $checked = $(header).next().find(':checkbox:checked');
                selections = [];
                $.each( $checked, function( idx, checked_element ) {
                    selections.push( $(checked_element).attr('label') );
                });
    
                var $radio_selected = $(header).next().find(':radio:checked');
                $.each( $radio_selected, function( idx, checked_element ) {
                    if( $(checked_element).attr('label') != 'Show all' ) {
                        selections.push( $(checked_element).attr('label') );
                    }
                });
                
                if ( selections.length > 0 ) {
                    $('.selections', $(header)).text( selections.join(' | ' ) );
                    var header_text = $('.header-text', $(header)).text();
                    $('.selections', $(header)).append('<span class="clear-all-selections" title="Clear '
                                                       + header_text + ' selections"></span>');
                    $('.selections .clear-all-selections', $(header))
                        .click(
                            function() {
                                var $checked = $(':checkbox:checked', $(header).next());
                                if ( $checked.length > 0 ) {
                                    $checked.attr('checked', false);
                                    filterChanged();
                                }
                                var $radios  = $(':radio:checked', $(header).next());
                                if ( $radios.length > 0 ) {
                                    $radios.attr('checked', false);
                                    filterChanged();
                                }
                                return false;
                            } 
                        );
                } else {
                    $('.selections', $(header)).text('');
                    $('.selections .clear-all-selections', $(header)).remove();
                }
            });
            // Handle sliders below.
            // Handle release date range.
            // Note: The variable sel below is 'selections' below:
            //       <div class='accordion-header'>
            //           <div class='selections'>...</div>
            //       <div class='accordion-content>
            //          <div class='ui-slider'>...</div>
            if ( year_range 
                 && ( year_range.getMin() != year_range.getMinMin() 
                      || year_range.getMax() != year_range.getMaxMax() ) ) {
                var sel = $('.filters '+year_range.slider_selector).parent().prev().find('.selections');
                var header_text = $(sel).parent().find('.header-text').text();
                $(sel)
                    .text( year_range.getMin() + '-' + year_range.getMax() )
                    .append('<span class="clear-all-selections" title="Clear ' + header_text + ' selections"></span>');
                $('.clear-all-selections', $(sel)).click(
                    function() { 
                        year_range.reset();
                        $(sel).text('');
                        $('.clear-all-selections', $(sel)).remove();
                        return false;
                    } 
                );
            }
            // Handle votes pane: rating range + num votes range.
            selections = [];
            if ( rating_range 
                 && (rating_range.getMin() != rating_range.getMinMin()
                     || rating_range.getMax() != rating_range.getMaxMax() ) ) {
                selections.push( 'Ratings:' + rating_range.getMin() + '-' + rating_range.getMax() );
            }
            if ( votes_range 
                 && (votes_range.getMin() != votes_range.getMinMin()
                     || votes_range.getMax() != votes_range.getMaxMax() ) ) {
                selections.push( 'Votes:' + votes_range.getMin() + '-' + votes_range.getMax() );
            }
            if ( rating_range && votes_range && selections.length > 0 ) {
                var sel = $('.filters '+rating_range.slider_selector).parent().prev().find('.selections');
                var header_text = $(sel).parent().find('.header-text').text();
                $(sel)
                    .text( selections.join( ' | ' ) )
                    .append('<span class="clear-all-selections" title="Clear ' + header_text +' selections"></span>');
                $('.clear-all-selections', $(sel)).click(
                    function() { 
                        votes_range.reset();
                        rating_range.reset();
                        $(sel).text('');
                        $('.clear-all-selections', $(sel)).remove();
                        } 
                );
            }
        }
        function updateCompactView( data ) {

            // The table is organized as follows:
            // 
            // div class="list compact"
            //     <tbody>
            //         div class="list_item"  => table header -- keep this!
            //         div class="list_item odd"  -> element
            //         div class="list_item even" -> element
            //         ....
            //
            // So we remove all the '.list_item.odd' and '.list_item.even'
            // and replace them with the returned html (as a child of '.list.compact').
            
            $('tbody .list_item.even', $('.list.compact')).remove();
            $('tbody .list_item.odd', $('.list.compact')).remove();
            
            var title_html = $('.list.compact').find('tbody').html();
            var all_html   = title_html + data.table_data;
            $('.list.compact').find('tbody').html( all_html );
            
            // Other enabling.
            $('.list_item :checkbox').attr('disabled', false);

            // Bind rating buttons for the new html we got.
            jQuery('.listo').list_view('bindRatingButtons');

            setStatus( 'Filtered list.', 'success' );
        }
        function updateDetailView( data ) {
            $('.list.detail').html( data.table_data );

            // Enable the ratings widget if the user is logged in.
            if ( data.ratings_properties && data.ratings_properties.uconst ) {
                $('.listo .rating-list').rating({
                    uconst: data.ratings_properties.uconst,
                    widgetClass: data.ratings_properties.widget_class,
                    ajaxURL: '/ratings/_ajax/title',
                    starWidth: data.ratings_properties.star_width,
                    errorMessage: data.ratings_properties.error_message,
                    images: {
                        imdb: data.ratings_properties.images_imdb,
                        off:  data.ratings_properties.images_off,
                        your: data.ratings_properties.images_your,
                        del:  data.ratings_properties.images_del,
                        info: data.ratings_properties.images_info
                    }
                });
            }
            // Display the list item delete buttons
            $('.listo .list_item .delete').show();
        }
        function updateGridView( data ) {
            $('div.list.grid').html( data.table_data );
            $('.hover-over-image').hover_over_image();
        }
        function updatePagination( filter_params, num_pages, current_page ) {
            var $pagination = $('.pagination', $listo);
            if (num_pages) {
                if (num_pages <= 1) {
                    $pagination.hide();
                } else {
                    $pagination.show();
                    if (current_page) {
                        if (current_page == 1) {
                            var next_start = 1 + items_per_page;
                            var next = '?start=' + next_start + '&view=' + view + '&sort=' + sort_field + ':' + sort_direction;
                            if ( filter_params ) {
                                next += '&' + filter_params;
                            }
                            $pagination.html('Page 1 of ' + num_pages + ' <a href="' + next + '">Next&nbsp;&raquo;</a>');
                        } else {
                            // not yet supported
                        }
                    }
                }
            }
        }
        function updatePermalink ( filter_params ) {
            var list_id    = $listo.attr('data-list-id'),
                list_class = $listo.attr('data-list-class').toLowerCase(),
                user_id    = $filter_panel.attr('data-userid'),
                permalink  = '';
            if ( list_class === 'watchlist' || list_class === 'ratings' || list_class === 'checkins') {
                permalink = '/user/' + user_id + '/' + list_class;
            }
            else {
                permalink += "/list/" + list_id;
            }
            permalink += '?start=1&view=' + view + '&sort=' + sort_field + ':' + sort_direction;
            if ( filter_params ) {
                permalink += '&' + filter_params;
            }
            $('.filters .permalink a').attr('href', encodeURI(permalink));
        }
    }, //end _init
    /* sliderGroup
     * Ties together the slider, the associated minimum selector's text
     * field, and the associated maximum selectors' text field.
     * Input parameters are:
     *   slider_selector : Selector string for slider
     *   min_field: Selector string for minimum field
     *   max_field: Selector string for maximum field
     *   fixed: Precision of number (fixed = 1 means we will show 1.0, 1.1..)
     *   slider_min: Minimum slider value
     *   slider_max: Maximum slider value
     *   slider_step: Slider step size
     *   values: [a,b] => value for the left and right sliders respectively.
     * The current implementation WON'T work for sliders with only one 
     * selector! Its meant for the two selector case.
     */
    sliderGroup : function( args ) {
        var self = this;
        this.slider_selector = args.slider_selector;
        this.min_field       = args.min_field;
        this.max_field       = args.max_field;
        this.precision       = args.fixed;
        this.refreshFilter   = args.refreshFilter;
        this.use_log_scale   = false;
        if ( args.use_log_scale ) {
            this.use_log_scale = true;
            this.getMax    = function() { return getMaxLogScale(); }
            this.getMaxMax = function() { return getMaxMaxLogScale(); }
            this.getMin    = function() { return getMinLogScale(); }
            this.getMinMin = function() { return getMinMinLogScale(); }
            this.reset     = function() { resetLogScale(); }
            this.updateMinMax = function() { updateMinMaxLogScale(); }
        } else {
            this.getMin    = function() { return getMin(); }
            this.getMinMin = function() { return getMinMin(); }
            this.getMax    = function() { return getMax(); }
            this.getMaxMax = function() { return getMaxMax(); }
            this.reset     = function() { reset(); }
            this.updateMinMax = function() { updateMinMax(); }
        }
        if ( args.labels ) {
            this.slider_labels = args.labels;
        }
        
        this.slider_params   = {
            range : true,
            min   : args.slider_min,
            max   : args.slider_max,
            step  : args.slider_step,
            values: args.values
        };
        // Initialize the components.
        $(this.slider_selector).slider( this.slider_params );
        self.updateMinMax();
        initLabels();
        // Bind appropriate handlers.
        $(this.slider_selector).bind('slide', 
                                     function() {
                                         self.updateMinMax();
                                     }
                                    );
        $(this.slider_selector).bind('slidechange', 
                                     function() {
                                         self.updateMinMax();
                                         self.refreshFilter();
                                     }
                                    );
        function getMin() {
            self.minmax = $(self.slider_selector).slider("option", "values");
            return self.minmax[0].toFixed( self.precision );
        }
        function getMinLogScale() {
            self.minmax = $(self.slider_selector).slider("option", "values");
            return Math.pow( 10, self.minmax[0] ).toFixed( self.precision );
        }
        function getMinMin() {
            return self.slider_params.min;
        }
        function getMinMinLogScale() {
            return Math.pow( 10, self.slider_params.min ).toFixed( self.precision );
        }
        function getMax() {
            self.minmax = $(self.slider_selector).slider("option", "values");
            return self.minmax[1].toFixed( self.precision );
        }
        function getMaxLogScale() {
            self.minmax = $(self.slider_selector).slider("option", "values");
            return Math.pow( 10, self.minmax[1] ).toFixed( self.precision );
        }
        function getMaxMax() {
            return self.slider_params.max;
        }
        function getMaxMaxLogScale() {
            return Math.pow( 10, self.slider_params.max ).toFixed( self.precision );
        }
        function updateMinMax() {
            $(self.min_field).text( getMin() );
            $(self.max_field).text( getMax() );
        }
        function updateMinMaxLogScale() {
            $(self.min_field).text( getMinLogScale() );
            $(self.max_field).text( getMaxLogScale() );
        }
        function initLabels() {
            if ( !self.slider_labels ) {
                return;
            }
            var label_widths    = 100.0 / (self.slider_labels.length - 1);
            var end_label_width = label_widths/2.0;
            var left = 0;
            $(self.slider_labels).each(
                function( i, elem ) {
                    var tick_marks = 
                        $('<div class="tick-marks ui-widget-content">|</div>')
                        .appendTo(self.slider_selector);
                    var tick_width = label_widths;
                    if ( i == 0 || i == (-1+self.slider_labels.length) ) {
                        tick_width = end_label_width;
                    }
                    tick_marks.css({
                        left: left + '%',
                        width: tick_width + '%'
                    });
                    left += tick_width;
                }
            );
            var slider_tick_mark_selectors = $('.tick-marks', $(self.slider_selector));
            $(slider_tick_mark_selectors[0]).css( 'text-align', 'left' );
            $(slider_tick_mark_selectors[ slider_tick_mark_selectors.length-1 ]).css( 'text-align', 'right' );
            
            $( '<br/>' ).appendTo( self.slider_selector );
            
            left = 0;
            $(self.slider_labels).each(function(i, elem) {
                var tick = $('<div class="tick ui-widget-content">' + elem + '</div>').appendTo(self.slider_selector);
                var tick_width = label_widths;
                if ( i == 0 || i == (-1+self.slider_labels.length) ) {
                    tick_width = end_label_width;
                }
                tick.css({
                    left: left + '%',
                    width: tick_width + '%'
                });
                left += tick_width;
            });
            var slider_label_selectors = $('.tick', $(self.slider_selector));
            $(slider_label_selectors[0]).css( 'text-align', 'left' );
            $(slider_label_selectors[ slider_label_selectors.length-1 ]).css( 'text-align', 'right' );
        }
        function reset() {
            $(self.slider_selector).slider( "option", "values", [self.slider_params.min, self.slider_params.max] );
            updateMinMax();
        }
        function resetLogScale() {
            $(self.slider_selector).slider( "option", "values", [ self.slider_params.min, self.slider_params.max ] );
            updateMinMaxLogScale();
        }
}, //sliderGroup class
    version : '1,0'
});
})(jQuery);

// Todo: This fix makes older versions of jQuery UI drag-and-drop work in IE9.
// Specifically targetted to jQuery.sortable(..). This code should go once we
// update jQuery ui to ui-1.8.6 (at the point of adding this code, we are at
// ui-1.8.1).
// References: 
// [1] http://forum.jquery.com/topic/jquery-ui-sortable-and-draggable-do-not-work-in-ie9
// [2] http://bugs.jqueryui.com/ticket/5370
(function($){
    var a=$.ui.mouse.prototype._mouseMove;
    $.ui.mouse.prototype._mouseMove=function(b){
        if($.browser.msie&&document.documentMode>=9){
            b.button=1
        };
        a.apply(this,[b]);
    }
}(jQuery));
