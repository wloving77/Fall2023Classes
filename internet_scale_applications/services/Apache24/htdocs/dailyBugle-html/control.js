/* Logic for rotating advertisements: */
var intervalImage = setInterval(rotateImage, 2000);
var imgIndex = 1;
function rotateImage() {

    let images = ['./advertisements/bose.jpeg', './advertisements/cool-car.jpeg', './advertisements/dog-food.jpeg',
        './advertisements/hydroflask.jpeg', './advertisements/kubernetes.webp']

    if (imgIndex >= images.length) {
        imgIndex = 0
    }
    document.getElementById("advertisementImage").setAttribute("src", images[imgIndex]);
    imgIndex++;


}