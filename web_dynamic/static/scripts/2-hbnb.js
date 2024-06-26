$(document).ready(function () {
  const amenities = {};

  $('input[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      amenities[$(this).data('id')] = $(this).data('name');
    } else {
      delete amenities[$(this).data('id')];
    }
    updateAmenitiesList();
  });

  function updateAmenitiesList() {
    const amenitiesList = Object.values(amenities).join(', ');
    $('.amenities h4').text(amenitiesList);
  }
});

$.get('http://0.0.0.0:5001/api/v1/status/', function(data, textStatus) {
  if (textStatus === 'success' && data.status === 'OK') {
    $('#api_status').addClass('available');
  } else {
    $('#api_status').removeClass('available');
  }
});