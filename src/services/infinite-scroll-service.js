export default function infiniteScroll(arr, timeOut, threshold, callFoo) {
    if (arr.length === 0) return;
        let lastId = (arr[arr.length - 1].id);   //запоминаем id крайнего на даный момент элемента гллереи
        setTimeout(() => { 
            const lastTarget = document.getElementById(lastId); //получаем этот элемент и делаем его целью наблюдения для IntersectionObserver
            // console.log('lastTarget', lastTarget)
            let observer = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        callFoo(); //запуск подгрузки следующих элементов
                        observer.unobserve(entry.target);  //остановка наблюдателя видимой частью окна для объявленой цели
                    };
                });
            }, {threshold: threshold}); //подгрузка следующих элементов сработает при появлении threshold% цели в области видимости окна

            observer.observe(lastTarget);  //запуск наблюдателя за видимой частью окна 
        }, timeOut);
}