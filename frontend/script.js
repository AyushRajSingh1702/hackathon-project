/* =========================================================
   LUNAENHANCE AI
   Space Animation + AI Enhancement
========================================================= */

const BACKEND_URL = "http://127.0.0.1:5000";


/* =========================================================
   ELEMENTS
========================================================= */

const imageInput = document.getElementById("imageInput");
const fileName = document.getElementById("fileName");

const browseBtn = document.getElementById("browseBtn");

const imageUrl = document.getElementById("imageUrl");
const urlButton = document.getElementById("urlButton");

const enhanceBtn = document.getElementById("enhanceBtn");

const loading = document.getElementById("loading");

const selectedPreview =
    document.getElementById("selectedPreview");

const resultSection =
    document.getElementById("resultSection");

const originalImage =
    document.getElementById("originalImage");

const enhancedImage =
    document.getElementById("enhancedImage");

const downloadBtn =
    document.getElementById("downloadBtn");

const imageModal =
    document.getElementById("imageModal");

const modalImage =
    document.getElementById("modalImage");

const closeImageModal =
    document.getElementById("closeImageModal");


let selectedFile = null;
let selectedPreviewURL = null;


/* =========================================================
   BACKEND URL HELPER
========================================================= */

function makeBackendURL(path) {

    if (!path) {
        return "";
    }

    path = String(path).trim();

    if (!path) {
        return "";
    }

    if (
        path.startsWith("http://") ||
        path.startsWith("https://") ||
        path.startsWith("blob:") ||
        path.startsWith("data:")
    ) {
        return path;
    }

    return (
        BACKEND_URL +
        "/" +
        path.replace(/^\/+/, "")
    );
}


/* =========================================================
   SPACE STARS
========================================================= */

function createStars() {

    const container =
        document.getElementById("stars");

    if (!container) {
        return;
    }

    const fragment =
        document.createDocumentFragment();

    const count =
        window.innerWidth < 700
            ? 100
            : 220;

    for (let i = 0; i < count; i++) {

        const star =
            document.createElement("div");

        star.className =
            Math.random() > 0.9
                ? "star big"
                : "star";

        star.style.left =
            `${Math.random() * 100}%`;

        star.style.top =
            `${Math.random() * 100}%`;

        star.style.setProperty(
            "--duration",
            `${2 + Math.random() * 5}s`
        );

        star.style.setProperty(
            "--delay",
            `${Math.random() * 5}s`
        );

        fragment.appendChild(star);
    }

    container.appendChild(fragment);
}


/* =========================================================
   ASTEROIDS
========================================================= */

function createAsteroids() {

    const container =
        document.getElementById("asteroids");

    if (!container) {
        return;
    }

    const fragment =
        document.createDocumentFragment();

    const count =
        window.innerWidth < 700
            ? 12
            : 28;

    for (let i = 0; i < count; i++) {

        const asteroid =
            document.createElement("div");

        asteroid.className =
            "asteroid";

        asteroid.style.setProperty(
            "--size",
            `${8 + Math.random() * 28}px`
        );

        asteroid.style.setProperty(
            "--left",
            `${Math.random() * 100}%`
        );

        asteroid.style.setProperty(
            "--fall",
            `${7 + Math.random() * 14}s`
        );

        asteroid.style.setProperty(
            "--delay",
            `${-Math.random() * 18}s`
        );

        asteroid.style.setProperty(
            "--drift",
            `${-100 + Math.random() * 200}px`
        );

        asteroid.style.setProperty(
            "--opacity",
            0.25 + Math.random() * 0.6
        );

        fragment.appendChild(asteroid);
    }

    container.appendChild(fragment);
}


/* =========================================================
   METEORS
========================================================= */

function createMeteors() {

    const container =
        document.getElementById("meteors");

    if (!container) {
        return;
    }

    const fragment =
        document.createDocumentFragment();

    const count =
        window.innerWidth < 700
            ? 4
            : 9;

    for (let i = 0; i < count; i++) {

        const meteor =
            document.createElement("div");

        meteor.className =
            "meteor";

        meteor.style.setProperty(
            "--left",
            `${15 + Math.random() * 80}%`
        );

        meteor.style.setProperty(
            "--top",
            `${Math.random() * 35}%`
        );

        meteor.style.setProperty(
            "--duration",
            `${3 + Math.random() * 5}s`
        );

        meteor.style.setProperty(
            "--delay",
            `${Math.random() * 8}s`
        );

        meteor.style.setProperty(
            "--angle",
            `${25 + Math.random() * 20}deg`
        );

        fragment.appendChild(meteor);
    }

    container.appendChild(fragment);
}


/* =========================================================
   INITIALIZE SPACE
========================================================= */

