(async function () {
    async function getStringData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const text = await response.text();
            return text;
        } catch (error) {
            console.error(error.message);
        }
    }

    //async function getJsonData(url) {
    //    try {
    //        const response = await fetch(url);
    //        if (!response.ok) {
    //            throw new Error(`Response status: ${response.status}`);
    //        }
    //        const json = await response.json();
    //        return json;
    //    } catch (error) {
    //        console.error(error.message);
    //    }
    //}

    async function getResizedImageSource() {
        const images = document.querySelectorAll('img.js-loaded');

        if (images) {
            images.forEach((img) => {
                img.classList.remove('noscript-hidden');
            });

            images.forEach((img) => {
                img.classList.remove('noscript-hidden');
            });

            for (let i = 0; i < images.length; i++) {
                const img = images[i];
                const query = `mediaItemId=${img.id}&cropalias=${img.dataset['cropalias']}&width=${img.width}`
                const url = `${window.location.origin}/public/api/picture/cropurl?${query}`;
                console.debug(url);

                try {
                    await getStringData(url)
                        .then((src) => {
                            console.debug(src);
                            img.src = src;
                        });
                } catch (error) {
                    console.log(error.message);
                }
            }

            return images;
        }
    }

    const resizedImages = await getResizedImageSource();
    if (resizedImages?.length) {
        document.defaultView.addEventListener('resize', async () => {
            if (window.resizeIssued) {
                return;
            }
            window.resizeIssued = setTimeout(async () => {
                await getResizedImageSource();
                window.resizeIssued = false;
            }, 1000);
        });
    }
})();