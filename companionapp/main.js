import Pins from "pins";
import {

let sliderOn;
	width: 110, height: 110,
			if (!sliderOn) {
				sliderOn = true;
					name: 'amount', string: 'New food amount: 0 cups',
					style: new Style({font: '22px Avenir', color: 'black'})
				}));
					top: 10,
					contents: [ new cancelButton(), new submitButton({ bowl: "Food" }) ] 
				}));
			}

let waterBowl = new Container({
	width: 110, height: 110,
			if (!sliderOn) {
				sliderOn = true;
					name: 'amount', string: 'New water amount: 0 cups',
					style: new Style({font: '22px', color: 'black'})
				}));
					top: 10,
					contents: [ new cancelButton(), new submitButton({ bowl: "Water" }) ] 
				}));
			}


let newAmount;
        	let amount = this.data.value.toPrecision(2);
            application.main.amounts.amount.string = amount + ' cups';
            newAmount = amount;

let cancelButton = Container.template($ => ({
	skin: new Skin({ fill: 'gray' }),
	width: 80, height: 30, bottom: 30,
	left: 10, right:10,
	contents: [
		new Label({
			name: 'cancelButton', string: 'Cancel', style: new Style({ font: 'bold 22px Avenir', color: 'white' })
		})
	],
	active: true,
	behavior: Behavior ({
			application.main.amounts.empty(1, 4);
			sliderOn = false;
}));


let submitButton = Container.template($ => ({
	skin: new Skin({ fill: '#2D9CDB' }),
	width: 80, height: 30, bottom: 30,
	left: 10, right: 10,
	contents: [
		new Label({
			name: 'submitButton', string: 'Submit', style: new Style({ font: 'bold 22px Avenir', color: 'white' })
		})
	],
	active: true,
	behavior: Behavior ({
			trace("Submitting amount: " + newAmount + '\n');
			// Write a digital pin that says "Refilling!"
			remotePins.invoke("/refill" + $.bowl + "/write", 1);
			
			// Remove slider and submit button.
			application.main.amounts.empty(1, 4);
			sliderOn = false;
}));


let refreshBowlsButton = new Content({
	width: 40, height: 40,
					application.main.amounts.bowls.foodCol.bowl.text.string = value.amount.toPrecision(2) + ' cups';
					if (value.amount < 1) { 
						application.main.amounts.bowls.foodCol.bowl.height = 30;
					} else {
						application.main.amounts.bowls.foodCol.bowl.height = 110 * (value.amount / 5);
					}
				remotePins.invoke("/water/read", value => {
					application.main.amounts.bowls.waterCol.bowl.text.string = value.amount.toPrecision(2) + ' cups';
					if (value.amount < 1) { 
						application.main.amounts.bowls.waterCol.bowl.height = 30;
					} else {
						application.main.amounts.bowls.waterCol.bowl.height = 110 * (value.amount / 5);
					}

let refreshCameraButton = new Content({
	width: 40, height: 40,
					let doggoID = value.imgID.toPrecision(1);
					if (application.main.camera.starttxt) {
						application.main.camera.remove(application.main.camera.starttxt);
					};
					if (application.main.camera.doggo) {
						application.main.camera.remove(application.main.camera.doggo);
					};
					let doggoPic = new Picture({ 
						name: 'doggo',
						top: 10, bottom: 10,
						height: 100, url: 'assets/doggo' + doggoID + '.png' })
					application.main.camera.add(doggoPic);


let feedButton = new Content({
	width: 40, height: 40,
					
				remotePins.invoke("/water/read", value => {
					
			
			
			if (application.main.camera) {
				application.main.remove(camScreen);
				application.main.header.remove(refreshCameraButton);
				application.main.header.add(refreshBowlsButton);
				application.main.insert(feedScreen, application.main.nav);
			}


let camButton = new Content({
	width: 40, height: 40,
				
				remotePins.invoke("/water/read", value => {
			
			
			if (application.main.amounts) {
				application.main.remove(feedScreen);
				application.main.header.remove(refreshBowlsButton);
				application.main.header.add(refreshCameraButton);
				application.main.insert(camScreen, application.main.nav);
			}
		


let takePicButton = new Content({
	width: 40, height: 40,
		

let feedScreen = new Column({ 
			skin: background,
			width: 320, height: 322,
			contents: [
				new Line({ 
					name: 'bowls',
					contents: [
				] })
		
let camScreen = new Column({ 
			skin: background,
			width: 320, height: 322,
				//takePicButton
				new Label({ 
					top: 40, bottom: 40, 
					name: 'starttxt', string: "Refresh to view live doggo!", 
					style: bowlLabelStyle })

let mainScreen = new Column({ 
		new Line({
			name: 'header',
			skin: new Skin({ fill: 'white' }),
			height: 100, width: 320,
			contents: [
				new Label({ 
					left: 20,
					string: "PetFeedr", 
					style: new Style({ font: 'bold 50px Avenir', color: '#2D9CDB' })}),
				refreshBowlsButton,
			]
		}),
		feedScreen,
		new Line({
			skin: new Skin({ fill: 'white' }),
			name: 'nav', 
			width: 320, height: 60,
			bottom: 0,
			contents: [
				feedButton,
				camButton
			]
		})

let menuItem = Container.template($ => ({ 
	name: $.name,
	top: 20, bottom:20,
	width: 200,
	skin: blueSkin,
	contents: [
		new Label({ 
			style: new Style({ color: 'white', font: 'bold 30px Avenir' }), 
			string: $.label })
	]
}));
	skin: background,
	height: 480,
					top: 5, bottom: 5,

// pins shit

                    remotePins.invoke("/food/read", value => {
						application.main.amounts.bowls.foodCol.bowl.text.string = value.amount.toPrecision(2) + ' cups';
					remotePins.invoke("/water/read", value => {
						application.main.amounts.bowls.waterCol.bowl.text.string = value.amount.toPrecision(2) + ' cups';