createStars();
createAsteroids();
createMeteors();


/* =========================================================
   BROWSE LUNAR IMAGES
========================================================= */

function browseLunarImages() {

    const query =
        "Chandrayaan-2 OHRC lunar surface permanently shadowed region";

    const googleURL =
        "https://www.google.com/search?tbm=isch&q=" +
        encodeURIComponent(query);

    window.open(
        googleURL,
        "_blank",
        "noopener,noreferrer"
    );
}


if (browseBtn) {

    browseBtn.addEventListener(
        "click",
        browseLunarImages
    );
}


/* =========================================================
   FILE SELECTION
========================================================= */

if (imageInput) {

    imageInput.addEventListener(
        "change",
        function () {

            if (
                !this.files ||
                this.files.length === 0
            ) {

                selectedFile = null;

                if (fileName) {
                    fileName.textContent =
                        "No image selected";
                }

                if (enhanceBtn) {
                    enhanceBtn.disabled =
                        true;
                }

                hidePreview();

                return;
            }

            selectedFile =
                this.files[0];

            if (fileName) {

                fileName.textContent =
                    selectedFile.name;
            }

            showPreview(
                selectedFile
            );

            if (enhanceBtn) {

                enhanceBtn.disabled =
                    false;
            }

            console.log(
                "📁 Selected file:",
                selectedFile.name
            );
        }
    );
}


/* =========================================================
   SHOW PREVIEW
========================================================= */

function showPreview(file) {

    if (!selectedPreview) {
        return;
    }

    if (selectedPreviewURL) {

        URL.revokeObjectURL(
            selectedPreviewURL
        );
    }

    selectedPreviewURL =
        URL.createObjectURL(file);


    selectedPreview.innerHTML = `
        <img
            src="${selectedPreviewURL}"
            alt="Selected lunar image"
        >
    `;


    selectedPreview.classList.add(
        "show"
    );
}


/* =========================================================
   HIDE PREVIEW
========================================================= */

function hidePreview() {

    if (!selectedPreview) {
        return;
    }

    if (selectedPreviewURL) {

        URL.revokeObjectURL(
            selectedPreviewURL
        );

        selectedPreviewURL =
            null;
    }

    selectedPreview.innerHTML =
        "";

    selectedPreview.classList.remove(
        "show"
    );
}


/* =========================================================
   LOAD IMAGE FROM URL
========================================================= */

if (urlButton) {

    urlButton.addEventListener(
        "click",
        loadImageFromURL
    );
}


async function loadImageFromURL() {

    if (!imageUrl) {
        return;
    }

    const url =
        imageUrl.value.trim();


    if (!url) {

        alert(
            "Please paste an image URL first."
        );

        return;
    }


    try {

        urlButton.disabled =
            true;

        urlButton.textContent =
            "Loading...";


        const response =
            await fetch(
                url,
                {
                    method: "GET",
                    mode: "cors"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );
        }


        const blob =
            await response.blob();


        if (
            !blob.type ||
            !blob.type.startsWith(
                "image/"
            )
        ) {

            throw new Error(
                "This URL is not a direct image."
            );
        }


        let extension =
            "jpg";


        if (
            blob.type.includes("png")
        ) {

            extension =
                "png";

        } else if (
            blob.type.includes("webp")
        ) {

            extension =
                "webp";
        }


        selectedFile =
            new File(
                [blob],
                `lunar_web_image.${extension}`,
                {
                    type:
                        blob.type
                }
            );


        if (fileName) {

            fileName.textContent =
                `Web image: ${selectedFile.name}`;
        }


        showPreview(
            selectedFile
        );


        if (enhanceBtn) {

            enhanceBtn.disabled =
                false;
        }


        urlButton.textContent =
            "Loaded ✓";


        setTimeout(
            () => {

                if (urlButton) {

                    urlButton.textContent =
                        "Load Image";
                }

            },
            1800
        );


    } catch (error) {

        console.error(
            "URL loading error:",
            error
        );


        alert(
            "Could not load this image URL.\n\n" +
            "The website may block browser access (CORS), " +
            "or this is a webpage URL instead of a direct image URL.\n\n" +
            "Try copying the direct image address or use Choose Image."
        );


        urlButton.textContent =
            "Load Image";

    } finally {

        urlButton.disabled =
            false;
    }
}


/* =========================================================
   IMAGE ERROR HANDLING
========================================================= */

