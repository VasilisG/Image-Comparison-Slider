(function(){
    /**
     * Function that initializes the comparison slider in the selected element.
     */
    function initComparisonSlider(){
        let imageComp = document.getElementsByClassName('blg-image-comp');
        if(imageComp.length > 0){
            for(let imgComp of imageComp){
                let canDrag = false;
                let children = imgComp.children;
                let childElementsOk = true;
                let firstImage, secondImage;
                let cropX, percent;
                let sliderLine, sliderButton;
                
                /* Check if there are 2 img elements for the script to work, else warn user. */
                if(children.length != 2){
                    console.warn('Exactly 2 <img> elements must exists in "image-comp" element. Found: ' + children.length);
                }
                else {
                    /* Check if all children are img elements, else warn user. */
                    for(let child of children){
                        if(child.tagName != 'IMG'){
                            childElementsOk = false;
                            console.warn('All elements in "image-comp" must be <img>. Found element: ' + child.tagName.toLowerCase());
                        }
                    }
                    /* If everything is ok, restructure HTML and add event listeners. */
                    if(childElementsOk){
                        imgComp.classList.add('blg-comp-slider-container');

                        [firstImage, secondImage] = children;

                        [firstImage, secondImage].forEach((elem) => {
                            elem.classList.add('blg-comp-image');
                        });
    
                        firstImage.classList.add('blg-comp-image-first');
                        secondImage.classList.add('blg-comp-image-second');

                        cropX = imgComp.clientWidth / 2;
    
                        sliderLine = document.createElement('div');
                        sliderLine.classList.add('blg-comp-slider-line');
                        sliderLine.style.left = cropX + 'px';

                        percent = parseFloat(sliderLine.style.left.replace('px', '')) / imgComp.clientWidth;

                        sliderButton = document.createElement('span');
                        sliderButton.classList.add('blg-comp-slider-button');

                        sliderLine.appendChild(sliderButton);
                        imgComp.appendChild(sliderLine);
    
                        firstImage.style.clip = 'rect(0px, ' + cropX + 'px, ' + imgComp.clientHeight + 'px, 0px)';

                        /* Mouse and touch events when the user clicks or taps on slider. */
                        ['mousedown', 'touchstart'].forEach((eventValue) => {
                            imgComp.addEventListener(eventValue, (event) => {
                                if(event.target.classList.contains('blg-comp-slider-button')){
                                    canDrag = true;
                                }
                            });
                        });

                        /* Mouse and touch events when the user stops clicking or tapping on slider. */
                        ['mouseup', 'touchend'].forEach((eventValue) => {
                            imgComp.addEventListener(eventValue, () => {
                                canDrag = false;
                            })
                        });

                        /* Mouse and touch events when the user moves mouse or moves finger on slider. */
                        ['mousemove', 'touchmove'].forEach((eventValue) => {
                            imgComp.addEventListener(eventValue, (event) => {
                                let targetX;
                                if(event.type == 'mousemove'){
                                    targetX = event.clientX;
                                }
                                else {
                                    let e = (typeof event.originalEvent === 'undefined') ? event : event.originalEvent;
                                    let touch = e.touches[0] || e.changedTouches[0];
                                    targetX = touch.pageX;
                                }
                                if(canDrag){
                                    if(targetX > imgComp.offsetLeft + imgComp.clientWidth - imgComp.offsetWidth + sliderButton.clientWidth / 2
                                        && targetX < imgComp.offsetLeft + imgComp.clientWidth - sliderButton.clientWidth / 2)
                                    {
                                        sliderLine.style.left = targetX - imgComp.offsetLeft + 'px';
                                        firstImage.style.clip = 'rect(0px, ' + (targetX - imgComp.offsetLeft) + 'px, ' + imgComp.clientHeight + 'px, 0px)';
                                        percent = parseFloat(sliderLine.style.left.replace('px', '')) / imgComp.clientWidth;
                                    }
                                }
                            });
                        });

                        /* Checks when the screen resizes in order to maintain correct position of image slider elements (line, button). */
                        window.addEventListener('resize', () => {
                            sliderLine.style.left = percent * imgComp.clientWidth + 'px';
                            firstImage.style.clip = 'rect(0px, ' + sliderLine.style.left + ', ' + imgComp.clientHeight + 'px, 0px)';
                        });
                    }
                }
            }
        }
        else {
            console.warn('No element found with "image-comp" class to create an image comparison.');
        }
    }

    /* Initialize comparison slider. */
    initComparisonSlider();
})();