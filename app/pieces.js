class Color{
    static WHITE = new Color('w');
    static BLACK = new Color('b');
    static EMPTY = new Color('e');

    isWhite(){ return this.type === 'w'; }
    isBlack(){ return this.type === 'b'; }
    isEmpty(){ return this.type === 'e'; }



    constructor(type){
        this.type = type;
    }
};

class Piece{
    constructor(color){
        this.color = color;
    }
};

class Empty extends Piece{
    getPath() { return []; }
}

class Pawn extends Piece{
    constructor(color){
        super(color);
        this.type = 'p';
        this.dy = color.isWhite() ? 1 : -1;
        this.srcY = color.isWhite() ? 1 : 6; // starting row of pawn in a 2d array
    }
    getPath(src, dst){
        const dx = Math.abs(dst.x - src.x);
        const dy = (dst.y - src.y) * this.dy;

        if (dx > 1) return []; // can't move more than 1 left/right
        if (dy === 2 && src.y === this.srcY) return [dst]; // move 2 only if in starting point
        if (dy === 1) return [dst]; // normal move
        return [];
    };
};

class Bishop extends Piece{
    constructor(color){
        super(color);
        this.type = 'b';
    }
    getPath(src, dst){
        let path = [];
        const dx = dst.x - src.x;
        const dy = dst.y - src.y;

        if (Math.abs(dx) !== Math.abs(dy)) return path; // invalid move

        const stepX = dx > 0 ? 1 : -1;
        const stepY = dy > 0 ? 1 : -1;

        for (let i = 1; i <= Math.abs(dx); i++) {
            path.push({
                x: src.x + i * stepX,
                y: src.y + i * stepY
            });
        }

        return path;
    };
};

class Rook extends Piece{

    constructor(color){
        super(color);
        this.type = 'r';
    }

    getPath(src, dst){
        let path = [];
        let dx = 0;
        let dy = 0;
        let len = 0;

        if (src.x === dst.x) {
            len = Math.abs(src.y - dst.y);
            dy = (src.y < dst.y) ? 1 : -1;
        }
        else if (src.y === dst.y) {
            len = Math.abs(src.x - dst.x);
            dx = (src.x < dst.x) ? 1 : -1;
        }
        else return path;

        for (let i = 1; i <= len; i++) {
            path.push({
                x: src.x + (i * dx),
                y: src.y + (i * dy)
            });
        }
        
        return path;
    };
};

class Knight extends Piece{

    constructor(color){
        super(color);
        this.type = 'n';
    }

    getPath(src, dst){
        const stepX = Math.abs(dst.x - src.x);
        const stepY = Math.abs(dst.y - src.y);

        if (stepX * stepY === 2) return [dst];
        else return [];
    };
};

class Queen extends Piece{

    constructor(color){
        super(color);
        this.type = 'q';
    }

    getPath(src, dst){
        let path = new Bishop(this.color).getPath(src, dst);
        if (path.length === 0) 
            path = new  Rook(this.color).getPath(src, dst);
        return path;
    };
};

class King extends Piece{

    constructor(color){
        super(color);
        this.type = 'k';
    }

    getPath(src, dst){
        const stepX = Math.abs(dst.x - src.x);
        const stepY = Math.abs(dst.y - src.y);

        if (stepX <= 1 && stepY <= 1) return [dst];
        else return []; 
    };
};

export {
    Color,
    Piece,
    Empty,
    Pawn,
    Bishop,
    Rook,
    Knight,
    Queen,
    King
};