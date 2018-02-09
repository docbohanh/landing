!function(a) {
    a.fn.serializeFormJSON = function() {
        var b = {}
          , c = this.serializeArray();
        return a.each(c, function() {
            b[this.name] ? (b[this.name].push || (b[this.name] = [b[this.name]]),
            b[this.name].push(this.value || "")) : b[this.name] = this.value || ""
        }),
        b
    }
}(jQuery),
$(document).ready(function() {
    function a() {
        particlesJS.load("landing", "js/particles.json")
    }
    function b() {
        t.each(function() {
            $(this).find(u).outerHeight() + 450 > $(window).height() && $(this).addClass("scroll-bar")
        })
    }
    function c(a, b) {
        a.css({
            "-webkit-transition": "transform " + b + "s ease-in-out",
            "-webkit-transition": "-webkit-transform " + b + "s ease-in-out",
            "-moz-transition": "transform " + b + "s ease-in-out",
            "-o-transition": "transform " + b + "s ease-in-out",
            transition: "transform " + b + "s ease-in-out"
        })
    }
    function d(a, b, c, d) {
        a.css({
            "-webkit-transform": "translate3d(" + b + "px, " + c + "px, " + d + "px)",
            "-ms-transform": "translate3d(" + b + "px, " + c + "px, " + d + "px)",
            "-moz-transform": "translate3d(" + b + "px, " + c + "px, " + d + "px)",
            "-o-transform": "translate3d(" + b + "px, " + c + "px, " + d + "px)",
            transform: "translate3d(" + b + "px, " + c + "px, " + d + "px)"
        })
    }
    function e() {
        d(r, 0, -$(window).height(), 0),
        setTimeout(function() {
            pJSDom[0].pJS.particles.move.enable = !1,
            r.css({
                visibility: "hidden"
            })
        }, 1200),
        setTimeout(function() {
            landingIsActive = !1
        }, 200)
    }
    function f() {
        var a = $("img");
        a.each(function() {
            $(this).attr("src", o + $(this).attr("src"))
        })
    }
    function g() {
        v.off("click").on("click", function() {
            window.history.length > 2 ? window.history.back() : window.open("/", "_self")
        })
    }
    function h() {
        w.each(function() {
            "cta_form" === $(this).attr("button-type") && $(this).on("click", function() {
                var a = $(this).parents(".section-detail").find(".apply-job-form-wrap").slideToggle();
                return a.load("views/apply-job-form.php", function() {
                    var a = $(".section-detail .call-to-action").find(".message");
                    $(a[0]).removeClass("active"),
                    $(a[1]).addClass("active"),
                    $(this).find("#apply-job-form").prepend("<input class='appliedJob' type='hidden' name='appliedJob'>");
                    var b = $(this).closest(".section-detail").find("h1").text();
                    $appliedJobInput = $("#apply-job-form .appliedJob"),
                    $appliedJobInput.val(b),
                    $(this).slideToggle(function() {
                        var a = $(this).parents(".section-detail-wrap")
                          , b = a.scrollTop() + 600;
                        a.scrollTop(b),
                        $(this).parents(".section-detail").find(".call-to-action .content-button").css({
                            display: "none"
                        })
                    });
                    var c = grecaptcha.render("jobRecaptcha", {
                        sitekey: n
                    });
                    j(c),
                    k(),
                    i(),
                    l(c)
                }),
                !1
            })
        })
    }
    function i() {
        var a = $(".form-label")
          , b = ($(".upload-name"),
        $(".file"));
        a.each(function(a, b) {
            $(b).next(".form-field").on("focus", function() {
                $(b).addClass("is-focused")
            }),
            $(b).next(".form-field").on("focusout", function() {
                "" === $(this).val() && $(b).removeClass("is-focused")
            })
        }),
        b.each(function() {
            $(this).on("change", function() {
                var a = $(this).val().split(/(\\|\/)/g).pop();
                $(this).parents(".form-group").find(".upload-name").text(a)
            })
        })
    }
    function j() {
        $("#apply-job-form").validate({
            rules: {
                name: {
                    required: !0,
                    minlength: 2
                },
                email: {
                    required: !0,
                    email: !0
                },
                applyCV: {
                    required: !0,
                    extension: "pdf|doc|docx|txt"
                },
                message: {
                    required: !0
                },
                jobHiddenRecaptcha: {
                    required: function() {
                        return "" === grecaptcha.getResponse()
                    }
                }
            }
        })
    }
    function k() {
        var a = $("textarea");
        a.each(function() {
            $(this).focus(function() {
                $(this).animate({
                    height: "80px"
                }, 200, function() {
                    var a = $(this).parents(".jspScrollable");
                    if (0 !== a.length) {
                        var b = a.data("jsp");
                        b && b.reinitialise()
                    } else
                        $(this).parents(".content-wrap").jScrollPane({
                            contentWidth: "0px"
                        })
                }),
                insideScrollableArea = !0
            }),
            $(this).blur(function() {
                0 === $(this).val().length && $(this).animate({
                    height: "41px"
                }, 200, function() {
                    var a = $(this).parents(".jspScrollable")
                      , b = a.data("jsp");
                    b && b.reinitialise()
                }),
                insideScrollableArea = !1
            })
        })
    }
    function l(a) {
        $("#apply-job-form").on("submit", function(b) {
            b.preventDefault();
            var c = $(this).serializeFormJSON();
            if ($(this).valid()) {
                var d = $(this).find("#applyCV")[0].files[0]
                  , e = d.name;
                m(d).then(function(b) {
                    var d = {
                        _links: {
                            type: {
                                href: "https://pitechbo.pitechplus.com/rest/type/file/document"
                            }
                        },
                        filename: [{
                            value: e
                        }],
                        uri: [{
                            value: "public://job_applications/" + e
                        }],
                        data: [{
                            value: b
                        }]
                    };
                    $.ajax({
                        type: "POST",
                        url: q,
                        data: JSON.stringify(d),
                        contentType: "application/hal+json"
                    }).done(function(b) {
                        if (b.uuid[0].value)
                            c["cv-uuid"] = b.uuid[0].value,
                            $.ajax({
                                type: "POST",
                                url: p,
                                data: JSON.stringify(c),
                                contentType: "application/json"
                            }).done(function(b) {
                                var c = $(".jobFormResponse")
                                  , d = c.closest("form");
                                d[0].reset(),
                                $("label").removeClass("is-focused"),
                                $(".form-label.upload-name").html("Upload CV"),
                                c.html(b.message),
                                c.addClass(b.class),
                                grecaptcha.reset(a)
                            });
                        else {
                            var d = $(".jobFormResponse");
                            d.html("Failed to upload file"),
                            d.addClass("error")
                        }
                    })
                })
            }
        })
    }
    function m(a) {
        return new Promise(function(b, c) {
            var d = new FileReader;
            d.readAsDataURL(a),
            d.onload = function() {
                b(d.result.split(",")[1])
            }
            ,
            d.onerror = function(a) {
                c(a)
            }
        }
        )
    }
    var n = "6LdPsioUAAAAACLDJj36FmGhYppFKn10eFrUiLFK"
      , o = "https://pitechbo.pitechplus.com/"
      , p = o + "rest/job-applications?_format=json"
      , q = o + "entity/file?_format=hal+json"
      , r = $("#landing")
      , s = $("#_sections").find(">div").first()
      , t = $(".section-detail-wrap")
      , u = $(".section-content")
      , v = $(".close-section-detail")
      , w = $(".call-to-action .content-button");
    a(),
    g(),
    f(),
    h(),
    setTimeout(function() {
        s.css({
            visibility: "visible"
        }),
        e(),
        d(s, 0, 0, 0),
        c(s, 0),
        b()
    }, 200)
});