function handleImageError(
    imageElement,
    label
) {

    if (!imageElement) {
        return;
    }


    imageElement.addEventListener(
        "error",
        function () {

            console.error(
                `${label} image failed to load:`,
                this.src
            );

            this.style.display =
                "none";


            const wrapper =
                this.parentElement;


            if (
                wrapper &&
                !wrapper.querySelector(
                    ".image-error-message"
                )
            ) {

                const message =
                    document.createElement(
                        "div"
                    );

                message.className =
                    "image-error-message";

                message.textContent =
                    `${label} image could not be loaded.`;

                message.style.padding =
                    "40px 20px";

                message.style.textAlign =
                    "center";

                message.style.color =
                    "#aaa8c4";

                wrapper.appendChild(
                    message
                );
            }
        }
    );
}


handleImageError(
    originalImage,
    "Original"
);

handleImageError(
    enhancedImage,
    "Enhanced"
);


/* =========================================================
   ENHANCE IMAGE
========================================================= */

if (enhanceBtn) {

    enhanceBtn.addEventListener(
        "click",
        enhanceImage
    );
}


async function enhanceImage() {

    if (!selectedFile) {

        alert(
            "Please select an image first."
        );

        return;
    }


    console.log(
        "🚀 Starting AI enhancement..."
    );


    enhanceBtn.disabled =
        true;

    enhanceBtn.classList.add(
        "processing"
    );

    enhanceBtn.textContent =
        "⚡ Enhancing...";


    if (loading) {

        loading.classList.add(
            "show"
        );
    }


    if (resultSection) {

        resultSection.classList.remove(
            "show"
        );
    }


    const formData =
        new FormData();


    formData.append(
        "image",
        selectedFile
    );


    try {

        /* =================================================
           SEND TO FLASK
        ================================================= */

        const response =
            await fetch(
                `${BACKEND_URL}/enhance`,
                {
                    method: "POST",
                    body: formData
                }
            );


        console.log(
            "Backend status:",
            response.status
        );


        let data;


        try {

            data =
                await response.json();

        } catch (jsonError) {

            throw new Error(
                "Backend returned an invalid JSON response."
            );
        }


        console.log(
            "🌙 Backend response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.error ||
                data.message ||
                `Enhancement failed (${response.status})`
            );
        }


        /* =================================================
           YOUR APP.PY RETURNS:
           
           {
               "status": "success",
               "output": "/result/xxxxx_enhanced.png"
           }

           So we use data.output directly.
        ================================================= */

        if (!data.output) {

            throw new Error(
                "Backend did not return the enhanced image path."
            );
        }


        const enhancedURL =
            makeBackendURL(
                data.output
            );


        console.log(
            "✨ Enhanced image URL:",
            enhancedURL
        );


        /* =================================================
           ORIGINAL IMAGE
           
           Use the selected file itself.
           This works for both:
           - Choose Image
           - Image URL loaded as File
        ================================================= */

        const originalURL =
            URL.createObjectURL(
                selectedFile
            );


        console.log(
            "📷 Original image URL:",
            originalURL
        );


        /* =================================================
           DISPLAY ORIGINAL
        ================================================= */

        if (originalImage) {

            originalImage.style.display =
                "block";

            originalImage.src =
                originalURL;

            originalImage.alt =
                "Original lunar image";
        }


        /* =================================================
           DISPLAY ENHANCED
        ================================================= */

        if (enhancedImage) {

            enhancedImage.style.display =
                "block";

            enhancedImage.src =
                enhancedURL;

            enhancedImage.alt =
                "Enhanced lunar image";
        }


        /* =================================================
           DOWNLOAD URL
           
           Backend output:
           /result/UUID_enhanced.png

           Download endpoint:
           /download/UUID_enhanced.png
        ================================================= */

        let downloadURL =
            "";


        const outputPath =
            String(
                data.output
            );


        const filename =
            outputPath
                .split("/")
                .pop();


        if (filename) {

            downloadURL =
                `${BACKEND_URL}/download/${encodeURIComponent(filename)}`;
        }


        console.log(
            "⬇️ Download URL:",
            downloadURL
        );


        /* =================================================
           DOWNLOAD BUTTON
        ================================================= */

        if (downloadBtn) {

            downloadBtn.onclick =
                function () {

                    if (!downloadURL) {

                        alert(
                            "Download URL is not available."
                        );

                        return;
                    }


                    const link =
                        document.createElement(
                            "a"
                        );


                    link.href =
                        downloadURL;


                    link.download =
                        "LunaEnhance_Enhanced.png";


                    document.body.appendChild(
                        link
                    );


                    link.click();


                    link.remove();
                };
        }


        /* =================================================
           SHOW RESULT SECTION
        ================================================= */

        if (resultSection) {

            resultSection.classList.add(
                "show"
            );
        }


        /* =================================================
           SCROLL TO RESULT
        ================================================= */

        setTimeout(
            () => {

                if (resultSection) {

                    resultSection.scrollIntoView(
                        {
                            behavior:
                                "smooth",

                            block:
                                "start"
                        }
                    );
                }

            },
            300
        );


        console.log(
            "%c✅ AI Enhancement Complete",
            "color:#55ff99;font-weight:bold;"
        );


    } catch (error) {

        console.error(
            "❌ Enhancement error:",
            error
        );


        alert(
            `Enhancement failed.\n\n${error.message}`
        );


    } finally {

        if (loading) {

            loading.classList.remove(
                "show"
            );
        }


        enhanceBtn.disabled =
            false;


        enhanceBtn.classList.remove(
            "processing"
        );


        enhanceBtn.textContent =
            "✨ Enhance Image";
    }
}


