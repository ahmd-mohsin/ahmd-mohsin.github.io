import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputPath = path.join(__dirname, '../public/ahmed.jpeg');
const outputPath = path.join(__dirname, '../public/favicon.png');

async function createCircularFavicon() {
    try {
        const size = 128;
        // Create a circular SVG mask
        const circleShape = Buffer.from(
            `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" /></svg>`
        );

        await sharp(inputPath)
            .resize(size, size, { fit: 'cover' })
            .composite([{
                input: circleShape,
                blend: 'dest-in'
            }])
            .png()
            .toFile(outputPath);

        console.log('Favicon generated successfully at', outputPath);
    } catch (err) {
        console.error('Error generating favicon:', err);
    }
}

createCircularFavicon();
