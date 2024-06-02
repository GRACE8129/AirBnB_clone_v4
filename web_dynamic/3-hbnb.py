#!/usr/bin/python3
"""
Flask App that integrates with AirBnB static HTML Template
"""
from flask import Flask, render_template
from models import storage
import uuid

# Flask setup
app = Flask(__name__)
app.url_map.strict_slashes = False  # Disable strict trailing slash behavior
port = 5000  # Port number for the Flask app
host = '0.0.0.0'  # Host address to run the Flask app on

# Flask teardown context
@app.teardown_appcontext
def teardown_db(exception):
    """
    After each request, this method calls .close() (i.e., .remove()) on
    the current SQLAlchemy Session to ensure the session is properly closed.
    """
    storage.close()

# Flask route for the custom template
@app.route('/3-hbnb')
def hbnb_filters(the_id=None):
    """
    Handles request to custom template with states, cities, and amenities
    """
    # Retrieve all State objects
    state_objs = storage.all('State').values()
    # Create a dictionary of states with their names as keys
    states = {state.name: state for state in state_objs}
    
    # Retrieve all Amenity objects
    amens = storage.all('Amenity').values()
    
    # Retrieve all Place objects
    places = storage.all('Place').values()
    
    # Create a dictionary of users with their IDs as keys and full names as values
    users = {user.id: "{} {}".format(user.first_name, user.last_name)
             for user in storage.all('User').values()}
    
    # Render the template with the retrieved data
    return render_template('3-hbnb.html',
                           cache_id=uuid.uuid4(),  # Unique cache ID for cache busting
                           states=states,
                           amens=amens,
                           places=places,
                           users=users)

if __name__ == "__main__":
    """
    MAIN Flask App
    - Runs the Flask app with the specified host and port.
    """
    app.run(host=host, port=port)

