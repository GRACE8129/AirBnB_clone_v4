window.addEventListener('load', function () {
  // Retrieve the status from the server using AJAX
  $.ajax('http://0.0.0.0:5001/api/v1/status').done(function (data) {
    // Check if the status is 'OK' and update the API status indicator accordingly
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  // Initialize an empty object to store selected amenity IDs
  const amenityIds = {};

  // Handle checkbox click events for amenities
  $('.amenities input[type=checkbox]').click(function () {
    // Check if the checkbox is checked
    if ($(this).prop('checked')) {
      // Add the amenity ID and name to the amenityIds object
      amenityIds[$(this).attr('data-id')] = $(this).attr('data-name');
    } else if (!$(this).prop('checked')) {
      // Remove the amenity ID from the amenityIds object if unchecked
      delete amenityIds[$(this).attr('data-id')];
    }
    // Update the display of selected amenities
    if (Object.keys(amenityIds).length === 0) {
      $('div.amenities h4').html('&nbsp;');
    } else {
      $('div.amenities h4').text(Object.values(amenityIds).join(', '));
    }
  });

  // Initialize empty objects to store selected state and city IDs
  const stateIds = {};
  const cityIds = {};

  // Handle button click event for filtering places
  $('.filters button').click(function () {
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      contentType: 'application/json',
      // Send selected amenity, state, and city IDs as JSON data to the server
      data: JSON.stringify({
        amenities: Object.keys(amenityIds),
        states: Object.keys(stateIds),
        cities: Object.keys(cityIds)
      })
    }).done(function (data) {
      // Clear existing places and append new ones
      $('section.places').empty();
      $('section.places').append('<h1>Places</h1>');
      // Iterate over the retrieved places data and generate HTML templates for each place
      for (const place of data) {
        const template = `<article>
        <div class="title">
        <h2>${place.name}</h2>
        <div class="price_by_night">
      $${place.price_by_night}
      </div>
        </div>
        <div class="information">
        <div class="max_guest">
        <i class="fa fa-users fa-3x" aria-hidden="true"></i>

        <br />

      ${place.max_guest} Guests

      </div>
        <div class="number_rooms">
        <i class="fa fa-bed fa-3x" aria-hidden="true"></i>

        <br />

      ${place.number_rooms} Bedrooms
      </div>
        <div class="number_bathrooms">
        <i class="fa fa-bath fa-3x" aria-hidden="true"></i>

        <br />

      ${place.number_bathrooms} Bathroom

      </div>
        </div>
        <div class="description">

      ${place.description}

      </div>

      </article> <!-- End 1 PLACE Article -->`;
        $('section.places').append(template);
      }
    });
  });

  // Handle checkbox click events for states
  $('.stateCheckBox').click(function () {
    if ($(this).prop('checked')) {
      // Add the state ID and name to the stateIds object when checked
      stateIds[$(this).attr('data-id')] = $(this).attr('data-name');
    } else if (!$(this).prop('checked')) {
      // Remove the state ID from the stateIds object when unchecked
      delete stateIds[$(this).attr('data-id')];
    }
    // Update the display of selected states and cities
    if (Object.keys(stateIds).length === 0 && Object.keys(cityIds).length === 0) {
      $('.locations h4').html('&nbsp;');
    } else {
      $('.locations h4').text(Object.values(stateIds).concat(Object.values(cityIds)).join(', '));
    }
  });

  // Handle checkbox click events for cities
  $('.cityCheckBox').click(function () {
    if ($(this).prop('checked')) {
      // Add the city ID and name to the cityIds object when checked
      cityIds[$(this).attr('data-id')] = $(this).attr('data-name');
    } else if (!$(this).prop('checked')) {
      // Remove the city ID from the cityIds object when unchecked
      delete cityIds[$(this).attr('data-id')];
    }
    // Update the display of selected states and cities
    if (Object.keys(stateIds).length === 0 && Object.keys(cityIds).length === 0) {
      $('.locations h4').html('&nbsp;');
    } else {
      $('.locations h4').text(Object.values(cityIds).concat(Object.values(stateIds)).join(', '));
    }
  });
});

