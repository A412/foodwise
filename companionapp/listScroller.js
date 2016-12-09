/* Scroller */
import {
    VerticalScroller,
    VerticalScrollbar,
    TopScrollerShadow,
    BottomScrollerShadow
} from 'scroller';

let darkGraySkin = new Skin({ fill: "#202020" });
let titleStyle = new Style({ font: "20px", color: "white" });

export let ScrollerContainer = Container.template($ => ({
    left: 0, right: 0, top: 0, bottom: 0,
    contents: [
        VerticalScroller($, { 
            active: true, top:10,
            contents: [
                $.content,
                VerticalScrollbar(), 
                TopScrollerShadow(), 
                BottomScrollerShadow(),    
            ]                     
        })
    ]
}));