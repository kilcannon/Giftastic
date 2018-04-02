
$('document').ready(function() {

	var topics = ["aerobics", "moonwalk", "miami vice", "smurfs", "parachute pants", "roller skates", "hacky sack", "breakfast club"]
	var gifSubject = ""

	function buttonPrintOut() { //prints buttons to top of page
	  $("#gif-buttons").empty();

	  for (var i = 0; i < topics.length; i++) {
	    var button = $("<button>").text(topics[i])
	    button.addClass(topics[i])
	    button.addClass("button")
	    button.attr("gif-subject", topics[i])
	    $("#gif-buttons").append(button)
	    $("#gif-buttons").append("  ")
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

	  var gifSubject = $(this).attr("gif-subject");
	  var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=JNBLlQfqCDk5qEafePPjwLNtkT8X3TnD&q=" +
	  gifSubject + "&limit=10&offset=0&lang=en"

	  $.ajax({
	    url: queryURL,
	    method: "GET"
	  }).then(function(response) {

      console.log(response)

	  	for (var i = 0; i < response.data.length; i++) {
		  	
        stillImageURL = response.data[i].images.original_still.url
        animatedImageURL = response.data[i].images.original.url
        tinyImageURL = response.data[i].images.preview_gif.url
        gifRating = response.data[i].rating

        var newDiv = $("<div>")
        var newImage = $("<img>")
        var favButton = $("<button>Favorite</button>")

        newDiv.addClass("gif-result")
        newImage.addClass("gif-result-" + i)

        newDiv.html(newImage)

        favButton.addClass("favButton")
        favButton.attr("favButton", "favButton-" + i)
        newImage.attr('src', stillImageURL)
        newImage.attr("data-still", stillImageURL)
        newImage.attr("data-animate", animatedImageURL)
        newImage.attr("data-preview", tinyImageURL)
        newImage.attr("data-state", "still")
        newDiv.append($('<p>').text("Gif Rating: " + gifRating))
        newDiv.append(favButton)
        
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

  function addFavorite() {
    var tinyImage = $('<img>')
    var testInput = $(this).attr("favButton").replace('favButton-', '.gif-result-')
    var newTinyURL = $(testInput).attr("data-preview")
    tinyImage.attr('src', newTinyURL)
    tinyImage.addClass('favorite-gif')
    $("#favorites").append(tinyImage)
    console.log(newTinyURL)
    // var newTinyImageURL = $("").attr('preview')
    // console.log(newTinyImageURL)
    // tinyImage.attr('src', newTinyImageURL)
  }

  $(document).on("click", "img", imageFlipper) //listens for button click of images to check for animate status
	$(document).on("click", ".button", displayGifResults) //listens for button click to run ajax query of giphy api
  $(document).on("click", "#add-gif", buttonPrintOut) //listens for click of button add to refresh button loadout
	$(document).on("click", ".favButton", addFavorite) //listens for click of button add to favorite section
  buttonPrintOut() //initializes button printout to begin giphy searches
  addNewButton()

});