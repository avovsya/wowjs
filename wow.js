(function ($) {
    var functions = {
        makeCurrent: function ($wow, index) {
            if($wow.changing) {
                return;
            }

            $wow.changing = true;

            //animate
            var visible = $wow.slides.filter(":visible").removeClass('current');
            if(visible.length > 0 ) {
                visible.fadeOut(100, function () {
                    $($wow.slides[index]).addClass('current').fadeIn(200);
                    $wow.changing = false;
                });
            } else {
                $($wow.slides[index]).addClass('current').fadeIn(200, function () {
                    $wow.changing = false;
                });
            }

            // set class for active navigation link
            if($wow.config.showNavigation) {
                $wow.controls.navigation.find('a').removeClass('current').eq(index).addClass('current');
            }

            $wow.current = index;
            this.checkEdgeSlides($wow, index);
        },

        checkEdgeSlides: function ($wow, index) {
            if(!$wow.config.cycleSlides && $wow.config.showArrows){
                if(index === 0) {
                    $wow.controls.prevArrow.addClass('disabled');
                    $wow.controls.nextArrow.removeClass('disabled');
                    return;
                }
                if(index === $wow.slides.length-1) {
                    $wow.controls.prevArrow.removeClass('disabled');
                    $wow.controls.nextArrow.addClass('disabled');
                    return;
                }

                $wow.controls.prevArrow.removeClass('disabled');
                $wow.controls.nextArrow.removeClass('disabled');
            }
        },

        nthSlide: function ($wow, index) {
            functions.makeCurrent($wow, index);
        },

        nextSlide: function ($wow){
            var current = $wow.current;
            var nextSlide = current < $wow.slides.length-1 ? current + 1 : 0;
            if(!$wow.config.cycleSlides && (nextSlide < current)) { 
                // last slide
                return;
            }
            this.makeCurrent($wow, nextSlide);
        },

        prevSlide: function ($wow){
            var current = $wow.current;
            var nextSlide = current === 0 ? $wow.slides.length-1 : current - 1;
            if(!$wow.config.cycleSlides && (nextSlide === $wow.slides.length-1)) { 
                // first slide
                return;
            }
            this.makeCurrent($wow, nextSlide);
        }
    };

    $.fn.wow = function (options) {

        var config = {
            'showArrows': true, // show arrows on slides
            'showNavigation': true, // show navigation for slides
            'useKeyboard': true, // allow Left/Right keys to control slides
            'cycleSlides': true, // cycle slides
            'customClass': null // custom class for wow-container block
        };

        if(options) {
            $.extend(config, options);
        }

        this.each(function () {

            var $wow = $(this).addClass('wow-slider').wrap('<div class="wow-container" />').parent('.wow-container');
            $wow.addClass(config.customClass);
            $wow.slides = $wow.find('.slide').hide();
            $wow.current = 0;
            $wow.config = config;
            $wow.controls = {};
            $wow.changing = false;

            // setup navigation
            if(config.showNavigation){
                $wow.controls.navigation = $("<ul/>").addClass('slide-navigation').appendTo($wow);

                // setup click handler for navigation links
                $wow.controls.navigation.delegate('.navigation-link', 'click', function (e) {
                    e.preventDefault();
                    var index = parseInt($(this).data('slide-index'));
                    functions.nthSlide($wow, index);
                });

            }

            // setup slides
            $wow.slides
                .each(function (i, el){

                    if($(el).hasClass('current')) {
                        $wow.current = i;
                    }

                    // if slide have element with class 'title' - the text of that 
                    // element would be slide's name
                    var slideTitle = $(el).children('.title').text() || i+1;
                    $(el).title = slideTitle;

                    // show link for each slide in navigation
                    if(config.showNavigation){
                        $("<li />").append(
                            $("<a href='#' class='navigation-link'/>").text(slideTitle).data('slide-index', i)
                        ).appendTo($wow.controls.navigation);
                    }

                })
                .on('click', function (e){
                    e.preventDefault();
                    functions.nextSlide($wow);
                });

            if (config.useKeyboard) {
                $(document).keydown(function (e){
                    if(e.keyCode === 39) {
                        functions.nextSlide($wow);
                    }
                    if(e.keyCode === 37) {
                        functions.prevSlide($wow);
                    }
                });
            }


            // setup navigation arrows
            if (config.showArrows) {
                $wow.controls.prevArrow = $("<a href='#'><</a>").addClass('slide-prev').on('click', function (e){
                    e.preventDefault();
                    functions.prevSlide($wow);
                });

                $wow.controls.nextArrow = $("<a href='#'>></a>").addClass('slide-next').on('click', function (e){
                    e.preventDefault();
                    functions.nextSlide($wow);
                });

                $wow.append($wow.controls.prevArrow);
                $wow.append($wow.controls.nextArrow);
            }

            functions.makeCurrent($wow, $wow.current);
        });
    };
})(jQuery);
