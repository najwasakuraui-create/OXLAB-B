document.addEventListener("DOMContentLoaded", () => {
    const tray = document.getElementById('pieces-tray');
    const grid = document.getElementById('grid-container');
    const overlay = document.getElementById('overlay');

    // Force hide the popup on load just in case
    if (overlay) {
        overlay.classList.add('hidden');
    }

    // REPLACE WITH YOUR IMAGE URL
    const imageURL = "img/Logo-OX-Biru.png"; 
    let snappedCount = 0;

    // 1. Create Grid Slots
    for (let i = 0; i < 9; i++) {
        const slot = document.createElement('div');
        slot.classList.add('drop-zone');
        slot.dataset.index = i;
        grid.appendChild(slot);
    }

    // 2. Create and Shuffle Pieces
    let pieces = [];
    for (let i = 0; i < 9; i++) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.dataset.index = i;
        piece.style.backgroundImage = `url(${imageURL})`;
        
        const row = Math.floor(i / 3);
        const col = i % 3;
        
        piece.style.backgroundPosition = `${col * 50}% ${row * 50}%`;
        
        addDragEvents(piece);
        pieces.push(piece);
    }

    // Shuffle and add to tray
    pieces.sort(() => Math.random() - 0.5).forEach(p => tray.appendChild(p));

    function addDragEvents(el) {
        let isDragging = false;
        let offset = { x: 0, y: 0 };

        const start = (e) => {
            isDragging = true;
            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            
            offset.x = clientX - el.getBoundingClientRect().left;
            offset.y = clientY - el.getBoundingClientRect().top;
            
            el.style.position = 'fixed';
            el.style.zIndex = 1000;
            move(e);
        };

        const move = (e) => {
            if (!isDragging) return;
            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            
            el.style.left = (clientX - offset.x) + 'px';
            el.style.top = (clientY - offset.y) + 'px';
        };

        const end = (e) => {
            if (!isDragging) return;
            isDragging = false;
            el.style.zIndex = 1;

            const clientX = e.type.includes('mouse') ? e.clientX : e.changedTouches[0].clientX;
            const clientY = e.type.includes('mouse') ? e.clientY : e.changedTouches[0].clientY;

            // Hide piece briefly to see what is underneath
            el.style.display = 'none';
            const dropTarget = document.elementFromPoint(clientX, clientY);
            const slot = dropTarget?.closest('.drop-zone');
            el.style.display = 'block';

            if (slot && slot.dataset.index === el.dataset.index && !slot.hasChildNodes()) {
                // MATCH!
                slot.appendChild(el);
                el.style.position = 'relative';
                el.style.left = '0';
                el.style.top = '0';
                el.classList.add('snapped');
                
                // Remove events so it can't be dragged again
                el.onmousedown = el.ontouchstart = null; 
                
                checkWin();
            } else {
                // FAIL - Return to tray
                el.style.position = 'relative';
                el.style.left = '0';
                el.style.top = '0';
                tray.appendChild(el);
            }
        };

        // Mouse Listeners
        el.onmousedown = start;
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', end);

        // Touch Listeners
        el.ontouchstart = start;
        el.ontouchmove = (e) => { 
            // Only prevent default if we are actually dragging
            if (isDragging) e.preventDefault(); 
            move(e); 
        };
        el.ontouchend = end;
    }

    function checkWin() {
        // Count how many pieces are safely snapped in the grid
        const piecesInGrid = document.querySelectorAll('.grid .piece.snapped').length;
        
        if (piecesInGrid === 9) {
            setTimeout(() => {
                overlay.classList.remove('hidden');
            }, 500);
        }
    }
});