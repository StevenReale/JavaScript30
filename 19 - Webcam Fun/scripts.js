const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(localMediaStream => {
            console.log(localMediaStream);
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch(err => {
            console.error('Oh No!', err);
        });
}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    
    return setInterval(() => {
        ctx.willReadFrequently = true;
        ctx.drawImage(video, 0, 0, width, height);
        let pixels = ctx.getImageData(0, 0, width, height);
        pixels = redEffect(pixels);
        ctx.putImageData(pixels, 0, 0);
    }, 16);

}

function redEffect(pixels) {
    for(let i = 0; i < pixels.data.length; i += 4) {
        pixels[i] = pixels.data[i] + 100;
        pixels[i+1] = pixels.data[i+1] - 50;
        pixels[i+2] = pixels.data[i+2] * .5;
    }
    return pixels;
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();

    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt ="Handsome Man" />`;
    strip.insertBefore(link, strip.firstChild);
}



getVideo();

video.addEventListener('canplay', paintToCanvas);
