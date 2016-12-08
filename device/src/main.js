//@program

var Pins = require("pins");

let background = new Skin({ fill: '#F2F2F2' });
let orangeSkin = new Skin({ fill: '#F2994A' });
let blueSkin = new Skin({ fill: '#56CCF2' });
let whiteSkin = new Skin({ fill: 'white' });
let buttonStyle = new Style({font: '30px Avenir', color: 'white'});
let refillStyle = new Style({font: '25px Avenir', color: 'black'});
let bowlLabelStyle = new Style({font: 'bold 30px Avenir', color: 'black'});

let foodBowl = new Container({
	name: 'bowl',
	width: 100, height: 100,
	left: 10, right: 10, skin: orangeSkin,
	contents: [
		new Label({ name: 'text', string: 'Food', style: buttonStyle })
	],
	active: true,
	behavior: Behavior ({
		onTouchEnded: function(content, id, x, y, ticks) {
			//
		}
	}) 
});

let waterBowl = new Container({
	name: 'bowl',
	width: 100, height: 100,
	left: 10, right:10, skin: blueSkin,
	contents: [
		new Label({ name:'text',string: 'Water', style: buttonStyle })
	],
	active: true,
	behavior: Behavior ({
		onTouchEnded: function(content, id, x, y, ticks) {
			//
		}
	})
});


let mainScreen = new Column({ 
	name: 'main',
	left: 0, right: 0, top: 0, bottom: 0, skin: background,
	contents: [
		new Container({
			name: 'header',
			skin: whiteSkin,
			width: 320, height: 50,
			contents: [
				new Picture({
					top: 10, left:10,
			right: 120,
					height:35,
					url: "../assets/header.png"
				})
			]
		}),
		new Label({
			left: 10, top: 10,
			name: 'message',
			style: new Style({ font: '30px Avenir', color: 'black' }),
			string: "Click '+' on app to get started!"
		}),
	]
});

let refillFood, refillWater;

application.behavior = Behavior({
    onLaunch(application) {
        this.data = { labels: {} };
		Pins.configure({
            shelfLife: {
                require: "shelfLife",
                pins: {
                  power: {pin: 55, type:"Power", voltage:3.3},
        					uv: {pin: 56},
                  ground: {pin: 57, type:"Ground"},
        					vref: {pin: 58}
                }
            },
            quantity: {
                require: "quantity",
                pins: {
                  power: {pin: 51, type:"Power", voltage:3.3},
        					uv: {pin: 52},
                  ground: {pin: 53, type:"Ground"},
        					vref: {pin: 54}
                }
            },
            scan: {
                require: "Digital",
                pins: {
                    ground: { pin: 59, type: "Ground" },
                    digital: { pin: 60, direction: "input" },
                }
            },
            ready: {
                require: "Digital",
                pins: {
                    ground: { pin: 61, type: "Ground" },
                    digital: { pin: 62, direction: "output" },
                }
            },
            // camera: {
            //     require: "camera",
            //     pins: {
            //       power: {pin: 63, type:"Power", voltage:3.3},
        				// 	uv: {pin: 64},
            //       ground: {pin: 65, type:"Ground"},
        				// 	vref: {pin: 66}
            //     }
            // },
		}, success => this.onPinsConfigured(application, success));
	},
	onPinsConfigured(application, success) {		
		if (success) {
			application.add(mainScreen);
			
			Pins.repeat("/ready/read", 100, value => this.onReady(application, value));
			Pins.repeat("/scan/read", 100, value => this.onScan(application, value));

			Pins.share("ws", {zeroconf: true, name: "food-sensors"});
		}
		else {
            application.skin = new Skin({ fill: "#f78e0f" });
            var style = new Style({ font:"bold 36px", color:"white", horizontal:"center", vertical:"middle" });
            application.add(new Label({ left:0, right:0, top:0, bottom:0, style: style, string:"Error could not configure pins" }));
		}
	},
	onReady(app, value) {
		if (value) {
			app.main.empty(1);
			app.main.add(
				new Label({
					left: 10, top: 10,
					name: 'message',
					style: new Style({ font: '30px Avenir', color: 'black' }),
					string: "Ready!"
				})
			);
			app.main.add(
				new Label({
					left: 10,
					name: 'message',
					style: new Style({ font: '25px Avenir', color: 'black' }),
					string: "Press SCAN button to scan item."
				})
			)
		} else {
			app.main.empty(1);
			app.main.add(
				new Label({
					left: 10, top: 10,
					name: 'message',
					style: new Style({ font: '25px Avenir', color: 'black' }),
					string: "Click '+' on app to get started!"
				})
			)
		}
	},
	onScan(app, value) {
		Pins.invoke("/ready/read", ready => {
			if (ready) {
				if (value) {
					app.main.empty(1);
					app.main.add(
						new Label({
							left: 10, top: 10,
							name: 'message',
							style: new Style({ font: '30px Avenir', color: 'black' }),
							string: "Scan complete."
						})
					);
					app.main.add(
						new Label({
							left: 10,
							name: 'message',
							style: new Style({ font: '25px Avenir', color: 'black' }),
							string: "Finish adding item on app."
						})
					)
				}
				//  else {
				// 	Pins.invoke("/ready/read", value => this.onReady(application, value));
				// }
			}
		});
	},
	onFoodAmountChanged(app, value) {		
        var data = this.data;
		if (data.foodAmount && value.amount != data.foodAmount.amount && refillFood) {
			app.main.remove(app.main.refillFood);
			refillFood = false;
			Pins.invoke("/refillFood/write", 0);
		}
        data.foodAmount = value;
        app.main.amounts.foodCol.bowl.text.string = data.foodAmount.amount.toPrecision(3) + ' cups';
        
        
		if (value.amount < 1) { 
			app.main.amounts.foodCol.bowl.height = 30;
		} else {
			app.main.amounts.foodCol.bowl.height = 110 * (value.amount / 5);
		}
	},
	onWaterAmountChanged(app, value) {		
        var data = this.data;
        
		if (data.waterAmount && value.amount != data.waterAmount.amount && refillWater) {
			app.main.remove(app.main.refillWater);
			refillWater = false;
			Pins.invoke("/refillWater/write", 0);
		}
		
        data.waterAmount = value;
        app.main.amounts.waterCol.bowl.text.string = data.waterAmount.amount.toPrecision(3) + ' cups';
       
		if (value.amount < 1) { 
			app.main.amounts.waterCol.bowl.height = 30;
		} else {
			app.main.amounts.waterCol.bowl.height = 110 * (value.amount / 5);
		}
	},
	onRefillFood(app, value) {		
        if (value == 1 && !refillFood) {
        	app.main.add(new Label({ 
        		top: 10,
        		name: "refillFood", 
        		string: "Refilling food...", 
        		style: refillStyle }));
        	refillFood = true;
        }
	},
	onRefillWater(app, value) {		
        if (value == 1 && !refillWater) {
        	app.main.add(new Label({ 
        		top: 10,
        		name: "refillWater", 
        		string: "Refilling water...", 
        		style: refillStyle }));
        	refillWater = true;
        }
	},
});
