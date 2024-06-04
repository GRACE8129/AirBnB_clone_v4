window.addEventListener('load', function () {
  // Task 3: Check API status and update UI accordingly
  $.ajax('http://0.0.0.0:5001/api/v1/status').done(function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available'); // Add 'available' class if status is OK
    } else {
      $('#api_status').removeClass('available'); // Remove 'available' class otherwise
    }
  });

  // Task 2: Handle amenities checkbox selection and update the amenities h4
  const amenityIds = {};
  $('input[type=checkbox]').click(function () {
    if ($(this).prop('checked')) {
      // Add amenity to the list if checked
      amenityIds[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      // Remove amenity from the list if unchecked
      delete amenityIds[$(this).attr('data-id')];
    }
    // Update the h4 tag inside the div.amenities with selected amenities or a non-breaking space if none selected
    if (Object.keys(amenityIds).length === 0) {
      $('div.amenities h4').html('&nbsp;');
    } else {
      $('div.amenities h4').text(Object.values(amenityIds).join(', '));
    }
  });

  // Task 4: Fetch places and append them to the places section
  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    contentType: 'application/json',
    data: JSON.stringify({}) // Send an empty JSON object as the POST body
  }).done(function (data) {
    for (const place of data) {
      // Template for each place's article
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
            ${place.number_bathrooms} Bathrooms
          </div>
        </div>
        <div class="description">
          ${place.description}
        </div>
      </article> <!-- End 1 PLACE Article -->`;
      
      // Append the generated template to the places section
      $('section.places').append(template);
    }
  });
});

