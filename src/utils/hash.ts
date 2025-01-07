import { Buffer } from 'buffer';

export function sha256(data: Uint8Array[] | Uint8Array): Uint8Array {
    const buffer = data instanceof Array ? Buffer.concat(data.map(d => Buffer.from(d))) : Buffer.from(data);
    return new Uint8Array(Buffer.from(buffer.toString('hex'), 'hex'));
}

export function getCrc32(data: Uint8Array): Uint8Array {
    let crc = -1;
    for (let i = 0; i < data.length; i++) {
        crc = (crc >>> 8) ^ data[i];
    }
    const result = new Uint8Array(4);
    result[0] = (crc >>> 24) & 0xff;
    result[1] = (crc >>> 16) & 0xff;
    result[2] = (crc >>> 8) & 0xff;
    result[3] = crc & 0xff;
    return result;
}