(function ($) {
    var functions = {
        makeCurrent: function ($wow, index, cb) {
            var visible = $wow.slides.filter(":visible").removeClass('current');
            if(visible.length > 0 ) {
                visible.fadeOut(200, function () {
                    $($wow.slides[index]).addClass('current').fadeIn(500);
                    if (cb) {
                        cb();
                    }
                });
            } else {
                $($wow.slides[index]).addClass('current').fadeIn(500, function () {
                    if (cb) {
                        cb();
                    }
                });
            }

            // set class for active agenda link
            if($wow.config.agenda) {
                $wow.controls.agenda.children('a').removeClass('current').eq(index).addClass('current');
            }

            $wow.current = index;
            this.checkEdgeSlides($wow);
        },

        //check that the slide is edge slide
        checkEdgeSlides: function ($wow) {
            if(!$wow.config.cycle && $wow.config.arrows) {
                if($wow.current === $wow.slides.length-1) {
                    $wow.controls.nextArrow.addClass('disabled');
                } else {
                    $wow.controls.nextArrow.removeClass('disabled');
                }

                if($wow.current === 0) {
                    $wow.controls.prevArrow.addClass('disabled');
                } else {
                    $wow.controls.prevArrow.removeClass('disabled');
                }
            }
        },

        nextSlide: function ($wow, cb){
            var current = $wow.current;
            var nextSlide = current < $wow.slides.length-1 ? current + 1 : 0;
            this.makeCurrent($wow, nextSlide, cb);
        },

        prevSlide: function ($wow, cb){
            var current = $wow.current;
            var nextSlide = current === 0 ? $wow.slides.length-1 : current - 1;
            this.makeCurrent($wow, nextSlide, cb);
        },
    };

    var config = {
        'arrows': true, // show arrows on slides
        'agenda': true, // show agenda for slides
        'keyControl': true, // allow Left/Right keys to control slides
        'cycle': true // cycle slides
    };

    $.fn.wow = function (options) {

        this.each(function () {
            if(options) {
                $.extend(config, options);
            }

            var $wow = $(this);
            $wow.slides = $wow.find('.slide').hide();
            $wow.current = 0;
            $wow.config = config;
            $wow.controls = {};
            $wow.changing = false;

            // creator for "prev slide" click handler 
            $wow.clickPrev = function () {
                var wow = this;
                function handler (e) {
                    e.preventDefault();
                    if($(this).is('.disabled') || wow.changing) {
                        return;
                    }
                    wow.changing = true;
                    functions.prevSlide(wow, function () {
                        wow.changing = false;
                    });
                }
                return handler;
            }

            // creator for "next slide" click handler 
            $wow.clickNext = function () {
                var wow = this;
                function handler (e) {
                    e.preventDefault();
                    if($(this).is('.disabled') || wow.changing) {
                        return;
                    }
                    wow.changing = true;
                    functions.nextSlide(wow, function () {
                        wow.changing = false;
                    });
                }
                return handler;
            }

            // creator for "Nth slide" click handler 
            $wow.clickNth = function (slideIndex) {
                var wow = this;
                function handler (e){
                    e.preventDefault();
                    if(wow.changing){
                        return;
                    }
                    wow.changing = true
                    functions.makeCurrent(wow, slideIndex, function (){
                        wow.changing = false;
                    }); 
                }
                return handler;
            }

            if(config.agenda){
                $wow.controls.agenda = $("<div/>").addClass('slide-agenda').appendTo($wow);
            }

            $wow.slides.each(function (i, el){
                if($(el).hasClass('current')) {
                    $wow.current = i;
                }
                $(el).on('click', $wow.clickNext())
                var slideTitle = $(el).children('.title').text() || i+1;
                if(config.agenda){
                    $("<a href='#' />").text(slideTitle).appendTo($wow.controls.agenda).on('click', $wow.clickNth(i))
                }
            });


            if (config.arrows){
                $wow.controls.prevArrow = $("<a href='#'>prev</a>").addClass('slide-prev').on('click', $wow.clickPrev());
                $wow.controls.nextArrow = $("<a href='#'>next</a>").addClass('slide-next').on('click', $wow.clickNext());
                $("<div />")
                    .addClass("arrow")
                    .append($wow.controls.prevArrow)
                    .append($wow.controls.nextArrow)
                    .insertBefore($wow.slides.first());
            }

            functions.makeCurrent($wow, $wow.current);
        })
    }

})(jQuery)