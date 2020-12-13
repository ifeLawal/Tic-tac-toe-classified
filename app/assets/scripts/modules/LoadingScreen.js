class LoadingScreen {
    constructor() {
        this.waitingForPlayerScreen = document.createElement('div');
        this.injectHTML();
    }

    injectHTML() {
        // let waitingForPlayerScreen = document.createElement('div');
        this.waitingForPlayerScreen.innerHTML = `
            <div class="loading-screen">
                <div class="loading-screen__message">
                    Waiting for other player
                    </div>
                <div class="loading-screen__dots">
                    <span>.</span><span>.</span><span>.</span>
                </div>
            </div>
        `;
        document.body.insertAdjacentElement('afterbegin', this.waitingForPlayerScreen);
    }

    removeHTML() {
        document.body.removeChild(this.waitingForPlayerScreen);
    }
}

export default LoadingScreen