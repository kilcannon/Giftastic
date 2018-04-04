
$('document').ready(function() {

	var topics = ["aerobics", "moonwalk", "miami vice", "smurfs", "parachute pants", "roller skates", "back to the future",
  "bill and ted", "breakfast club", "die hard", "max headroom", "olivia newton john", "punky brewster", "ninja turtles",
  "jem", "pac man", "inspector gadget", "reading rainbow", "rainbow brite", "thundercats", "pretty in pink"]
	var gifSubject = ""
  // var favIndex = 0

	function buttonPrintOut() { //prints buttons to top of page
	  $("#gif-buttons").empty();

	  for (var i = 0; i < topics.length; i++) {
	    var button = $("<button>").text(topics[i])
	    button.addClass(topics[i])
	    button.addClass("button")
	    button.attr("gif-subject", topics[i])
	    $("#gif-buttons").append(button)
	  }
	}

  function addNewButton () { //adds a new button to the list at the top of the page
    $("#add-gif").on("click", function() {

      event.preventDefault();

      var newGifSubject = $("#gif-subject-input").val().trim()
      topics.push(newGifSubject)
      $("#gif-subject-input").val("")

    })
  }

	function displayGifResults() { //pushes gif results from query of giphy api
		$("#gif-output").empty()

    var numResults = $("#numResults").val()
	  var gifSubject = $(this).attr("gif-subject");
	  var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=JNBLlQfqCDk5qEafePPjwLNtkT8X3TnD&q=" +
	  gifSubject + "&limit=" + numResults + "&offset=0&lang=en"

	  $.ajax({
	    url: queryURL,
	    method: "GET"
	  }).then(function(response) {

      console.log(response)

	  	for (var i = 0; i < response.data.length; i++) {
		  	
        stillImageURL = response.data[i].images.fixed_width_still.url
        animatedImageURL = response.data[i].images.fixed_width.url
        tinyImageURL = response.data[i].images.fixed_width_small.url
        gifRating = response.data[i].rating

        var newDiv = $("<div>")
        var newImage = $("<img>")
        var favButton = $("<button>❤</button>")
        var dlButton = $("<button>💾</button>")

        newDiv.addClass("gif-result")
        newImage.addClass("gif-result-" + i)

        newDiv.html(newImage)

        favButton.addClass("favButton")
        favButton.attr("favButton", "favButton-" + i)
        dlButton.addClass("dlButton")
        dlButton.attr("dlButton", "dlButton-" + i)
        newImage.attr('src', stillImageURL)
        newImage.attr("data-still", stillImageURL)
        newImage.attr("data-animate", animatedImageURL)
        newImage.attr("data-preview", tinyImageURL)
        newImage.attr("data-state", "still")
        newDiv.append($('<p>').text("Gif Rating: " + gifRating))
        newDiv.append(favButton)
        newDiv.append(dlButton)
        
        $("#gif-output").append(newDiv)
		}
		})
	}

  function imageFlipper () { //checks if image is currently still or animated and flips the state of image
    if ($(this).attr("data-state") === "still") {
      $(this).attr('src', $(this).data('animate'))
      $(this).attr('data-state', 'animate')
    }
    else {
      $(this).attr('src', $(this).data('still'))
      $(this).attr('data-state', 'still')
    }
  }

  function addFavorite() { //adds preview gifs to the favorites section of the page
    var tinyImage = $('<img>')
    var testInput = $(this).attr("favButton").replace('favButton-', '.gif-result-')
    var newTinyURL = $(testInput).attr("data-preview")
    tinyImage.attr('src', newTinyURL)
    tinyImage.addClass('favorite-gif')
    $("#favorites").append(tinyImage)
  }

  function downloadGif(e) {  //allows user to download images populated in the primary gif container
    e.preventDefault()

    var filePointer = $(this).attr("dlButton").replace('dlButton-', '.gif-result-')
    var fileURL = $(filePointer).attr("data-animate")
    window.location.href = fileURL
    // download(fileURL, "newgif.gif", "image/gif")
  }

  $(document).on("click", "img", imageFlipper) //listens for button click of images to check for animate status
	$(document).on("click", ".button", displayGifResults) //listens for button click to run ajax query of giphy api
  $(document).on("click", "#add-gif", buttonPrintOut) //listens for click of button add to refresh button loadout
  $(document).on("click", ".favButton", addFavorite) //listens for click of button add to favorite section
	$(document).on("click", ".dlButton", downloadGif) //listens for click of button add to download gif
  buttonPrintOut() //initializes button printout to begin giphy searches
  addNewButton() //allows a user to create a new category for buttons to pull giphy results

});