/// <reference types="node" />
export declare class IHex {
    static read(filepath: string): IHex;
    static parse_line(rawline: string): {
        line_type: number;
        addr: number;
        data: Buffer;
    };
    static calc_checksum(data: Buffer): number;
}
