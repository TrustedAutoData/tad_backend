const secretString = "2ApeBMtmg8oJFoZY4eYLvboHZgQmvTQAM8rDd8jpdDJUwDPdAe4Rrft6bfa1pyQ3bam7VrVWg31tHrsc7PoH246Y";

const secretBytes = Buffer.from(secretString, 'utf-8');
console.log(secretBytes);        // Node.js Buffer output
console.log(secretBytes.length); // Number of bytes

const secretUint8 = new Uint8Array(secretBytes);
console.log(secretUint8);        // Uint8Array
