import React, { RefObject } from "react";
import { WellContainer } from "../well/well.component";
import io from 'socket.io-client'
import './game.scss';

interface Info {
    rooms: [string, string[]][]
}
interface CalculatedGameState {
    yourWells: number[];
    rivalWells: number[];
    yourStore: number;
    rivalStore: number;
}
interface GameState {
    calculatedState: CalculatedGameState | null;
    data?: {
        [key: string]: number[];
    },
    turn?: string;
    state: 'started' | 'waiting_for_user'

}
const getCalculatedGameState = (id: string, state: GameState): CalculatedGameState | null => {
    if (state.state !== 'started' || !state.data || !state.turn) {
        return null;
    }
    console.log('state', state)
    const yourWells = (state.data[id] as number[]).concat();
    const rivalId = Object.keys(state.data).find(_id => _id !== id);
    if (!rivalId) {
        return null;
    }
    const rivalWells = (state.data[rivalId] as number[]).concat();

    const [rivalStore] = rivalWells.splice(6);
    const [yourStore] = yourWells.splice(6);
    rivalWells.reverse();
    return {
        rivalStore,
        yourStore,
        rivalWells,
        yourWells
    }


    return null;

}
export class GameContainer extends React.Component<any, {
    rooms: [string, string[]][];
    joinedRoom: GameState | null;
}> {
    socket: SocketIOClient.Socket;
    roomNameIntpuRef: RefObject<HTMLInputElement>;
    constructor(props: any) {
        super(props);
        this.roomNameIntpuRef = React.createRef<HTMLInputElement>()
        this.state = {
            rooms: [],
            joinedRoom: null,
        }
        // const socket = io('http://localhost:8080');
        const socket = io('http://192.168.1.60:8000');
        socket.on('connect', () => {
            console.log('id', socket.id);
            // socket.emit('join', 'room1');
            (window as any).socket = socket;
            // socket.on('play_update', (data: any) => {
            //     console.log('play update', data);
            // });
            socket.on('info', (data: Info) => {
                console.log('info', data);
                this.setState({ rooms: data.rooms })
            })
            socket.on('room', (room: GameState) => {
                // console.log('room', room);
                room.calculatedState = getCalculatedGameState(this.socket.id, room);
                console.log('calculatedState', room);
                this.setState({ joinedRoom: room })
            })
            socket.on('rooms', (rooms: any) => {
                console.log('rooms', rooms)
                this.setState({ rooms })
            })
        });
        this.socket = socket;
    }
    refreshRooms = () => {
        this.setState({ rooms: [] });
        this.socket.emit('rooms');
    }
    clickWell = (wellNumber: number) => {
        console.log('clickWell', wellNumber);
        this.socket.emit('play', wellNumber)
    }
    createRoom = () => {
        console.log(this.roomNameIntpuRef);
        const value = this.roomNameIntpuRef.current?.value;
        if (value && value.length > 1) {
            this.socket.emit('join', value);
        }
    }
    joinRoom = (val: string) => this.socket.emit('join', val);
    // rivalWells = () => {
    //     if (!this.state.joinedRoom) {
    //         return null;
    //     }
    //     const { state, turn, data } = this.state.joinedRoom;
    //     if (!data) {
    //         console.log('rival user not found ?')
    //         return null;
    //     }
    //     const idArray = Object.keys(data)
    //     const rivalId = idArray.find((id) => this.socket.id !== id);
    //     if (!rivalId) {
    //         console.log('rivalId not found', data, this.socket.id);
    //         return null;
    //     }
    //     const wellValues = data[rivalId] as number[];
    //     const wellArray = [];
    //     for (let i = 0; i < 6; i++) {
    //         wellArray.push(<WellContainer key={i} rockCount={wellValues[i]} />)
    //     }
    //     return wellArray;
    //     // return data.map(())
    // }
    // yourWells = () => {

    // }
    render() {
        const joinedRoom = this.state.joinedRoom;
        const calculatedState = this.state.joinedRoom?.calculatedState;
        console.log('calculatedState', calculatedState)
        return <div>
            {calculatedState ?
                <>
                    <div className="GameContainer">
                        <div className="store">RIVALS STORE {calculatedState.rivalStore}</div>
                        <div className="well-playground">

                            <div className="wells rival">
                                {calculatedState.rivalWells.map((val, i) =>
                                    <WellContainer key={i} rockCount={val} />
                                )}

                            </div>
                            <div className="wells me">
                                {calculatedState.yourWells.map((val, i) =>
                                    <WellContainer
                                        onClick={() => this.clickWell(i)}
                                        key={i} rockCount={val}
                                    />
                                )}
                                {/* <WellContainer onClick={() => this.clickWell(0)} rockCount={4} />
                                <WellContainer onClick={() => this.clickWell(1)} rockCount={4} />
                                <WellContainer onClick={() => this.clickWell(2)} rockCount={4} />
                                <WellContainer onClick={() => this.clickWell(3)} rockCount={4} />
                                <WellContainer onClick={() => this.clickWell(4)} rockCount={4} />
                                <WellContainer onClick={() => this.clickWell(5)} rockCount={4} /> */}
                            </div>
                        </div>
                        <div className="store">YOUR STORE {calculatedState.yourStore}</div>
                    </div>
                    <div style={{ margin: '16px' }}>
                        SIRA: {joinedRoom?.turn === this.socket.id ? 'sende' : 'rakipte'}
                    </div>
                </> : null}


            <div className="room-container" style={{ margin: '16px' }}>
                <div className="room-form">
                    <input type="text" ref={this.roomNameIntpuRef} />
                    <button onClick={this.createRoom}>Oda Oluştur</button>
                    <button>Odadan Çık</button>
                    <button onClick={this.refreshRooms}>Odaları Yenile</button>
                </div>
                <div className="rooms">
                    {this.state.rooms.map((item, i) =>
                        <div key={item[0]}>
                            <span>
                                {item[0]}
                            </span>
                            <button onClick={() => this.joinRoom(item[0])}>Odaya Gir</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    }
}