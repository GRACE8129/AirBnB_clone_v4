window.addEventListener('load', function () {
  // Step 1: Perform AJAX request to check API status
  $.ajax('http://0.0.0.0:5001/api/v1/status').done(function (data) {
    // Check if API status is 'OK' and update UI accordingly
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  // Step 2: Handle checkbox clicks to select amenities
  const amenityIds = {}; // Object to store selected amenity IDs and names
  $('input[type=checkbox]').click(function () {
    // Add or remove amenity based on checkbox state
    if ($(this).prop('checked')) {
      amenityIds[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenityIds[$(this).attr('data-id')];
    }
    // Update amenities display based on selected amenities
    if (Object.keys(amenityIds).length === 0) {
      $('div.amenities h4').html('&nbsp;');
    } else {
      $('div.amenities h4').text(Object.values(amenityIds).join(', '));
    }
  });

  // Step 3: Handle search button click to retrieve places data
  $('.filters button').click(function () {
    // Perform AJAX POST request to retrieve places data based on selected amenities
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      contentType: 'application/json',
      data: JSON.stringify({ amenities: Object.keys(amenityIds) })
    }).done(function (data) {
      // Clear existing places data and append new data to the UI
      $('section.places').empty().append('<h1>Places</h1>');
      for (const place of data) {
        // Generate HTML template for each place and append to the UI
        const template = `<article>
          <div class="title">
            <h2>${place.name}</h2>
            <div class="price_by_night">$${place.price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest"><i class="fa fa-users fa-3x" aria-hidden="true"></i><br />${place.max_guest} Guests</div>
            <div class="number_rooms"><i class="fa fa-bed fa-3x" aria-hidden="true"></i><br />${place.number_rooms} Bedrooms</div>
            <div class="number_bathrooms"><i class="fa fa-bath fa-3x" aria-hidden="true"></i><br />${place.number_bathrooms} Bathroom</div>
          </div>
          <div class="description">${place.description}</div>
        </article>`; // End of article template
        $('section.places').append(template);
      }
    });
  });
});

