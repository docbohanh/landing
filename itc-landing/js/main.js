(function ($) {
    $.fn.serializeFormJSON = function () {

        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });

        return o;

    };
})(jQuery);

var RECAPTCHA_SITE_KEY = '6LdykzEUAAAAAG7AVRXUcJLFFF7RdnANfsebq74m';
var FB_APP_ID = '1856031038006908';

var WS_BASE = "https://pitechbo.pitechplus.com/";
var CONTACT_FORM_URL = WS_BASE + "rest/contact-submissions?_format=json";
var NEWSLETTER_FORM_URL = WS_BASE + "rest/newsletter?_format=json";

var EMAIL_DOMAIN = "pitechplus.com";
var CONTACT_EMAIL = "contact";
var PARIS_EMAIL = "paris";
var LYON_EMAIL = "lyon";

var $htmlBody = $('html, body');
var $main = $('#main');
var $left = $('.left');
/* left section */
var numberOfSections = $left.length;
var duration = 1200;
var landingIsActive = true;
var changingSection = false;
var $landing = $('#landing');
var $landingTitle = $('#landing div.center');
var $landingButton = $('#landing .scroll-down-button');
var $right = $('.right');
/* right section */
var $rightOverlay = $("#animated-image-overlay");
var $sectionWrap = $('.left .content-wrap');
var $sliderSelector = $('.slider');
var $mainMenu = $('#main-menu');
var $menu = $('#slide-menu');
var $menuOverlay = $('#menu-overlay');
var $menuItemsWrap = $('#menu-items');
var $openMenuButton = $('#main-menu .open-menu-button');
var $closeMenuButton = $('#slide-menu .close-menu-button');
var $scrollBar = $('#scroll-progress');
var scrollTranslateValX = -$scrollBar.outerWidth();
var $openSectionDetail = $('.open-section-detail');
var $closeSectionDetail = $('.close-section-detail');
var $closeJob = $('.job .close-section-detail');
var $sectionDetail = $('.section-detail');
var $sectionDetailWrap = $('.section-detail-wrap');
var $sectionDetailContent = $('.section-content');
var $firstSection = $('#_sections').find('>section').first();
var $mobileSection = $('.mobile-section');
var mobileNumberOfSections = $mobileSection.length;
var menuHeight = $('#main-menu').outerHeight();
var lastScrollTop = $(window).scrollTop();
var sectionScrollTop = null;
var insideScrollableArea = false;
var mobileBreakPoint = 1024;
var windowHeight = $(window).outerHeight();
var scrolling = false;
var $contactForm = $('#contact-form');
var $openApplyJob = $('.job .call-to-action .content-button');
var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox');

/** ------------------- START DESKTOP FUNCTIONS --------------------- */

/** Initialize landing particles plugin */
function particles() {
    particlesJS.load('landing', 'js/particles.json');
}

/** Set transition for $element with prefeixes */
function setTransition($element, transitionDuration) {
    $element.css({
        "-webkit-transition": "transform " + transitionDuration + "s ease-in-out",
        "-webkit-transition": "-webkit-transform " + transitionDuration + "s ease-in-out",
        "-moz-transition": "transform " + transitionDuration + "s ease-in-out",
        "-o-transition": "transform " + transitionDuration + "s ease-in-out",
        "transition": "transform " + transitionDuration + "s ease-in-out"
    });
}

/** Set X, Y, Z translate values for $element with prefeixes. The values can't be in percentage */
function setTranslate($element, translateX, translateY, translateZ) {
    $element.css({
        "-webkit-transform": "translate3d(" + translateX + "px, " + translateY + "px, " + translateZ + "px)",
        "-ms-transform": "translate3d(" + translateX + "px, " + translateY + "px, " + translateZ + "px)",
        "-moz-transform": "translate3d(" + translateX + "px, " + translateY + "px, " + translateZ + "px)",
        "-o-transform": "translate3d(" + translateX + "px, " + translateY + "px, " + translateZ + "px)",
        "transform": "translate3d(" + translateX + "px, " + translateY + "px, " + translateZ + "px)"
    });
}


/** Fade in landing title and button */
function landingFadeIn() {
    $landingTitle.addClass('fade-in');
    $landingButton.addClass('fade-in');
}

/** Scroll up the landing when clicking the bottom button */
function changeLanding() {
    $landingButton.off('click').on('click', function () {
        scrollUpLanding();
        window.history.pushState($firstSection.attr('data-id'), "", $firstSection.attr('data-id'));
    });
    return false;
}

/** Get the current active section in desktop view. Used in the funntions that change the sections */
function getCurrentSection() {
    var currentSectionIndex;
    $left.each(function (index, element) {
        /** The active section will always have the offset property of 0 */
        if (parseInt($(element).attr('offset')) === 0) {
            currentSectionIndex = index;
        }
    });
    return currentSectionIndex;
}

/** Initialzie sections */
function setInitialPositions() {
    if ($(window).width() > mobileBreakPoint) {
        $left.each(function (index, element) {
            /** each section will have a translateY value equal to the window height multiplied by its index */
            var translateVal = index * $(window).height();
            /** we store the current translate value in an attribute for later use */
            $(element).attr("offset", translateVal);
            setTranslate($(element), 0, translateVal, 0);
        });
    } else {
        return;
    }
}

/** Recalculate all sections when resizing from mobile */
function resizeToDesktop() {
    /** if we are in the process of changing sections, we can't use the scroll wheel */
    changingSection = true;
    $main.outerHeight("100vh");
    /** reload landing particles */
    setTimeout(function () {
        window["pJSDom"][0].pJS.fn.vendors.start();
    }, 100);
    /** store current mobile section */
    var $mobileCurrent = $('.current');
    var mobileCurrentIndex = $mobileCurrent.index();
    /** reset landing */
    $landing.css({"z-index": "-1", "position": "fixed", "top": "0", "bottom": "0"});
    setTranslate($landing, 0, -$(window).outerHeight(), 0);

    /** check if landing was the section currently active on mobile*/
    if (mobileCurrentIndex === 0) {
        setTimeout(function () {
            /** reinitialize  */
            scrollDownLanding();
            setInitialPositions();
            initScrollProgress();
        }, 500);
        landingIsActive = true;
    } else {
        setTimeout(function () {
            $left.each(function (index, element) {
                /** the mobile index is larger than on the desktop by 1 */
                var newIndex = (index - mobileCurrentIndex + 1);
                /** set the new translateY value for sections, just like in setInitialPositions, but using the new index */
                var translateVal = newIndex * $(window).outerHeight();
                $(element).attr("offset", translateVal);
                setTranslate($(element), 0, translateVal, 0);
                /** new active section */
                if (newIndex == 0) {
                    initScrollProgress();
                    changeScrollProgress(0, index);
                    $(this).next('.right').removeClass('mobile').addClass('fade-in');
                } else {
                    /** rest of sections */
                    $(this).next('.right').removeClass('mobile').addClass('fade-out');
                }
            });
        }, 500);
        landingIsActive = false;
    }
    $mobileCurrent.removeClass('current');
    //window.scrollTo(0, 0);
    lastScrollTop = window.pageYOffset;
    setTimeout(function () {
        /** we can now use scroll wheel again */
        changingSection = false;
    }, 500);
}

