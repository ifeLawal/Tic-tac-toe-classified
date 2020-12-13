
class Navigation {
    // I need to rename
    constructor(navName, placement) {
        this.name = navName;
        this.placement = placement;
        // this.emit = emit;
        this.injectHTML();
    }

    injectHTML() {
        let button = document.createElement('a');
        button.innerHTML = this.name;
        button.classList.add("btn", "btn--margin-small");
        let siteLink = encodeURIComponent(this.name);
        button.setAttribute('href', `/${siteLink}`);
        this.placement.insertAdjacentElement('beforeend', button);
        // button.addEventListener('click', this.emit);
    }
    
}

export default Navigation;