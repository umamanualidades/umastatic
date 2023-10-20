	/* Google Ads */
    (adsbygoogle = window.adsbygoogle || []).push({
        google_ad_client: "ca-pub-6168305907433563",
        enable_page_level_ads: true
    });
    (adsbygoogle = window.adsbygoogle || []).onload = function() {
        [].forEach.call(document.getElementsByClassName('adsbygoogle'), function() {
            adsbygoogle.push({})
        })
    }
	/* Analytics */
    var tagga4 = document.createElement("script");
    tagga4.src = "https://www.googletagmanager.com/gtag/js?id=G-6BY227YM24";
    document.getElementsByTagName("head")[0].appendChild(tagga4);
    setTimeout(function() {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-6BY227YM24');}, 3000);
    setTimeout(function() {
        gtag('event', 'sin_rebote', {
          'event_category': 'por_tiempo',
          'event_label': 'Engagement',
          'non_interaction': true
        });
      }, 30000);
      	/* Funciones uma */
    function addelvideo(video) {
        $('#YTplayer').html('<iframe id="player" pl="" type="text/html" width="640" height="390"allowfullscreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen" msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen"  src="https://www.youtube.com/embed/' + video + '?enablejsapi=1" frameborder="0"></iframe>');
    };
    $('#comment').click(function() {
        $('.comment-form-author').show();
        $('.comment-form-email').show();
        $('.comment-form-url').show();
        $('.comment-form-cookies-consent').show();
    });
    function responsivemenu() {
        var x = document.getElementById("myTopnav");
        var y = document.getElementById("myTopbutton");
        if (x.className === "topnav") {
            x.className += " responsive";
            y.className += " menu_is_opened";
        } else {
            x.className = "topnav";
            y.className = "wprmenu_icon";
        }
    }
	/* Lazyload */
                var wpcf7 = {
                    "apiSettings": {
                        "root": "https:\/\/www.umamanualidades.com\/wp-json\/contact-form-7\/v1",
                        "namespace": "contact-form-7\/v1"
                    },
                    "cached": "1"
                };
                var tocplus = {
                    "visibility_show": "mostrar",
                    "visibility_hide": "ocultar",
                    "visibility_hide_by_default": "1",
                    "width": "Auto"
                };
				var bhittani_plugin_kksr_js = {
					"nonce": "d78b626d49",
					"grs": true,
					"ajaxurl": "https:\/\/www.umamanualidades.com\/wp-admin\/admin-ajax.php",
					"func": "kksr_ajax",
					"msg": "Punt\u00faa este post",
					"fuelspeed": 400,
					"thankyou": "Gracias por tu voto",
					"error_msg": "Ha ocurrido un error",
					"tooltip": "1",
					"tooltips": [{
						"tip": "",
						"color": "#ffffff"
					}, {
						"tip": "",
						"color": "#ffffff"
					}, {
						"tip": "",
						"color": "#ffffff"
					}, {
						"tip": "",
						"color": "#ffffff"
					}, {
						"tip": "",
						"color": "#ffffff"
					}]
				};
			var tag2 = document.createElement("script");
			tag2.src = "https://www.umamanualidades.com/wp-content/plugins/table-of-contents-plus/front.min.js";
			document.getElementsByTagName("head")[0].appendChild(tag2);
			var tag5 = document.createElement("script");
			tag5.src = "https://www.umamanualidades.com/wp-content/plugins/kk-star-ratings/js.min.js";
			document.getElementsByTagName("head")[0].appendChild(tag5);
                function lazyLoadThumb(e) {
                    var t = '<img loading="lazy" data-lazy-src="https://i.ytimg.com/vi/ID/hqdefault.jpg" alt="" width="480" height="360"><noscript><img src="https://i.ytimg.com/vi/ID/hqdefault.jpg" alt="" width="480" height="360"></noscript>',
                        a = '<div class="play"></div>';
                    return t.replace("ID", e) + a
                }

                function lazyLoadYoutubeIframe() {
                    var e = document.createElement("iframe"),
                        t = "ID?autoplay=1";
                    t += 0 === this.dataset.query.length ? '' : '&' + this.dataset.query;
                    e.setAttribute("src", t.replace("ID", this.dataset.src)), e.setAttribute("frameborder", "0"), e.setAttribute("allowfullscreen", "1"), e.setAttribute("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"), this.parentNode.replaceChild(e, this)
                }
                document.addEventListener("DOMContentLoaded", function() {
                    var e, t, a = document.getElementsByClassName("rll-youtube-player");
                    for (t = 0; t < a.length; t++) e = document.createElement("div"), e.setAttribute("data-id", a[t].dataset.id), e.setAttribute("data-query", a[t].dataset.query), e.setAttribute("data-src", a[t].dataset.src), e.innerHTML = lazyLoadThumb(a[t].dataset.id), e.onclick = lazyLoadYoutubeIframe, a[t].appendChild(e)
                });