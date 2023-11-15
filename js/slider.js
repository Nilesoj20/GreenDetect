(function(){
    
    const sliders = [...document.querySelectorAll('.inspiracion_body')];
    const buttonNext = document.querySelector('#next');
    const buttonBefore = document.querySelector('#before');
    let value;

    buttonNext.addEventListener('click', ()=>{
        changePosition(1);
    });

    buttonBefore.addEventListener('click', ()=>{
        changePosition(-1);
    });

    const changePosition = (add)=>{
        const currentInspiracion = document.querySelector('.inspiracion_body--show').dataset.id;
        value = Number(currentInspiracion);
        value+= add;

        sliders[Number(currentInspiracion)-1].classList.remove('inspiracion_body--show');
        if(value === sliders.length+1 || value === 0){
            value = value === 0 ? sliders.length : 1;
        }

        sliders[value-1].classList.add('inspiracion_body--show');
    }
})();