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
    if (state.state === undefined || !state.data || !state.turn) {
        console.log('state.state return null')
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
        const socket = io('http://localhost:8000', {
            path: '/socketApi'
        });
        // const socket = io('http://192.168.1.60:8000');
        socket.on('connect', () => {
            // socket.emit('join', 'room1');
            (window as any).socket = socket;
            // socket.on('play_update', (data: any) => {
            //     console.log('play update', data);
            // });
            socket.on('info', (data: Info) => {
                this.setState({ rooms: data.rooms })
            })
            socket.on('room', (room: GameState) => {
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
    render() {
        const joinedRoom = this.state.joinedRoom;
        const calculatedState = this.state.joinedRoom?.calculatedState;
        return <div>
            {calculatedState ?
                <>
                    <div className="GameContainer">
                        <div className="store">Rakip Kuyu {calculatedState.rivalStore}</div>
                        <div className="well-playground">

                            <div className="wells rival">
                                {calculatedState.rivalWells.map((val, i) =>
                                    <WellContainer
                                        key={i}
                                        rival={true}
                                        disabled={true}
                                        rockCount={val}
                                    />
                                )}

                            </div>
                            <div className="wells me">
                                {calculatedState.yourWells.map((val, i) =>
                                    <WellContainer
                                        key={i}
                                        rival={false}
                                        disabled={joinedRoom?.turn !== this.socket.id}
                                        onClick={() => this.clickWell(i)}
                                        rockCount={val}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="store">Merkez Kuyu {calculatedState.yourStore}</div>
                    </div>
                    <div style={{ margin: '16px' }}>
                        SIRA: {joinedRoom?.turn === this.socket.id ? 'sende' : 'rakipte'}
                    </div>
                </> : null}

            {`STATE ${joinedRoom?.state}`}
            <div className="room-container" style={{ margin: '16px' }}>
                <div className="room-form">
                    <input type="text" ref={this.roomNameIntpuRef} />
                    <button onClick={this.createRoom}>Oda Oluştur</button>
                    {/* <button>Odadan Çık</button> */}
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