import React from "react";
import { WellContainer } from "../well/well.component";
import './game.scss'
export class GameContainer extends React.Component {
    clickWell() {

    }
    render() {
        return <div className="GameContainer">
            <div className="store">RIVALS STORE</div>
            <div className="well-playground">

                <div className="wells rival">
                    <WellContainer rockCount={4} />
                    <WellContainer rockCount={4} />
                    <WellContainer rockCount={4} />
                    <WellContainer rockCount={4} />
                    <WellContainer rockCount={4} />
                    <WellContainer rockCount={4} />
                </div>
                <div className="wells me">
                    <WellContainer onClick={() => this.clickWell()} rockCount={4}/>
                    <WellContainer onClick={() => this.clickWell()} rockCount={4}/>
                    <WellContainer onClick={() => this.clickWell()} rockCount={4}/>
                    <WellContainer onClick={() => this.clickWell()} rockCount={4}/>
                    <WellContainer onClick={() => this.clickWell()} rockCount={4}/>
                    <WellContainer onClick={() => this.clickWell()} rockCount={4}/>
                </div>
            </div>
            <div className="store">YOUR STORE</div>
        </div>
    }
}