const fs = require('fs');
const text = fs.readFileSync('/Users/shubhamsoni/.gemini/antigravity/brain/c2f777c0-63e2-41cd-8951-32341a907f84/.system_generated/steps/6/content.md', 'utf8');

const lines = text.split('\n');
const results = [];
let current = null;

const imgArray = [
  "/images/real/lupa.jpg",
  "/images/real/13th_floor.jpg",
  "/images/real/lotus_pavilion.jpg",
  "/images/real/polo_club.jpg",
  "/images/real/spice_terrace.jpg",
  "/images/real/suzy_q.jpg",
  "/images/real/bier_library.jpg",
  "/images/real/oasis_brewery.jpg"
];

let started = false;
for (const line of lines) {
  if (line.trim() === '### Central Bangalore') started = true;
  if (!started) continue;
  
  if (line.startsWith('#### ')) {
    const title = line.replace('#### ', '').trim();
    const parts = title.split(',');
    current = {
      name: parts[0].trim(),
      location: parts.length > 1 ? parts.slice(1).join(',').trim() : parts[0].trim(),
      desc: '',
      insta: '',
      website: '',
      img: ''
    };
    results.push(current);
  } else if (current && line.trim().length > 0 && !line.startsWith('#')) {
    // extract address and link
    let desc = line;
    let insta = desc.match(/\[Instagram\]\((.*?)\)/);
    if (insta) {
       current.insta = insta[1];
       desc = desc.replace(insta[0], '');
    }
    let web = desc.match(/\[Website\]\((.*?)\)/);
    if (web) {
       current.website = web[1];
       desc = desc.replace(web[0], '');
    }
    
    // remove markdown links from desc
    desc = desc.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    
    // extract Address:
    let addrParts = desc.split('Address:');
    if (addrParts.length > 1) {
       let a = addrParts[1].trim();
       if (current.location === current.name) current.location = a;
       desc = addrParts[0].trim() + " Address: " + a;
    }
    
    if (desc) current.desc += desc + " ";
  }
}

// Assign images
const imgMap = {
  "Lupa Bengaluru": "/images/real/lupa.jpg",
  "13th Floor Bar": "/images/real/13th_floor.jpg",
  "The Polo Club": "/images/real/polo_club.jpg",
  "Lotus Pavilion": "/images/real/lotus_pavilion.jpg",
  "Spice Terrace": "/images/real/spice_terrace.jpg",
  "Suzy Q": "/images/real/suzy_q.jpg",
  "The Bier Library": "/images/real/bier_library.jpg",
  "Oasis Brewery": "/images/real/oasis_brewery.jpg"
};

let imgIdx = 0;
for (let i = 0; i < results.length; i++) {
  if (imgMap[results[i].name]) {
    results[i].img = imgMap[results[i].name];
  } else {
    results[i].img = imgArray[imgIdx % imgArray.length];
    imgIdx++;
  }
}

console.log(JSON.stringify(results, null, 2));