/** Recalculate all sections when resizing the window in desktop view */
function resizeRecalculateTranslate() {
    /** using throttle to act on only one resize event every 1000ms */
    $(window).on('resize', _.throttle(function (e) {
        if ($(window).width() > mobileBreakPoint) {
            /** can't use scroll wheel during resize */
            changingSection = true;
            /** calculate by how much the height of the window has changed */
            var newWindowHeight = $(window).outerHeight();
            var heightDiff = newWindowHeight - windowHeight;
            if (!landingIsActive) {
                setTranslate($landing, 0, -newWindowHeight, 0);
            }

            /** change translateY vlaue for all sections */
            $left.each(function (index) {
                var newTranslateVal = parseInt($(this).attr('offset'));
                /** for sections before the current active */
                if ($(this).attr("offset") < 0) {
                    /** each current translateY value needs to be modified by adding or substracting the heightDiff multiplied by how many sections
                     apart each section is from the current active one.
                     Eg: one section has translateY -2700px and the window height is 900px. If the height is reduced by 100px, the new translate will be
                     -2400px, because 2700/900 = 3, which we multiply by heightDiff (100) */
                    newTranslateVal -= (heightDiff * Math.round(Math.abs(newTranslateVal) / windowHeight));
                } else if ($(this).attr("offset") > 0) {
                    /** for sections after the current active */
                    newTranslateVal += (heightDiff * Math.round(Math.abs(newTranslateVal) / windowHeight));
                }
                $(this).attr("offset", newTranslateVal);
                setTranslate($(this), 0, newTranslateVal, 0);
            });

            /** recalculating the height of the 'scroll' progress bar. See funtions initScrollProgress and changeScrollProgress for more details */
            var newScrollTransalteValY = 0;
            /** we recalculate one segment because at this point the bar's height has changed (it's equal to window height) */
            var scrollBarSegment = parseFloat(((($scrollBar.outerHeight() / numberOfSections) * 100) / 100).toFixed(2));
            /** new translateY of the entire progress bar. Similar to the changeScrollProgress function. We need a number of segments equal to
             substracting all the segments from the index of the current one, and adding one so it can be visible. */
            newScrollTransalteValY = parseFloat(((((getCurrentSection() - numberOfSections + 1) * scrollBarSegment) * 100) / 100).toFixed(2));
            $scrollBar.attr("offset", newScrollTransalteValY);
            setTranslate($scrollBar, scrollTranslateValX, newScrollTransalteValY, 0);

            /** recalculate the top position of the blue overlay, so that it doesn't become visible after resize */
            if (parseFloat($rightOverlay.css("top")) > 0) {
                $rightOverlay.css("top", newWindowHeight);
            } else if (parseFloat($rightOverlay.css("top")) < 0) {
                $rightOverlay.css("top", -$rightOverlay.outerHeight() - 50);
            }

            /** update window height*/
            windowHeight = newWindowHeight;
            /** we can use scroll wheel now */
            setTimeout(function () {
                changingSection = false;
            }, 500);
        }
    }, 1000));
}

/** Initialize scroll progress bar */
function initScrollProgress() {
    /** progress bar is divided in segments, one per section. Calculate the height of one segment with 2 decimal points */
    var scrollBarSegment = parseFloat(((($scrollBar.outerHeight() / numberOfSections) * 100) / 100).toFixed(2));
    /** The progress bar grows and shrinks by changing its translateY value. At the beginning (first section), the visible part of progress bar
     * is equal to one segment. (which is a translateY value of negative window height (or progressbar height) but adding one segment) */
    var scrollTranslateValY = parseFloat((((-$scrollBar.outerHeight() + scrollBarSegment) * 100) / 100).toFixed(2));
    /** offset attribute for storing translateY */
    $scrollBar.attr("offset", scrollTranslateValY);
    setTranslate($scrollBar, scrollTranslateValX, scrollTranslateValY, 0);
}

/** Move the progress bar based on changing the current section. This function is called in functions used to navigate between sections */
function changeScrollProgress(currentSectionIndex, nextSectionIndex) {
    /** we need to calculate the segment again because the height might have changed (from resize) */
    var scrollBarSegment = parseFloat(((($scrollBar.outerHeight() / numberOfSections) * 100) / 100).toFixed(2));
    /** navigating to a section below the current one */
    if (currentSectionIndex < nextSectionIndex) {
        /** the new translateY value is calculated based on how many segments the bar needs to grow or shrink.
         * We calculate this by passing in the indexes of the section we are traveling to and of the current section. The difference will always be a positive integer.
         * We add or substract the segment heights to the current translateY */
        var newScrollTranslateValY = parseFloat((((parseFloat($scrollBar.attr('offset')) + ((nextSectionIndex - currentSectionIndex) * scrollBarSegment)) * 100) / 100).toFixed(2));
        setTranslate($scrollBar, scrollTranslateValX, newScrollTranslateValY, 0);
    } else if (currentSectionIndex > nextSectionIndex) {
        /** navigating to a section above the current one */
        var newScrollTranslateValY = parseFloat((((parseFloat($scrollBar.attr('offset')) - ((currentSectionIndex - nextSectionIndex) * scrollBarSegment)) * 100) / 100).toFixed(2));
        setTranslate($scrollBar, scrollTranslateValX, newScrollTranslateValY, 0);
    }
    $scrollBar.attr("offset", newScrollTranslateValY);
}

/** Change contents in the right sections. This is called in the changeLeftSection function. */
function changeRightSection($element, currentSectionIndex, nextSectionIndex) {
    var $nextRight = $element.next($right);
    var $otherRights = $right.not($nextRight);
    var $currentImage = $right.eq(currentSectionIndex).children('.background');
    var overlayHeight = $rightOverlay.outerHeight();
    /** the height of the blue overlay grows during the animation */
    var animatedOverlayHeight = overlayHeight * 2.5;
    $otherRights.removeClass('fade-in').addClass('fade-out');
    /** the new right section is faded in*/
    $nextRight.removeClass('fade-out').addClass('fade-in');
    /** the image of the section from which we are navigating must zoom out*/
    $currentImage.addClass('zoom-out');
    setTimeout(function () {
        /** after it zoomed out and is out of view, we zoom it back in */
        $currentImage.removeClass('zoom-out');
    }, duration);
    /** navigating to a section below the current one */
    if (currentSectionIndex < nextSectionIndex) {
        /** overlay animation starts at the top. During animation of the top positon (equal to window height -> moves downwards), we also increse the
         * overlay height. When animation is finished, change the height back. */
        $rightOverlay.css({"top": -overlayHeight, "visibility": "visible"}).animate({
            top: $(window).height(),
            height: animatedOverlayHeight
        }, duration - 100, function () {
            $(this).css({"height": overlayHeight, "visibility": "hidden"});
        });
    } else if (currentSectionIndex > nextSectionIndex) {
        /** navigating to a section above the current one */
        /** overlay animation starts from the bottom */
        $rightOverlay.css({
            "top": $(window).height(),
            "height": animatedOverlayHeight,
            "visibility": "visible"
        }).animate({top: -overlayHeight, height: overlayHeight}, duration - 100, function () {
            $(this).css({"height": overlayHeight, "visibility": "hidden"});
        });
    }
}

