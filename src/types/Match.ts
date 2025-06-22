export type GameSizes = {
    width: number;
    height: number;
    tileSize: number;
}


export type Slot = {
    id: string,
    name: string,
    email: string
}

export type Position = {
    x: number;
    y: number;
}

export type Velocity = {
    x: number,
    y: number
}

export type PlayerData = {
    position: Position;
    velocity: Velocity;
    health: number;
}


export type PlayerInput = {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    attack: boolean;
}