const pgImagesInput = document.getElementById('pgImages');
const imagePreview = document.getElementById('imagePreview');
const uploadArea = document.getElementById('uploadArea');

// Store selected files
let filesArray = [];
function renderSinglePreview(file, index) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const container = document.createElement('div');
        container.classList.add('preview-image-container');
        container.setAttribute('data-index', index);
        container.style.position = 'relative';

        const img = document.createElement('img');
        img.src = event.target.result;
        img.classList.add('preview-image');

        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '×';
        removeBtn.classList.add('remove-btn');
        removeBtn.onclick = (e) => {
            e.preventDefault();
            removeFile(index);
        };

        const zoomBtn = document.createElement('button');
        zoomBtn.innerHTML = '🔍';
        zoomBtn.classList.add('zoom-btn');
        zoomBtn.onclick = (e) => {
            e.preventDefault();
            openModal(event.target.result);
        };

        container.appendChild(img);
        container.appendChild(removeBtn);
        container.appendChild(zoomBtn);
        imagePreview.appendChild(container);
    };
    reader.readAsDataURL(file);
}

pgImagesInput.addEventListener('change', handleFiles);

// Drag & Drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
});

function handleFiles(e) {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
}
function updateInputFiles() {
    const dataTransfer = new DataTransfer();
    filesArray.forEach(file => dataTransfer.items.add(file));
    pgImagesInput.files = dataTransfer.files;
}

function addFiles(newFiles) {
    newFiles.forEach((file) => {
        if (file.type.startsWith('image/')) {
            filesArray.push(file);
            renderSinglePreview(file, filesArray.length - 1); 
        }
    });

    updateInputFiles();
}


function removeFile(index) {
    filesArray.splice(index, 1);

    // Remove the specific image DOM element
    const target = imagePreview.querySelector(`[data-index="${index}"]`);
    if (target) target.remove();

    // Re-index remaining items so further remove buttons work correctly
    Array.from(imagePreview.children).forEach((child, i) => {
        child.setAttribute('data-index', i);
        const btn = child.querySelector('.remove-btn');
        if (btn) {
            btn.onclick = (e) => {
                e.preventDefault();
                removeFile(i);
            };
        }
    });

    updateInputFiles();
}


function renderPreview() {
    imagePreview.innerHTML = '';
    filesArray.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function (event) {
            const container = document.createElement('div');
            container.classList.add('preview-image-container');
            container.style.position = 'relative';

            const img = document.createElement('img');
            img.src = event.target.result;
            img.classList.add('preview-image');

            // ❌ Remove Button
            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '×';
            removeBtn.classList.add('remove-btn');
            removeBtn.onclick = () => removeFile(index);

            // 🔍 Zoom Button
            const zoomBtn = document.createElement('button');
            zoomBtn.innerHTML = '🔍';
            zoomBtn.classList.add('zoom-btn');
            zoomBtn.onclick = () => openModal(event.target.result);

            container.appendChild(img);
            container.appendChild(removeBtn);
            container.appendChild(zoomBtn);
            imagePreview.appendChild(container);
        };
        reader.readAsDataURL(file);
    });

    // Update input's FileList
    const dataTransfer = new DataTransfer();
    filesArray.forEach(file => dataTransfer.items.add(file));
    pgImagesInput.files = dataTransfer.files;
}

// Modal image view
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeModal = document.querySelector('.closeModal');

function openModal(src) {
    modal.style.display = 'flex';
    modalImg.src = src;
}

closeModal.onclick = () => {
    modal.style.display = 'none';
};

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

document.getElementById("pgForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    try {
        const response = await fetch("/pg/register", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (response.ok) {
            showResponse("PG Registered","green")
            setTimeout(() => {
                window.location.href= "/";
            }, 1000); 
            
        } else {
            showResponse("Failed to register PG: " + result.err,"red");
        }
    } catch (error) {
        showResponse("Error submiting the form:- " + error.err,"red");
    }
});
