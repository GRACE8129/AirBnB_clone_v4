#!/usr/bin/python3
"""
Flask App integrating with AirBnB static HTML Template
"""
from flask import Flask, render_template
from models import storage
import uuid

# Flask setup
app = Flask(__name__)
app.url_map.strict_slashes = False
port = 5000
host = '0.0.0.0'


# Teardown function for SQLAlchemy session
@app.teardown_appcontext
def teardown_db(exception):
    """
    Teardown function to close the SQLAlchemy Session after each request
    """
    storage.close()


@app.route('/101-hbnb')
def hbnb_filters(the_id=None):
    """
    Renders a custom template with states, cities, and amenities
    """
    # Retrieve state objects from storage
    state_objs = storage.all('State').values()
    
    # Create a dictionary of states with state name as key
    states = {state.name: state for state in state_objs}
    
    # Retrieve amenity objects from storage
    amens = storage.all('Amenity').values()
    
    # Retrieve place objects from storage
    places = storage.all('Place').values()
    
    # Create a dictionary of users with user id as key and full name as value
    users = {user.id: f"{user.first_name} {user.last_name}" for user in storage.all('User').values()}
    
    return render_template('101-hbnb.html',
                           cache_id=uuid.uuid4(),
                           states=state_objs,
                           amens=amens,
                           places=places,
                           users=users)

if __name__ == "__main__":
    """
    Main Flask App
    """
    app.run(host=host, port=port)

