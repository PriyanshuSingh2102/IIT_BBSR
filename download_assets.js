const https = require('https');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'assets');
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

const images = [
  {
    filename: 'city-street-dusk.jpg',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
    desc: 'City street at dusk with streetlights'
  },
  {
    filename: 'wearable-bracelet.jpg',
    url: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=800&q=80',
    desc: 'Generic fitness bracelet / smart wearable on wrist'
  },
  {
    filename: 'pcb-microcontroller.jpg',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    desc: 'Microcontroller PCB closeup / IoT sensor chip'
  },
  {
    filename: 'streetlight-iot-box.jpg',
    url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    desc: 'Streetlight / utility pole with antenna'
  },
  {
    filename: 'empty-street-night.jpg',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    desc: 'Empty quiet street at night (cellular dead zone representation)'
  },
  {
    filename: 'cctv-camera-mounted.jpg',
    url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    desc: 'Generic CCTV camera unit mounted on pole'
  },
  {
    filename: 'cctv-empty-street-frame.jpg',
    url: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80',
    desc: 'Neutral empty street frame for AI detection overlay'
  },
  {
    filename: 'police-patrol-car.jpg',
    url: 'https://images.unsplash.com/photo-1549487572-41d826282946?auto=format&fit=crop&w=800&q=80',
    desc: 'Generic patrol vehicle'
  },
  {
    filename: 'dispatch-control-room.jpg',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    desc: 'Control room monitors dashboard'
  },
  {
    filename: 'city-skyline-banner.jpg',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    desc: 'City skyline aerial view'
  }
];

function download(item) {
  return new Promise((resolve) => {
    const dest = path.join(ASSETS_DIR, item.filename);
    const file = fs.createWriteStream(dest);

    https.get(item.url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        https.get(response.headers.location, (redirectRes) => {
          redirectRes.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`[DOWNLOADED] ${item.filename} (${item.desc})`);
            resolve();
          });
        }).on('error', (err) => {
          console.error(`[ERR] ${item.filename}:`, err.message);
          resolve();
        });
      } else if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`[DOWNLOADED] ${item.filename} (${item.desc})`);
          resolve();
        });
      } else {
        console.error(`[FAILED] ${item.filename}: HTTP ${response.statusCode}`);
        resolve();
      }
    }).on('error', (err) => {
      console.error(`[ERR] ${item.filename}:`, err.message);
      resolve();
    });
  });
}

async function run() {
  console.log(`Downloading ${images.length} curated royalty-free images...`);
  for (const img of images) {
    await download(img);
  }
  console.log('All downloads completed!');
}

run();
