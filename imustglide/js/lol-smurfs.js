document.addEventListener('DOMContentLoaded', function () {

    // Read more / less toggle
    document.querySelectorAll('.smurfs-read-more').forEach(btn => {
        btn.addEventListener('click', function () {
            const card = this.closest('.smurfs-unleash-card');
            const textEl = card.querySelector('.smurfs-unleash-text');
            const isExpanded = textEl.classList.contains('expanded');

            if (isExpanded) {
                textEl.classList.remove('expanded');
                textEl.textContent = textEl.getAttribute('data-short');
                this.textContent = 'Read more ↓';
            } else {
                if (!textEl.getAttribute('data-short')) {
                    textEl.setAttribute('data-short', textEl.textContent);
                }
                textEl.classList.add('expanded');
                textEl.textContent = textEl.getAttribute('data-full');
                this.textContent = 'Read less ↑';
            }
        });
    });

});