/** Handling all the animations which happen during navigating between sections */
function changeLeftSection(currentSectionIndex, nextSectionIndex) {
    /** Set the URL to keep the current section */
    if ($(window).width() > mobileBreakPoint) {
        var _currSect = $("#_sections > section")[nextSectionIndex];
        window.history.replaceState($(_currSect).attr("data-id"), "", $(_currSect).attr("data-id"));
    }

    /** we can't use scroll wheel during changing */
    changingSection = true;
    /** transition between sections is proportionate to how many sections are changed. Adding 1 necessary for one second, because transitions in CSS use seconds*/
    var transitionDuration = (Math.abs(currentSectionIndex - nextSectionIndex) / 5) + 1;
    /** navigating to a section below the current one */
    if (currentSectionIndex < nextSectionIndex) {
        $left.each(function (index, element) {
            /** change the section translateY value by substracting the window height multiplied by how many sections we change */
            var newTranslateVal = parseInt($(element).attr('offset')) - ((nextSectionIndex - currentSectionIndex) * $(window).outerHeight());
            setTranslate($(element), 0, newTranslateVal, 0);
            setTransition($(element), transitionDuration);
            if (newTranslateVal === 0) {
                /** make the new section visible */
                $(element).css({"opacity": 1});
                changeRightSection($(element), currentSectionIndex, nextSectionIndex);
            } else {
                /** reduce opacity for the rest of the sections during the transition to the new section */
                $(element).animate({opacity: 0.3}, transitionDuration * 500, function () {
                    if (index === nextSectionIndex - 1) {
                        setTimeout(function () {
                            /** we can now use scroll wheel again */
                            changingSection = false;
                        }, 200);
                    }
                });
            }
            /** store the new translate values in the attribute */
            $(element).attr("offset", newTranslateVal);
        });
    } else if (currentSectionIndex >= nextSectionIndex) {
        /** navigating to a section above the current one. Everyhting else is the same as navigating to a section below the current. */
        $left.each(function (index, element) {
            var newTranslateVal = parseInt($(element).attr('offset')) + ((currentSectionIndex - nextSectionIndex) * $(window).outerHeight());
            setTranslate($(element), 0, newTranslateVal, 0);
            setTransition($(element), transitionDuration);
            if (newTranslateVal === 0) {
                $(element).css({"opacity": 1});
                changeRightSection($(element), currentSectionIndex, nextSectionIndex);
            } else {
                $(element).animate({"opacity": 0.3}, transitionDuration * 500, function () {
                    if (index === $left.length - 1) {
                        setTimeout(function () {
                            changingSection = false;
                        }, 200);
                    }
                });
            }
            $(element).attr("offset", newTranslateVal);
        });
    }
    ;
}

/** Called when using scroll wheel up */
function scrollUp() {
    var currentSectionIndex = getCurrentSection();
    var nextSectionIndex = currentSectionIndex - 1;
    if (nextSectionIndex !== -1) {
        changeLeftSection(currentSectionIndex, nextSectionIndex);
        changeScrollProgress(currentSectionIndex, nextSectionIndex);
    }
}

/** Called when using scroll wheel down */
function scrollDown() {
    var currentSectionIndex = getCurrentSection();
    var nextSectionIndex = currentSectionIndex + 1;
    changeLeftSection(currentSectionIndex, nextSectionIndex);
    changeScrollProgress(currentSectionIndex, nextSectionIndex);
}

/** Close the landing section */
function scrollUpLanding() {
    setTranslate($landing, 0, -$(window).height(), 0);
    setTimeout(function () {
        /** Remove the landing particles */
        pJSDom[0].pJS.particles.move.enable = false;
        $landing.css({"visibility": "hidden"});
    }, 1200);
    setTimeout(function () {
        landingIsActive = false;
        /** false -> scroll wheel can open the landing back now */
    }, 200);
}

/** Open the landing section */
function scrollDownLanding() {
    window.history.replaceState(".", "", ".");
    landingIsActive = true;
    /** true -> scroll wheel can close the landing back now */
    $landing.css({"visibility": "visible", "z-index": "200"});
    setTimeout(function () {
        /** Restart landing particles */
        pJSDom[0].pJS.particles.move.enable = true;
        pJSDom[0].pJS.fn.particlesRefresh();
    }, 200);
    setTranslate($landing, 0, 0, 0);
}

/** Handle navigation between sections using the mouse wheel */
function scrollWheel() {
    /**  Listen for mouse wheen events.
     * Support is as follows when using jQuery bind: "wheel" works in Firefox and IE but not Chrome. "mousewheel" works in Chrome and Safari. "DOMMouseScroll" works only in Firefox.
     * We detect if the browser is Firefox and use the event property deltaY, which has the following values: -1 for up one "click" and 1 for one down "click".
     * IE10 and IE11 also can only use the deltaY property. This has been later added, so the detection of Firefox is possibly redundant since we already get the deltaY value at the beginning and store it in the delta variable.
     * The wheelDelta event property can have the following values: 120 when mouse is moved up one "click" and -120 when mouse is moved down one "click".
     * Some older versions of Opera only have the detail event property, so we need to multiply that by -120.
     *
     * We use Lodash throttle to only act on one mouse wheel event every 1200ms.
     */
    $htmlBody.unbind('wheel mousewheel DOMMouseScroll').bind('wheel mousewheel DOMMouseScroll', _.throttle(function (e) {
        /** we store in a variable the value we get from the corresponsing event properties: either detail, wheelDelta, deltaY. Multiply detail
         * with -120 and deltaY with 120 to get the same values. */
        var delta = e.originalEvent.detail ? e.originalEvent.detail * (-120) : (e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : e.deltaY * 120);
        /** Here we check if we can perform section changing. We can't change section if menu is opened or section detail is opened or
         * mouse is inside scrollable area or we are already in the middle of changing sections (during transitions). We also check if we are in dekstop view, just in case.
         */


        if (!($menu.hasClass('is-opened')) && !($sectionDetail.hasClass('is-opened')) && !insideScrollableArea && ($(window).width() > mobileBreakPoint) && !changingSection) {
            /** If not Firefox */

            if (isFirefox === -1) {
                /** Going up */
                if (delta / 120 > 0) {
                    /** If we are currently at the first section and we scroll up, the landing page should open back. */
                    if (($left.attr("offset") === "0") && !landingIsActive) {
                        scrollDownLanding();
                    } else {
                        scrollUp();
                    }
                } else if (landingIsActive) {
                    /** If landing page is active and we scroll down, we close the landing page. */
                    scrollUpLanding();
                    /** URL change */
                    $firstSection = $('#_sections').find('>section').first();
                    window.history.pushState($firstSection.attr('data-id'), "", $firstSection.attr('data-id'));
                } else if ($left.eq(numberOfSections - 1).attr('offset') !== "0") {
                    /** While we are not at the last section. */
                    scrollDown();
                }
            } else {
                /** Same as above, but for Firefox. */
                if (e.deltaY >= 1) {
                    if (($left.attr("offset") === "0") && !landingIsActive) {
                        scrollDownLanding();
                    } else {
                        scrollUp();
                    }
                } else if (landingIsActive) {
                    scrollUpLanding();
                    window.history.pushState($firstSection.attr('data-id'), "", $firstSection.attr('data-id'));
                } else if ($left.eq(numberOfSections - 1).attr('offset') !== "0") {
                    scrollDown();
                }
            }
        }
    }, duration, {trailing: false}));
    /** trailing: false means we don't catch a second event at the end of 1200ms, just the first one. */
}

/** Handle navigation between sections using touch on tablet. This is not used anymore because mobile design is used on tablet. Keep it for later use. */
function scrollTouch() {
    var ts;
    $main.unbind('touchstart').bind('touchstart', _.throttle(function (e) {
        ts = e.originalEvent.touches[0].clientY;
    }, duration, {trailing: false}));
    $main.unbind('touchmove').bind('touchmove', _.throttle(function (e) {
        var te = e.originalEvent.changedTouches[0].clientY;
        if (!($menu.hasClass('is-opened')) && !($sectionDetail.hasClass('is-opened')) && !insideScrollableArea && ($(window).width() > mobileBreakPoint) && !changingSection) {
            if (ts < te) {
                if (($left.attr("offset") === "0") && !landingIsActive) {
                    scrollDownLanding();
                } else {
                    scrollUp();
                }
            } else if (landingIsActive) {
                scrollUpLanding();
            } else if ($left.eq(numberOfSections - 1).attr('offset') !== "0") {
                scrollDown();
            }
        }
    }, duration, {trailing: false}));
}

