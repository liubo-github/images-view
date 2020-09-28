export function throttle(fn, delay, type = 1){
    let prev = 0;
    return function(){
        let arg = arguments;
        if(type === 1){
            let now = new Date().getTime();
            if(now - prev >= delay){
                fn.apply(this, arg)
                prev = now;
            }
        }else if(type === 2){
            if(!fn.timer){
                fn.timer = setTimeout(() => {
                    fn.timer = null;
                }, delay)
            }
        }
    }
}

export function getStyle(el,attr){				
    if(window.getComputedStyle){					
        return getComputedStyle(el,'')[attr];
    }else{
        return el.currentStyle[attr];
    }				
}