/* =========================================================
   FULLSCREEN VIEWER
========================================================= */

function openImageViewer(src) {

    if (
        !imageModal ||
        !modalImage ||
        !src
    ) {
        return;
    }


    modalImage.src =
        src;


    imageModal.classList.add(
        "show"
    );


    document.body.style.overflow =
        "hidden";


    history.pushState(
        {
            lunaViewer:
                true
        },
        "",
        "#luna-viewer"
    );
}


function closeImageViewer() {

    if (!imageModal) {
        return;
    }


    imageModal.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "";


    if (
        window.location.hash ===
        "#luna-viewer"
    ) {

        history.back();
    }
}


/* =========================================================
   ORIGINAL DOUBLE CLICK
========================================================= */

if (originalImage) {

    originalImage.addEventListener(
        "dblclick",
        function () {

            if (this.src) {

                openImageViewer(
                    this.src
                );
            }
        }
    );
}


/* =========================================================
   ENHANCED DOUBLE CLICK
========================================================= */

if (enhancedImage) {

    enhancedImage.addEventListener(
        "dblclick",
        function () {

            if (this.src) {

                openImageViewer(
                    this.src
                );
            }
        }
    );
}


/* =========================================================
   CLOSE MODAL
========================================================= */

if (closeImageModal) {

    closeImageModal.addEventListener(
        "click",
        closeImageViewer
    );
}


if (imageModal) {

    imageModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                imageModal
            ) {

                closeImageViewer();
            }
        }
    );
}


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Escape"
        ) {

            if (
                imageModal &&
                imageModal.classList.contains(
                    "show"
                )
            ) {

                closeImageViewer();
            }
        }
    }
);


/* =========================================================
   BROWSER BACK BUTTON
========================================================= */

window.addEventListener(
    "popstate",
    function () {

        if (
            imageModal &&
            imageModal.classList.contains(
                "show"
            )
        ) {

            imageModal.classList.remove(
                "show"
            );

            document.body.style.overflow =
                "";
        }
    }
);


/* =========================================================
   MOBILE DOUBLE TAP
========================================================= */

let lastTap =
    0;


function setupDoubleTap(element) {

    if (!element) {
        return;
    }


    element.addEventListener(
        "touchend",
        function (event) {

            const now =
                Date.now();


            if (
                now - lastTap <
                300
            ) {

                event.preventDefault();


                if (this.src) {

                    openImageViewer(
                        this.src
                    );
                }
            }


            lastTap =
                now;
        }
    );
}


setupDoubleTap(
    originalImage
);

setupDoubleTap(
    enhancedImage
);


/* =========================================================
   PAUSE SPACE ANIMATIONS WHEN TAB IS HIDDEN
========================================================= */

document.addEventListener(
    "visibilitychange",
    function () {

        const elements =
            document.querySelectorAll(
                ".asteroid, .meteor, .star"
            );


        elements.forEach(
            element => {

                element.style.animationPlayState =
                    document.hidden
                        ? "paused"
                        : "running";
            }
        );
    }
);


/* =========================================================
   BACKEND CONNECTION CHECK
========================================================= */

async function checkBackend() {

    try {

        const response =
            await fetch(
                BACKEND_URL
            );


        if (response.ok) {

            console.log(
                "%c🟢 LunaEnhance Backend Connected",
                "color:#55ff99;font-weight:bold;"
            );

        } else {

            console.warn(
                "Backend responded with:",
                response.status
            );
        }


    } catch (error) {

        console.warn(
            "Backend connection check failed:",
            error.message
        );
    }
}


checkBackend();


/* =========================================================
   CONSOLE BRANDING
========================================================= */

console.log(
    "%c🌙 LunaEnhance AI",
    "font-size:22px;font-weight:bold;color:#a66cff;"
);

console.log(
    "%c🚀 Space environment initialized",
    "color:#9f8cff;"
);

console.log(
    "%c✨ AI Enhancement Pipeline Ready",
    "color:#c48cff;"
);

console.log(
    "%c⚡ RTX 3050 GPU pipeline connected",
    "color:#c48cff;"
);