/** Change section by selecting an option from the menu. */
function menuNavigation() {
    $menuItemsWrap.off('click').on('click', '.menu-item', function () {
        if ($(window).width() > mobileBreakPoint) {
            var clickedSectionIndex = $(this).index();
            var currentSectionIndex = getCurrentSection();
            if (clickedSectionIndex !== currentSectionIndex) {
                changeLeftSection(currentSectionIndex, clickedSectionIndex);
                changeScrollProgress(currentSectionIndex, clickedSectionIndex);
            }
            $menu.removeClass('is-opened');
            $menuOverlay.removeClass('is-opened');
            var _currSect = $("#_sections > section")[clickedSectionIndex];
            setTimeout(function () {
                window.history.pushState($(_currSect).attr("data-id"), "", $(_currSect).attr("data-id"))
            }, 100)
        }
    });
    return false;
}

/** Set height of the inner div of left sections so we can center the content. */
function setContentHeight() {
    var contentHeight = $(window).height() - ($mainMenu.outerHeight() * 2);
    if ($(window).width() > mobileBreakPoint) {
        $sectionWrap.each(function () {
            $(this).css('height', contentHeight);
        });
    }
    /** recalculate it on resize */
    $(window).on('resize', function () {
        if ($(window).width() > mobileBreakPoint) {
            var newContentHeight = $(window).height() - ($mainMenu.outerHeight() * 2);
            $sectionWrap.each(function () {
                $(this).css('height', newContentHeight);
            });
        }
    });
}

/** Navigate to next section. */
function nextSectionButton() {
    var $nextSectionButton = $('.left .next-section-button');
    $nextSectionButton.off('click').on('click', function (e) {
        e.preventDefault();
        scrollDown();
        return false;
    });
}

/** Prevent scrolling on html and body */
function mobileToggleScroll(bool) {
    if ($(window).width() <= mobileBreakPoint) {
        if (bool) {
            $htmlBody.addClass('noscroll');
        } else {
            $htmlBody.removeClass('noscroll');
        }
    }
}

/** There is a bug on iOS which prevents scrolling to be disabled on the body when an overlay is opened, even if applying overflow hidden
 and height 100%. */
function iOSMenuDisableScroll() {
    $(window).on('touchmove', function (event) {
        var isTouchMoveAllowed = true,
            target = event.target;
        while (target !== null) {
            if (target.classList && target.classList.contains('disable-scroll')) {
                isTouchMoveAllowed = false;
                break;
            }
            target = target.parentNode;
        }
        if (!isTouchMoveAllowed) {
            event.preventDefault();
        }
    });
}

function openMainMenu() {
    $openMenuButton.off('click').on('click', function (e) {
        if ($(window).width() <= mobileBreakPoint) {
            $('body').addClass('disable-scroll');
        }
        e.preventDefault();
        $menu.addClass('is-opened');
        //setTranslate($menu, 0, )
        $menuOverlay.addClass('is-opened');
        mobileToggleScroll(true);
        return false;
    });
}

function closeMainMenu() {
    $closeMenuButton.off('click').on('click', function (e) {
        $('body').removeClass('disable-scroll');
        e.preventDefault();
        $menu.removeClass('is-opened');
        $menuOverlay.removeClass('is-opened');
        mobileToggleScroll(false);
    });
    $menuOverlay.off('click').on('click', function (e) {
        $('body').removeClass('disable-scroll');
        e.preventDefault();
        $menu.removeClass('is-opened');
        $menuOverlay.removeClass('is-opened');
        mobileToggleScroll(false);
        return false;
    });
}

/** Open subsection. Sections are all present on page load out of view. They all have an id and the corresponding link for opening each section
 has a 'data-page' attribute with the value equal to that id.  */
function openSection() {
    return; // NOT USED ANYMORE
    $openSectionDetail.on('click', function () {
        /** get the section which needs to be opened */
        var data = $(this).attr('data-page');
        var $openedSection = $('#' + data);

        /** sections have by default a transalteY value of 110%, plus visibility hidden. We open it by changing translateY to 0. */
        $openedSection.css({"visibility": "visible"});
        setTranslate($openedSection, 0, 0, 0);

        /** lazy load section images */
        var $images = $openedSection.find('.lazyload');
        $images.each(function () {
            $(this).attr("src", $(this).attr("data-original"));
            $(this).removeAttr("data-original");
        });

        $openedSection.addClass('is-opened');

        /** Handling for iOS overlay scrolling bug (when an overlay is opened and scroll, the contents under are also scrolled). We store the current
         scrollTop position and when the section is closed, we assing it back to the window, returning to the same position. */
        sectionScrollTop = lastScrollTop;
        iOSEnableSectionScroll();
        mobileToggleScroll(true);

        var _detailPage = $openedSection.attr("id");
        var x = window.history.state + "/" + _detailPage;
        if (x.split("/").length === 2) {
            window.history.pushState(x, "", x);
        }
        x = 0;
        return false;
    });
}

/** Handling for the  iOS ovelay scroll bug. The section can be scrolled inside, but contents under can't. */
function iOSEnableSectionScroll() {
    var selScrollable = '.is-opened .scroll-bar';
    /** Uses document because document will be topmost level in bubbling */
    $(document).on('touchmove', function (e) {
        e.preventDefault();
    });
    /** Uses body because jQuery on events are called off of the element they are added to, so bubbling would not work if we used document instead. */
    $('body').on('touchstart', selScrollable, function (e) {
        if (!scrolling) {
            scrolling = true;
            if (e.currentTarget.scrollTop === 0) {
                e.currentTarget.scrollTop = 1;
            } else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
                e.currentTarget.scrollTop -= 1;
            }
            scrolling = false;
        }
    });
    /** Only block default if internal div contents are large enough to scroll */
    $('body').on('touchmove', selScrollable, function (e) {
        if ($(this)[0].scrollHeight > $(this).innerHeight()) {
            e.stopPropagation();
        }
    });
}

/** Return scroll to body when section is closed. */
function iOSDisableSectionScroll() {
    $(document).off('touchmove');
    $('body').off('touchmove touchstart', '.is-opened .scroll-bar');
}

/** Close section on click exit button and pressing ESC key. */
function closeSection() {
    $closeSectionDetail.on('click', function () {
        var $openedSection = $("section.is-opened");
        doCloseSection($openedSection);
    });

    $(document).keyup(function (e) {
        e.preventDefault();
        if (e.keyCode == 27 && window.history.state.split("/").length === 2) {
            var $openedSection = $("section.is-opened");
            doCloseSection($openedSection);
        }

    });
}

/** Actual logic for closing section. */
function doCloseSection(section) {
    /** Set translateY back to more than section height. */
    section.css({
        "-webkit-transform": "translate3d(0, 120%, 0)",
        "-webkit-transform": "-webkit-translate3d(0, 120%, 0)",
        "-ms-transform": "translate3d(0, 120%, 0)",
        "-moz-transform": "translate3d(0, 120%, 0)",
        "-o-transform": "translate3d(0, 120%, 0)",
        "transform": "translate3d(0, 120%, 0)"
    });
    section.removeClass('is-opened');
    var _location = window.history.state.split("/");

    if ($(window).width() <= mobileBreakPoint) {
        $('html, body').animate({
            scrollTop: $('[data-id="' + _location[0] + '"]').offset().top
        }, 10);
    }
    setTimeout(function () {
        section.css({"visibility": "hidden"});
    }, 1000);
    section.find('.section-detail-wrap').delay(1000).animate({scrollTop: 0}, 700);

    setTimeout(function () {
        window.history.back();
    }, 500);

    /** return scrollTop to beginning inside of section. When it is opened again, it will be at the top.*/
    section.find('.section-detail-wrap').delay(1500).animate({scrollTop: 0}, 700);

    /** Remove iOS overlay scroll hack. Set window to the scroll position we saved when we opened the section. */
    iOSDisableSectionScroll();
    window.scrollTo(0, sectionScrollTop);
    window.setTimeout(function () {
        sectionScrollTop = null;
    }, 0);
    mobileToggleScroll(false);
    return false;
}

