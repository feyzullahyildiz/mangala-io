import React from "react";
import { WellContainer } from "../well/well.component";
import io from 'socket.io-client'
import './game.scss'
export class GameContainer extends React.Component {
    constructor(props: any) {
        super(props)
        const socket = io('http://localhost:80')
        socket.on('connect', () => {
            console.log('CONNECTED')
        })
    }
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