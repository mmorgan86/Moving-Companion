function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // GOOGLE MAPS API (LOAD STREET VIEW)
    let gMaprsUrl = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location='
    let streetStr = $('#street').val()
    let cityStr = $('#city').val()
    let location = `${streetStr},${cityStr}`

    // check to see if streetStr gets a value
    if (streetStr == "") {
         $greeting.text(`So, you want to live in ${cityStr}`)
    } else {
        $greeting.text(`So, you want to live at ${streetStr} ${cityStr} `)
    }


    // $greeting.text(`So, you want to live at ${streetStr} ${cityStr} `)
    
    $body.append(`<img class="bgimg" src="${gMaprsUrl}${location}">`)

    // NEW YORK TIMES AJAX REQUEST
    let nyApiKey = "4f56e3e0f3c247a990dc2905b91af736"
    let nyTimesUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${cityStr}&sort=newest&api-key=${nyApiKey}`

    $.getJSON(nyTimesUrl, function (data) {
        $nytHeaderElem.text(`New York Times Articles About ${cityStr}`)

        let articles = data.response.docs
        articles.forEach(function (article) {
            $nytElem.append(`<li class="article"> <a target="_blank" href="${article.web_url}">${article.headline.main}</a><p>${article.snippet}</p></li>`)
        })
    }).fail(function (e) {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded')
    })

    // WIKIPEDIA AJAX REQUEST
    let wikiUrl = `http://www.wikipedia.org/w/api.php?action=opensearch&search=${cityStr}&format=json&callback=wikiCallback`

    let wikiRequestTimeout = setTimeout(function () {
        $wikiElem.text("failed to get wikipedia resources")
    }, 8000)

    $.ajax({
        url: wikiUrl,
        dataType: 'jsonp',
        // jsonp: "callback",
        success: function (response) {
            let articleList = response[1]

            articleList.forEach(function (article) {
                let url = `http://en.wikipedia.org/wiki/wiki${article}`
                $wikiElem.append(`<li><a href="${url}" target="_blank">${article}</a></li>`)
            })

            clearTimeout(wikiRequestTimeout)
        }
    })
    return false;
};

$('#form-container').submit(loadData);