/** Add custom scroll bar to left sections when the content is larger than the wrap, using jScrollPane library. */
function addScrollBarToSection() {
    setTimeout(function () {
        $sectionWrap.each(function () {
            $(this).jScrollPane({contentWidth: '0px'});
            if ($(this).find('.jspVerticalBar').length === 0) {
                /** the plugin is initialized by default but if the content fits, the scroll bars are not added.*/
                var $pane = $(this).find('.jspPane');
                $pane.css({
                    'top': 'auto',
                    'left': 'auto'
                });
            }
            /** store the plugin options for each section */
            var api = $(this).data('jsp');
            var throttleTimeout;

            /** add scroll bar on resize if needed */
            $(window).on('resize', function () {
                if ($(window).width() > mobileBreakPoint) {
                    if (!throttleTimeout) {
                        throttleTimeout = setTimeout(function () {
                            if (api) {
                                /** as the plugin is already initialized, it just needs to reinitilaize with the new options (taking account of the new height)*/
                                api.reinitialise();
                                throttleTimeout = null;
                            }
                        }, 50);
                    }
                }
            });
        });

        /** Disable/Enable the mouse wheel event when mouse is inside/outside a left section with a scroll bar. */
        var $scrollable = $('.left .content-wrap.jspScrollable');
        $scrollable.on('mouseover touchstart', function () {
            insideScrollableArea = true;
        });
        $scrollable.on('mouseout touchend', function () {
            insideScrollableArea = false;
        });
    }, 100);
}

/** Add scroll bar to sections when they have content larger than window height. Normal browser scroll bar currently. Maybe add custom later. */
function addScrollBarToSectionDetail() {
    $sectionDetailWrap.each(function () {
        if ($(this).find($sectionDetailContent).outerHeight() > $(window).height()) {
            $(this).addClass('scroll-bar');
        }
    });
}

/** Create dots timeline on Our Story page. */
function addDotOurStory() {
    var $left = $('#timeline .timeline-left');
    var $right = $('#timeline .timeline-right');
    var $bottomLeft = $left.find('.timeline-entry:last-of-type');
    var $bottomRight = $right.find('.timeline-entry:last-of-type');
    /** Check on which site the content is larger and add the last dot there. */
    if ($left.outerHeight() > $right.outerHeight()) {
        $bottomLeft.addClass('dot');
    } else {
        $bottomRight.addClass('dot');
    }
}

/** Navigate from Clients section or from Clients pages to Contact Us section. */
function becomeClientNavigation() {
    var $clientsSectionButton = $('#become-client .content-button');
    var $clientsPageButton = $('.section-detail.client .content-button');
    var contactSectionIndex = numberOfSections - 1;
    $clientsSectionButton.on('click', function () {
        var currentSectionIndex = getCurrentSection();
        changeLeftSection(currentSectionIndex, contactSectionIndex);
        changeScrollProgress(currentSectionIndex, contactSectionIndex);
        return false;
    });
    $clientsPageButton.on('click', function () {
        var currentSectionIndex = getCurrentSection();
        setTimeout(function () {
            changeLeftSection(currentSectionIndex, contactSectionIndex);
        }, 500);
        setTimeout(function () {
            changeScrollProgress(currentSectionIndex, contactSectionIndex);
        }, 500);
        return false;
    });
}

function showNewsletter() {
    var $newsletterSubscribe = $('#subscribe-newsletter');
    var $mobileWrap = $newsletterSubscribe.find('.mobile-wrap');
    var $mobileWrapForm = $newsletterSubscribe.find('.mobile-wrap-form');

    var $openFormButton = $mobileWrap.find('a');
    var $sendFormButton = $mobileWrapForm.find('a');

    $openFormButton.off('click').on('click', function () {
        $mobileWrap.css({"display": "none"});
        $mobileWrapForm.css({"display": "block"});
    });

    $sendFormButton.off('click').on('click', function () {
        $(this).closest('form').submit();
    })
}

function submitNewsletter() {
    var $newsletterForm = $('#newsletter-form');
    var $newsletterSubscribe = $('#subscribe-newsletter');
    var $mobileWrap = $newsletterSubscribe.find('.mobile-wrap');
    var $mobileWrapForm = $newsletterSubscribe.find('.mobile-wrap-form');

    $newsletterForm.off('submit').on('submit', function (e) {
        e.preventDefault();
        var data = $(this).serializeFormJSON();
        if ($(this).valid()) {
            $.ajax({
                type: 'POST',
                url: NEWSLETTER_FORM_URL,
                data: JSON.stringify(data),
                contentType: 'application/json'
            }).done(function (response) {
                var $callToAction = $newsletterSubscribe.find('.call-to-action');
                $callToAction.html('<h3 class="' + response.status + '">' + response.message + '</h3>');
                $mobileWrap.css('display', 'flex');
                $mobileWrapForm.css('display', 'none')
            }).fail(function (xhr, textStatus, errorThrown) {
                var message = xhr.responseJSON.message;
                var $callToAction = $newsletterSubscribe.find('.call-to-action');

                $callToAction.html('<h3>' + message + '</h3>');
                $mobileWrap.css('display', 'flex');
                $mobileWrapForm.css('display', 'none');
            }).always(function () {
                var $newsletterForm = $('#newsletter-form');
                $newsletterForm[0].reset();
            })
        }
    })
}

/** ------------------- END DESKTOP FUNCTIONS --------------------- */

/** ------------------- START GENERAL FUNCTIONS --------------------- */

/** Slick slider. */
function sliders() {

    var $sliderSelector = $('.slider');

    $sliderSelector.each(function (slide) {
        $(this).slick({
            dots: false,
            infinite: false,
            speed: 600,
            slidesToShow: 3,
            slidesToScroll: 1,
            responsive: [{
                breakpoint: 769,
                settings: {
                    slidesToShow: 2
                }
            }, {
                breakpoint: 321,
                settings: {
                    slidesToShow: 1
                }
            }]
        });
    });

    /** Disable/enable mouse wheel when inside/outside slider. */
    $sliderSelector.on('mouseover touchstart', function () {
        insideScrollableArea = true;
    });
    $sliderSelector.on('mouseout touchend', function () {
        insideScrollableArea = false;
    });
}

function radioButtons() {
    var $btnLabels = $('.btn-group label');

    $btnLabels.off('click').on('click', function () {
        var radioInput = $(this).find('input');
        radioInput.checked = true;
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
    });
}

/** Set hover images for all pictograms. */
function hoverPictograms() {
    var pictograms = $('[data-pictogram]');
    var pictogramsParent = pictograms.parent();

    pictogramsParent.hover(function () {
        var imgSpan = $(this).find('.link-image');
        if (imgSpan.attr('data-hover') !== undefined) {
            imgSpan.css('background-image', 'url(' + imgSpan.attr('data-hover') + ')');
        } else {
            imgSpan.css('background-image', 'url(' + imgSpan.attr('data-pictogram') + ')');
        }
    }, function () {
        var imgSpan = $(this).find('.link-image');
        imgSpan.css('background-image', 'url(' + imgSpan.attr('data-pictogram') + ')');
    });

    pictograms.each(function () {
        $(this).css('background-image', 'url(' + $(this).attr('data-pictogram') + ')');
    })
}

/** When inside an input or textarea, the label is animated to the top.*/
function animateFormLabels() {
    var $label = $('.form-label');
    var $uploadLabel = $('.upload-name');
    var $fileInput = $('.file');
    $label.each(function (index, element) {
        $(element).next('.form-field').on('focus', function () {
            $(element).addClass('is-focused');
        });
        $(element).next('.form-field').on('focusout', function () {
            if ($(this).val() === '') {
                $(element).removeClass('is-focused');
            }
        });
    });
    /** Change label to the name of the upladed file. */
    $fileInput.each(function () {
        $(this).on('change', function () {
            var name = $(this).val().split(/(\\|\/)/g).pop();
            $(this).parents('.form-group').find('.upload-name').text(name);
        });
    });
}

