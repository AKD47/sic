function Map(){

    this.init = function (options) {
        this.defaultParams = {
            selector:'#map',
            zoom: 7,
            center: [55.76, 37.64],
            placemarks:[]
        };

        this.finalParams = this.defaultParams;

        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                if (options[key] !== undefined) {
                    this.finalParams[key] = options[key];
                }
            }
        }
        this.options = this.finalParams;

        ymaps.ready(this.run.bind(this));

    }

    this.run = function(){

        if(typeof this.options.center === 'string'){
            var result = ymaps.geocode(this.options.center);
            result.done(function (res) {
                this.map = new ymaps.Map(this.getMapBox(), {
                    center: [res.geoObjects.get(0).geometry.getCoordinates()[0],res.geoObjects.get(0).geometry.getCoordinates()[1]],
                    zoom: this.options.zoom
                });
                this.printPlacemarks();
            }.bind(this), function () {
                console.log('Произошла ошибка.');
            });
        }
        else{
            this.map = new ymaps.Map(this.getMapBox(), {
                center: this.options.center,
                zoom: this.options.zoom
            });
        }


    }

    this.printPlacemarks = function(){
        this.options.placemarks.forEach(function(a){
            this.addPlacemark(a.address, a.properties, a.options);
        }.bind(this));
    }

    this.addPlacemark = function(address, properties, options){
        var r = ymaps.geoQuery(ymaps.geocode(address)).slice(0,1);
        r.then(function(){
            if(options){
                options.forEach(function(opt){
                    r.setOptions(opt.key, opt.value);
                });
            }
            if(properties){
                properties.forEach(function(prop){
                    r.setProperties(prop.key, prop.value);
                });
            }
            r.addToMap(this.map);
        }.bind(this));
    }

    this.getMapBox = function(){
        var mapBox;
        if (typeof this.options.selector == "object") {
            mapBox = this.options.selector;
        }
        else {
            if (this.options.selector[0] == '#') {
                mapBox = document.getElementById(this.options.selector.slice(1));
            }
            else {
                mapBox = document.getElementsByClassName(this.options.selector.slice(1));
            }
        }
        return mapBox;
    }

}