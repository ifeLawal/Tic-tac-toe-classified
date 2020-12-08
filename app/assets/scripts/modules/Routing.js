// Initial page load - If someone visits a URL directly instead of clicking our links/buttons
const startingLocation = window.location.pathname;

class Routing {
    constructor() {

    }

    currentLocation() {
        return startingLocation;
    }
}

export default Routing;