/** When inside a textarea, its height grows. */
function toggleHeightTxtArea() {
    var textareaList = $("textarea");
    textareaList.each(function () {
        $(this).focus(function () {
            $(this).animate({height: "80px"}, 200, function () {
                /** Add custom scroll bar to section if its height becomes to large when text area grows. */
                var $jspScroll = $(this).parents('.jspScrollable');
                if ($jspScroll.length !== 0) {
                    var api = $jspScroll.data('jsp');
                    if (api) {
                        api.reinitialise();
                    }
                } else {
                    $(this).parents('.content-wrap').jScrollPane({contentWidth: '0px'});
                }
            });
            insideScrollableArea = true;
        });
        $(this).blur(function () {
            /** If textarea is empty and focus moves, return to the default height. */
            if ($(this).val().length === 0) {
                $(this).animate({height: "41px"}, 200, function () {
                    /** Reinitialize scroll bar, so it can be removed in case section content fits again. */
                    var $jspScroll = $(this).parents('.jspScrollable');
                    var api = $jspScroll.data('jsp');
                    if (api) {
                        api.reinitialise();
                    }
                });
            }
            insideScrollableArea = false;
        });
    });
}

/** Initialize Google Map */
function initMap(responsiveZoom) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 46.831, lng: 13.082},
        zoom: responsiveZoom,
        scrollwheel: true,
        disableDefaultUI: true,
        draggable: true,
        styles: [{
            "featureType": "landscape.natural",
            "elementType": "geometry.fill",
            "stylers": [{
                "hue": "#33404a"
            }]
        }, {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "administrative.country",
            "stylers": [{
                "saturation": -5
            }]
        }, {
            "featureType": "administrative.country",
            "elementType": "geometry.stroke",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "administrative.country",
            "elementType": "labels",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "administrative.locality",
            "elementType": "labels",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "landscape.natural",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "landscape.natural.terrain",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "poi",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "road",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "transit",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "water",
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "off"
            }]
        }]
    });
    var cities = {
        cluj: {
            position: {lat: 46.7857668, lng: 23.6073024},
            name: 'Cluj-Napoca',
            icon: {
                url: 'img/map-marker.png',
                labelOrigin: new google.maps.Point(5, -10)
            }
        },
        targumures: {
            position: {lat: 46.5396406, lng: 24.5544196},
            name: 'Targu-Mures',
            icon: {
                url: 'img/map-marker.png',
                labelOrigin: new google.maps.Point(-3, 20)
            }
        },
        lyon: {
            position: {lat: 45.757, lng: 4.765},
            name: 'Lyon',
            icon: {
                url: 'img/map-marker.png',
                labelOrigin: new google.maps.Point(5, -10)
            }
        },
        paris: {
            position: {lat: 48.858, lng: 2.206},
            name: 'Paris',
            icon: {
                url: 'img/map-marker.png',
                labelOrigin: new google.maps.Point(5, -10)
            }
        }
    };
    var markerIcon = {
        url: 'img/map-marker.png',
        labelOrigin: new google.maps.Point(10, 10)
    };
    for (var city in cities) {
        var cityCircle = new google.maps.Marker({
            position: cities[city].position,
            icon: cities[city].icon,
            label: cities[city].name,
            clickable: false,
            map: map
        });
    }
}

function stopScrollOnMap() {
    $(document).mousemove(function (event) {
        if ($('#map:hover').length != 0) {
            insideScrollableArea = true;
        } else {
            insideScrollableArea = false;
        }
    });
}

/** jQuery Validate library. */
function validateContactForm() {

    $contactForm.validate({
        ignore: ".ignore",
        rules: {
            submission_type: {
                required: true
            },
            name: {
                required: true,
                minlength: 2
            },
            email: {
                required: true,
                email: true
            },
            description: {
                required: true
            },
            hiddenRecaptcha: {
                required: function () {
                    return grecaptcha.getResponse() == '';
                }
            }
        }
    });
}

function validateNewsletterForm() {
    $('#newsletter-form').validate({
        rules: {
            email: {
                required: true,
                email: true
            }
        }
    })
}

function submitContact() {
    $contactForm.on('submit', function (e) {
        e.preventDefault();
        var data = $(this).serializeFormJSON();
        if ($(this).valid()) {
            $.ajax({
                type: 'POST',
                url: CONTACT_FORM_URL,
                data: JSON.stringify(data),
                contentType: "application/json"
                //beforeSend: setHeader
            })
                .done(function (response) {
                    /** Use the response in order to display the status message. */
                    var $label = $('#contactFormResponse');
                    var $contactForm = $label.closest('form');
                    $contactForm[0].reset();
                    $('.radio-card').removeClass('active');
                    $('label').removeClass('is-focused');
                    $label.removeAttrs('class');
                    $label.html(response.message);
                    $label.attr('class', response.class);
                    grecaptcha.reset();
                });
        }
    });
}

function generateEmailsContact() {

    var $mailContact = $('.mail-contact');
    var $mailLyon = $('.mail-lyon');
    var $mailParis = $('.mail-paris');

    $mailContact.attr('href', "mailto:" + CONTACT_EMAIL + "@" + EMAIL_DOMAIN).html(CONTACT_EMAIL + "@" + EMAIL_DOMAIN);
    $mailLyon.attr('href', "mailto:" + LYON_EMAIL + "@" + EMAIL_DOMAIN).html(LYON_EMAIL + "@" + EMAIL_DOMAIN);
    $mailParis.attr('href', "mailto:" + PARIS_EMAIL + "@" + EMAIL_DOMAIN).html(PARIS_EMAIL + "@" + EMAIL_DOMAIN);
}

/** ------------------- END GENERAL FUNCTIONS --------------------- */

/** ------------------- START MOBILE FUNCTIONS --------------------- */

/** When resizing window to 1024px width, we must swich to the mobile view. This means we have to reset the translate values of the sections.
 By adding alos relative position from CSS, the page will be scrollable. */
function resizeToMobile() {
    setTimeout(function () {
        /** On mobile, we don't want to show landing page particles, so they are destroyed. */
        if (window["pJSDom"] instanceof Array && window["pJSDom"].length > 0) {
            for (var i = 0; i < window["pJSDom"].length; i++) {
                window["pJSDom"][i].pJS.fn.vendors.destroypJS();
                window["pJSDom"] = [];
            }
        }
    }, 100);
    $main.css({"height": "auto"});
    setTimeout(function () {
        /* Remove jspPane scroll bars - they are not needed because all content is scrollable now. */
        $sectionWrap.each(function () {
            $(this).css({'height': 'auto', 'width': '100%'});
            var $jspPane = $(this).find('.jspPane');
            var $jspCont = $(this).find('.jspContainer');
            var $jspBar = $(this).find('.jspVerticalBar');
            $jspPane.css({'height': 'auto', 'width': '100%'});
            $jspCont.css({'height': 'auto', 'width': '100%'});
            if ($jspBar.length !== 0) {
                $jspBar.css('display', 'none');
            }
        });
    }, 1000);
    /** Reset landing page. */
    $landing.css({
        "-webkit-transform": "none",
        "-ms-transform": "none",
        "-moz-transform": "none",
        "-o-transform": "none",
        "transform": "none",
        "visibility": "visible",
        "position": "relative",
        "top": "auto",
        "bottom:": "auto",
        "z-index": "12"
    });
    /** Reset sections. */
    $left.each(function () {
        $(this).css({
            "-webkit-transform": "none",
            "-ms-transform": "none",
            "-moz-transform": "none",
            "-o-transform": "none",
            "transform": "none",
            "opacity": "1"
        });
    });
    $right.each(function () {
        $(this).addClass('mobile').removeClass('fade-out').removeClass('fade-in');
    });
}

