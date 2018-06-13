require('./foundation.js');
require('./foundation.css');

const plus = require('./img/plus.svg');
const balloonInit = require('./js/balloon.js');

let placesMap = new Map();
let yMap;
let clusterer;
let geoObjects = [];

(async() => {
    try {
        await ymaps.ready();

         yMap = new ymaps.Map('map', {
            center: [55.76, 37.64], // Москва
            zoom: 14
        }, {
            searchControlProvider: 'yandex#search'
        });

        // Создаем собственный макет с информацией о выбранном геообъекте.
        let customItemContentLayout = ymaps.templateLayoutFactory.createClass(
            // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
            '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
            '<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>' +
            '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
        );

        clusterer = new ymaps.Clusterer({
            preset: 'islands#invertedBlackClusterIcons',
            clusterDisableClickZoom: true,
            gridSize: 110,
            iconColor: '#6f6f6f',
            clusterOpenBalloonOnClick: true,
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            clusterBalloonItemContentLayout: customItemContentLayout,
            clusterBalloonPanelMaxMapArea: 0,
            clusterBalloonContentLayoutWidth: 260,
            clusterBalloonContentLayoutHeight: 130,
            clusterBalloonPagerSize: 5
        });

        yMap.events.add('click', e => {
            let coords = e.get('coords');

            balloonInit(coords, placesMap, yMap, clusterer, geoObjects);
        });

        yMap.geoObjects.add(clusterer);
    }
    catch (e) {
        console.error(e);
    }
})();
