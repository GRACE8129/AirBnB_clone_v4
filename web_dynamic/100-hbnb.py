#!/usr/bin/python3
"""
Flask App that integrates with AirBnB static HTML Template
"""
from flask import Flask, render_template, url_for
from models import storage
import uuid;

# Flask setup
app = Flask(__name__)
app.url_map.strict_slashes = False
port = 5000
host = '0.0.0.0'


# Teardown database session after each request
@app.teardown_appcontext
def teardown_db(exception):
    """
    Closes the current SQLAlchemy Session after each request.

    Parameters:
        exception (Exception): Any exception that occurred during the request.
    """
    storage.close()


# Route for rendering custom template with filters
@app.route('/100-hbnb')
def hbnb_filters():
    """
    Handles the request to render a custom template with filters for states, cities, and amenities.

    Retrieves data from the database including states, amenities, places, and users.
    Constructs dictionaries for states and users using dictionary comprehension.
    Renders the template '100-hbnb.html' with the retrieved data.

    Returns:
        render_template: The rendered template with filtered data.
    """
    # Retrieve data from the database
    state_objs = storage.all('State').values()
    states = {state.name: state for state in state_objs}
    amens = storage.all('Amenity').values()
    places = storage.all('Place').values()
    users = {user.id: f"{user.first_name} {user.last_name}" for user in storage.all('User').values()}
    
    # Render the template with the retrieved data
    return render_template('100-hbnb.html',
                           cache_id=uuid.uuid4(),
                           states=state_objs,
                           amens=amens,
                           places=places,
                           users=users)

if __name__ == "__main__":
    """
    Main Flask App
    """
    # Run the Flask application
    app.run(host=host, port=port)