/** When switching between portrait and landscape, we want the scrollTop to be positioned exactly at the start of the current active section. */
function mobileChangeScrollTop() {
    var newScrollTop = 0;

    var route = window.history;
    var _route_split = [];

    var state = route.state;

    if (state) {
        _route_split = route.state.split("/");
    } else {
        route = window.location.pathname.split("/");
        if (route[route.length - 1]) {
            _route_split.push(route[route.length - 1]);
        }
    }

    var $current = $('[data-id=' + _route_split[0] + ']');

    if ($current.length > 0) {
        var currentIndex = $current.index() + 1;

        for (var i = 0; i < currentIndex; i++) {
            newScrollTop = newScrollTop + $mobileSection.eq(i).outerHeight();
        }
        window.scrollTo(0, newScrollTop - menuHeight + 1);
    }
}

/** Used in mobileScrollNavigation for checking if an element is not in view.
 * We check if the element's top edge is below the top of viewport or if the element's bottom edge is above the top of viewport.
 * Returning true means the element is NOT in view. */
function mobileSectionCheckView($elem) {
    var viewTop = $(window).scrollTop() + menuHeight;
    var elemTop = $elem.offset().top;
    var elemBottom = elemTop + $elem.height();
    if ($elem.is('#landing')) {
        /** For the landing page we have to have to take into account the fixed menu. */
        return ((elemBottom < (viewTop - menuHeight)) || (elemTop > (viewTop - menuHeight)));
    } else {
        return ((elemBottom < viewTop) || (elemTop > viewTop));
    }
}


/** At page load, set the landing page as current. */
function setFirstCurrent() {
    $mobileSection.first().addClass('current');
}

/** Track which section is currently in view. Whenever we scroll to a new section, it is flagged as current.
 * Needed for:
 * - changing to the same section in case of resize to desktop;
 * - chaning the URL to reflect the current; */
function mobileScrollNavigation() {
    /** We don't use any throttle here, because we need to know what happens for each scroll event. */
    $(window).on('touchmove scroll', function () {


        /** If somehow we don't have a current, make the landing current. */
        if ($('.current').length <= 0) {
            setFirstCurrent();
        }

        if ($(window).width() <= mobileBreakPoint && $('.current').length) {
            var $current = $('.current');
            var currentScroll = $(this).scrollTop();
            var currentSave;
            /** Make sure scroll is positive becuase on iOS the scroll can have negative values (when dragging downwards when at the top).
             Negative values lead to unwanted behaviours. */
            if (currentScroll >= 0 && lastScrollTop >= 0) {
                var currentIndex = $mobileSection.index($current);

                /** Page has been scrolled down. */
                if (currentScroll > lastScrollTop) {
                    currentSave = $current.next($mobileSection).attr('data-id');
                    /** True means element is not in view anymore, so we make the next one current, as long as there is a next .*/
                    if (mobileSectionCheckView($current)) {
                        $current.removeClass('current');
                        $current = $mobileSection.eq(currentIndex + 1);
                        $current.addClass('current');
                    }
                } else {
                    currentSave = $current.prev($mobileSection).attr('data-id');

                    /** Page has been scrolled up. */
                    /** True means element is not in view anymore, so we make the previous one current, as long as there is aprevious .*/
                    if (mobileSectionCheckView($current)) {
                        $current.removeClass('current');
                        $current = $mobileSection.eq(currentIndex - 1);
                        $current.addClass('current');
                    }
                }
            }
            var path = $current.attr('data-id');

            /** Change URL to current new section. */
            if (currentSave === path || currentSave === undefined) {
                window.history.pushState(path, "", path);
            }

            /** Update global scroll variable. */
            lastScrollTop = currentScroll;
        }

    });
}

/** Go to the section with the newIndex. Used in the next three functions. */
function mobileNavigation(newIndex) {

    if ($(window).width() <= mobileBreakPoint) {
        var $current = $('.current');
        var newScrollTop = 0;
        for (var i = 0; i < newIndex; i++) {
            /** The new scroll position is calculated based on how many sections will be above it, adding their height. */
            newScrollTop += $mobileSection.eq(i).outerHeight();
            if (newIndex === 0) {
                /** For the first section after landing, we also add the menu height, otherwise we would scroll to a position where it is hidden behind the menu. */
                newScrollTop += menuHeight;
            }

        }
        /** If previous current section is landing, we substract the menu height. */
        if (!$current.is($landing)) {
            newScrollTop = newScrollTop - menuHeight + 80;
        }
        newScrollTop = Math.floor(newScrollTop);
        /** Change scroll to new section. */
        window.scrollTo(0, newScrollTop);
        /** Update current. */
        $current.removeClass('current');
        $current = $mobileSection.eq(newIndex);
        $current.addClass('current');

        window.history.pushState($current.attr('data-id'), "", $current.attr('data-id'))

        /** Update global scroll variable. */
        lastScrollTop = newScrollTop;
    }
}

/** When resizing window from desktop to mobile, we navigate to the section that was active on desktop. */
function mobileNavigateFromResize() {
    var currentIndex = 0;
    $left.each(function () {
        /** On desktop, the active section is the one with offset 0. */
        if ($(this).attr('offset') === "0") {
            if (landingIsActive) {
                /** On desktop, when landing is active, the first left section also has offset 0.
                 * So we need to select the parent of the left sction and make the previous mobile section the new current (which is in fact the landing). */
                $(this).parent().prev('.mobile-section').addClass('current');
                /** Store the index of the new current so we can navigate to it. */
                currentIndex = $(this).parent().prev('.mobile-section').index();
            } else {
                /** On mobile, the current class is set on the parent of the left section from desktop. */
                $(this).parent().addClass('current');
                /** Store the index of the new current so we can navigate to it. */
                currentIndex = $(this).parent().index();
            }
        }
    });
    setTimeout(function () {
        /** Use the navigation function with the new index. */
        mobileNavigation(currentIndex);
    }, 200);
}

/** Navigate to a new section from the menu. */
function mobileMenuNavigation() {
    $menuItemsWrap.off('click').on('click', '.menu-item', function () {
        /** URL changing. */
        var _section = $("#_sections > section")[$(this).index()];
        window.history.pushState($(_section).attr("data-id"), "", $(_section).attr("data-id"));

        /** Get the index of the section clicked from the menu. Add 1 because of the landing page. */
        var clickedSectionIndex = $(this).index() + 1;
        /** Use the navigation function with the new index. */
        mobileNavigation(clickedSectionIndex);

        /** Close overlay. */
        $menuOverlay.removeClass('disable-scroll');
        $menu.removeClass('is-opened');
        $menuOverlay.removeClass('is-opened');

        /** Re-enable scrolling on the body. */
        $('body').removeClass('disable-scroll');
        mobileToggleScroll(false);
        return false;
    });
}

/** Navigate to the previous function when clicking the back button in the menu. */
function mobileBackNavigation() {
    var $mobileBackButton = $('#main-menu .mobile-back-button');
    $mobileBackButton.off('click').on('click', function () {
        var $current = $('.current');
        /** Get the index of the previous section. */
        var previousSectionIndex = $mobileSection.index($current) - 1;
        if (previousSectionIndex > 0) {
            /** Use the navigation function with the new index. If we are at the first section, do nothing. */
            mobileNavigation(previousSectionIndex);
        }
        return false;
    });
}

/** Navigate to the Contact Us section from the Clients section or from the clients pages. */
function mobileBecomeClient() {
    var contactSectionIndex = mobileNumberOfSections - 1;
    var $clientsSectionButton = $('#become-client .content-button');
    var $clientsPageButton = $('.section-detail.client .content-button');
    $clientsSectionButton.on('click', function () {
        mobileNavigation(contactSectionIndex);
        return false;
    });
    $clientsPageButton.on('click', function () {
        mobileNavigation(contactSectionIndex);
        return false;
    });
}

/** ------------------- END MOBILE FUNCTIONS --------------------- */

/** Execute all functions when document is ready. */
$(document).on("allRenderDone", function () {

    /** Scroll to top when page loads. Needed for mobile so that page is shown from the beginning on refresh. */
    window.history.scrollRestoration = 'manual';

    window.scrollTo(0, 0);

    $htmlBody = $('html, body');
    $main = $('#main');
    $left = $('.left');
    /* left section */
    numberOfSections = $left.length;
    duration = 1200;
    landingIsActive = true;
    changingSection = false;
    $landing = $('#landing');
    $landingTitle = $('#landing div.center');
    $landingButton = $('#landing .scroll-down-button');
    $right = $('.right');
    /* right section */
    $rightOverlay = $("#animated-image-overlay");
    $sectionWrap = $('.left .content-wrap');
    $sliderSelector = $('.slider');
    $mainMenu = $('#main-menu');
    $menu = $('#slide-menu');
    $menuOverlay = $('#menu-overlay');
    $menuItemsWrap = $('#menu-items');
    $openMenuButton = $('#main-menu .open-menu-button');
    $closeMenuButton = $('#slide-menu .close-menu-button');
    $scrollBar = $('#scroll-progress');
    scrollTranslateValX = -$scrollBar.outerWidth();
    $openSectionDetail = $('.open-section-detail');
    $closeSectionDetail = $('.close-section-detail');
    $closeJob = $('.job .close-section-detail');
    $sectionDetail = $('.section-detail');
    $sectionDetailWrap = $('.section-detail-wrap');
    $sectionDetailContent = $('.section-content');
    $firstSection = $('#_sections').find('>div').first();
    $mobileSection = $('.mobile-section');
    mobileNumberOfSections = $mobileSection.length;
    menuHeight = $('#main-menu').outerHeight();
    lastScrollTop = $(window).scrollTop();
    sectionScrollTop = null;
    insideScrollableArea = false;
    mobileBreakPoint = 1024;
    windowHeight = $(window).outerHeight();
    scrolling = false;
    $contactForm = $('#contact-form');
    $openApplyJob = $('.job .call-to-action .content-button');
    isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox');


    /** store window width in case window will be resized */
    var initWidth = $(window).width();
    /** General functions called for all resolutions*/

    landingFadeIn();
    openMainMenu();
    closeMainMenu();
    openSection();
    closeSection();
    addScrollBarToSectionDetail();
    addDotOurStory();
    animateFormLabels();
    sliders();
    radioButtons();
    hoverPictograms();
    toggleHeightTxtArea();
    validateContactForm();
    submitContact();
    facebookShare();
    showNewsletter();
    submitNewsletter();
    validateNewsletterForm();
    generateEmailsContact();
    /** If desktop resolution */
    if ($(window).width() > mobileBreakPoint) {
        particles();
        setInitialPositions();
        changeLanding();
        scrollWheel();
        scrollTouch();
        initScrollProgress();
        setContentHeight();
        resizeRecalculateTranslate();
        addScrollBarToSection();
        menuNavigation();
        becomeClientNavigation();
        nextSectionButton();
    } else {
        /** If mobile resolution */
        setFirstCurrent();
        mobileScrollNavigation();
        mobileMenuNavigation();
        mobileBecomeClient();
        mobileBackNavigation();
        iOSMenuDisableScroll();
    }

    /** Handling window resize, using Lodash throttle to limit resize events to one every 500 ms */
    $(window).on('resize', _.throttle(function (e) {
        /** Get the new window width */
        /** The new width is compared with the initial width and the appropriate functions are called if needed */
        var newWidth = $(window).width();
        /** reszing from mobile view to desktop view -> the same functions which are called by default in desktop, plus resizeToDesktop and
         resizeRecalculateTranslate */
        if (newWidth > mobileBreakPoint && initWidth <= mobileBreakPoint) {
            scrollWheel();
            scrollTouch();
            particles();
            resizeToDesktop();
            changeLanding();
            setContentHeight();
            resizeRecalculateTranslate();
            addScrollBarToSection();
            nextSectionButton();
            menuNavigation();
            becomeClientNavigation();
            /** resizing to mobile */
        } else if (newWidth <= mobileBreakPoint) {
            /** resizing from desktop to mobile -> the same functions which are called by default in mobile, plus resizeToMobile and
             mobileNavigateFromResize */
            if (initWidth > mobileBreakPoint) {
                resizeToMobile();
                mobileNavigateFromResize();
                mobileScrollNavigation();
                mobileMenuNavigation();
                mobileBecomeClient();
                mobileBackNavigation();
                iOSMenuDisableScroll();
            } else if (newWidth !== initWidth) {
                /** resize from mobile to mobile -> this applies to changing from landscape to portrait (or viceversa) on mobile device */
                mobileChangeScrollTop();
            }
        }
        /** update the new window width */
        initWidth = newWidth;
    }, 500));
    routesFunctionality();
});

/** Initialize Google Map based on resolution because the map zoom differs */
$(window).on('load', function () {
    stopScrollOnMap();
    if ($(window).width() > mobileBreakPoint) {
        initMap(5);
    } else {
        initMap(4);
    }
});

/** ------------------- START ROUTES FUNCTIONS --------------------- */

function routesFunctionality() {
    var route = window.history;
    var _route_split = [];

    var state = route.state;

    if (state) {
        _route_split = route.state.split("/");
    } else {
        route = window.location.pathname.split("/");
        if (route[route.length - 1]) {
            _route_split.push(route[route.length - 1]);
        }
    }

    function goToUrlSection() {
        var $sections = $("#_sections > section");
        var _section = $('[data-id="' + _route_split[0] + '"]');
        var _section_index = _section.index();

        if ($(window).width() > mobileBreakPoint) {
            changeLeftSection(0, _section_index);
            changeScrollProgress(0, _section_index);
            scrollUpLanding();
        } else {
            $sections = $(".mobile-section");
            var i = 0;
            $sections.each(function () {
                if ($(this).attr('data-id') === _route_split[0]) {
                    _section = $(this);
                    _section_index = i;
                }
                i++;
            });

            setTimeout(function () {
                var offset = _section.offset().top;
                $htmlBody.animate({
                    scrollTop: offset
                }, 1200);
            }, 100);
        }
    }

    switch (_route_split.length) {
        case 0:
            break;
        case 1:
            goToUrlSection();
            break;
        default:
    }
}

$(document).on("allRenderDone", function () {
    //routesFunctionality();
});

/** ------------------- END ROUTES FUNCTIONS --------------------- */

/** ------------------- START FACEBOOK SHARE FUNCTIONS --------------------- */

function facebookShare() {
    $('.facebook.icons').click(function (e) {
        e.preventDefault();
        var state = window.history.state;

        var title = "PitechPlus - Engineered to Evolve";
        var description = "means to put human relationships before devices, " +
            "teamwork above one sided guidelines,and viable adjustments over " +
            "strict plans. You will discover this when you partner with us.";
        if (state !== undefined) {
            var section = $('[data-id=' + state + ']');
            title = section.find('h1').text();
            description = "PitechPlus - Engineered to Evolve";
        }

        FB.ui({
            method: 'share',
            href: window.location.href,
            title: title,
            picture: window.location.origin + "/img/share_img.png",
            description: description,
            caption: "PitechPlus",
            name: title
        });
    });
}

/** ------------------- END FACEBOOK SHARE FUNCTIONS --------------------- */ 
