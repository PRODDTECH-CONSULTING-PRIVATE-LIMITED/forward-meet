import React, { useEffect } from 'react';
import { ArrowLeft, Instagram, Globe, MapPin } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './dashboard.css';

const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // remove non-word chars
    .replace(/\s+/g, '-') // replace spaces with -
    .replace(/-+/g, '-'); // replace multiple - with single -
};

const recommendations = [
  {
    "name": "Lupa Bengaluru",
    "location": "MG Road",
    "desc": "Named after the mythological she wolf who nursed Rome’s founders Romulus and Remus, Lupa is a labour of love by the twin revivalists of CBD, chef Manu Chandra and Chetan Rampal. A sprawling 11,000sq ft space on MG Road that can hold 150, its welcoming courtyard is dominated by a marble fountain with seating all around. Designed like an Italian villa, with wrought iron grills, terracotta roof tiles, vases, stone-finish floors and lush landscaping, the Tuscany exterior hides New York Art Deco interiors with high ceilings. The highlight is the gargantuan bar with a brass clad countertop and an underground wine cellar for intimate dinners. The food is Modern European from risottos to bone marrow; leave space for their tiramisu! Address: Ground Floor, Spencer’s Towers, 86, MG Road",
    "insta": "https://www.instagram.com/thelupagram/?hl=en",
    "website": "",
    "img": "/images/real/lupa.jpg"
  },
  {
    "name": "13th Floor Bar",
    "location": "MG Road",
    "desc": "One of Bengaluru’s iconic rooftop bars/restaurants since the mid-90s, The 13th Floor at Barton Centre promises great ambience and the best views of the city skyline, especially Parade Ground, Chinnaswamy Stadium, the metro line and Vidhana Soudha. Retro music, friendly staff and top notch food make it an old favourite. Try their Dan Dan noodles, Mudaliar prawns pulao, Arcot mutton biryani, Mrs Palekar’s Saraswat Brahmin prawn curry, mutton dhansak and Andhra chilli tandoori. They also run ASEAN on the Edge that serves Oriental fare and Ebony dishing out North Indian cuisine. Reserve balcony tables in advance. Address: Tower B, 84, MG Road, Haridevpur, Shanthala Nagar, Ashok Nagar",
    "insta": "https://www.instagram.com/the13thfloorbangalore/?hl=en",
    "website": "",
    "img": "/images/real/13th_floor.jpg"
  },
  {
    "name": "Kai",
    "location": "13th Floor, Du Parc Trinity, 17, MG Road, opposite Vijaya Bank, Craig Park Layout, Ashok Nagar",
    "desc": "Perched on the 13th floor of the corporate offices of Du Parc Trinity at the far end of MG Road, the month-old Kai overlooks Trinity Church and the green expanse of the Army Cantonment. The glass-fronted restaurant with semi-outdoor seating and private dining rooms offers panoramic views. Grab sundowners at the open-air terrace from 6pm onwards. Ashish Adhikari has curated signature cocktails like Silk Road Blossom and Kai Negroni with butter-washed rum and coffee-infused vermouth, while chef Virendra Singh Chauhan whips up Kyoto mushrooms, Spanish gambas al ajillo, paneer khurchan tart, Malabar seared fish, lamb tagine, yuzu & matcha cheesecake and After Dark chocolate pudding. The Penthouse Brunch Menu features the Skyline Platter while Zenith by Kai, their set lunch programme offers a curated three-course meal for Rs999 and a five-course meal at Rs1,299. Address: 13th Floor, Du Parc Trinity, 17, MG Road, opposite Vijaya Bank, Craig Park Layout, Ashok Nagar",
    "insta": "https://www.instagram.com/kai_bengaluru/?hl=en",
    "website": "",
    "img": "/images/real/lupa.jpg"
  },
  {
    "name": "The Polo Club",
    "location": "37-39, The Oberoi Hotel, MG Road",
    "desc": "Bengaluru's legendary verandah lounge, restaurant and bar Polo Club recently underwent a makeover, moving from old-school pub food to global favourites like Togarashi crusted Fish Finger, Polo Club Chicken Jiaozi and signature sandwiches. A versatile space with indoor seating, a garden-facing verandah and an open-air patio for alfresco dining, it’s the perfect oasis in the heart of the city. Their new range of craft cocktails include Cheeky Blinders, an Art Nouveau take on the old fashioned, an extensive wine selection and a wide range of specialty teas and single-origin coffee. Rim Naam, Oberoi’s award-winning Thai restaurant located in the gardens on a secluded wooden pavilion floating above a water body is another special outdoor experience. Address: 37-39, The Oberoi Hotel, MG Road",
    "insta": "",
    "website": "https://www.oberoihotels.com/hotels-in-bengaluru/dining/the-polo-club/",
    "img": "/images/real/polo_club.jpg"
  },
  {
    "name": "Lotus Pavilion",
    "location": "1, Residency Rd, Ashok Nagar",
    "desc": "Bengaluru's eco-conscious five-star hotel, ITC Gardenia is a tribute to the Garden City and Asia’s first hotel to have a Platinum rating under LEED. Entering through the wind-cooled lobby, the Lotus Pavilion, is a colonnaded restaurant crowned by a beautiful sloping green roof, aptly referred to as a 'Living Room with a Living Roof'. A delightful place to meet over tea or birthday and anniversary celebrations, the alfresco restaurant is great any time of the year. Enjoy a stellar line up of beverages, cocktails and a selection of gourmet tapas, signature sandwiches, Kitchens of India, The Express Work and soul food from the World Kitchen. Address: 1, Residency Rd, Ashok Nagar",
    "insta": "",
    "website": "https://www.itchotels.com/in/en/itcgardenia-bengaluru",
    "img": "/images/real/lotus_pavilion.jpg"
  },
  {
    "name": "Olive Beach",
    "location": "Wood Street",
    "desc": "Even after 20 years, AD Singh’s Olive Beach, set in an elegant old villa, retains its timeless Med charm, thanks to its revamped interiors, white drapes and outdoor furniture. The alfresco lounge bar and newly restored pizzeria offers Mediterranean fare in a sun-dappled courtyard, live grills under the stars and private dinners at The Table for Eight next to an intimate Tuscan kitchen. Chef Jyotika Malik, a Le Cordon Bleu graduate who worked at Marco Pierre White’s Michelin restaurant Mirabelle, dishes out mushroom pil pil, glazed pork ribs, chevre & fig tart, baked brie, 8-hour lamb shanks, with cocktails by lead mixologist Harish Chhimwal. Address: 16, Wood Street, Near Karnataka Bank, Ashok Nagar",
    "insta": "https://www.instagram.com/olivebeachblr/?hl=en",
    "website": "",
    "img": "/images/real/13th_floor.jpg"
  },
  {
    "name": "Muro",
    "location": "GF and Mezzanine, No. 05, Onyx Centre, Museum Road",
    "desc": "An acronym for Museum Road where it’s located and literally ‘wall’ in several languages, Muro is more than a restaurant and bar. Spanning 8,500sq ft, it has three distinct zones. The alfresco outdoor section covered in lush foliage doubles up as a café on weekends offering Asian breakfast—Khao Man Gai, crab omelettes and pandan French toast. For lunch and dinner, chef Somporn Chaisturn and Niharika Raval’s team showcase Thai and Cantonese flavours—Kra Pao, Truffle Pork Belly and Pumpkin Prawns. By evening, Muro Mezz, the cocktail bar up the cantilevered wooden staircase with India’s first highball carbonation station serves Rain Check, Heat of the Moment, Eat your Art Out and other inventive cocktails. Address: GF and Mezzanine, No. 05, Onyx Centre, Museum Road",
    "insta": "https://www.instagram.com/muroindia/",
    "website": "",
    "img": "/images/real/lotus_pavilion.jpg"
  },
  {
    "name": "YAZU",
    "location": "St Mark’s Road",
    "desc": "Yazu, the acclaimed pan-Asian supper club launches its first restaurant in Bengaluru with a spectacular rooftop space, a ‘High Spirits of Asia’ cocktail programme and a signature menu spanning the best of Japanese, Thai, Korean, Chinese and Southeast Asian influences—tartare and ceviche, sushi bar, dimsum, ramen bowls, miso-glazed black cod and Hokkaido scallops from the robata. The Open Terrace Bar helmed by Kaustubh Sawardekar, offers a refreshing bar menu—Tomm Yummm, a clarified gin cocktail inspired by Bangkok’s iconic soup, Indo-Korean fusion Pickle in My Tickle and Rasa Tropis, an Indonesian tropical rum highball of lychee, pandan and coconut. They also have a tea ritual in collaboration with Tea Culture in the afternoon and evening. Address: Marks Square, St Mark’s Road, Shanthala Nagar, Ashok Nagar",
    "insta": "https://www.instagram.com/yazubangalore/",
    "website": "",
    "img": "/images/real/polo_club.jpg"
  },
  {
    "name": "Monkey Bar",
    "location": "1st Floor, The Museum, No.1, Museum Road",
    "desc": "Moving from its old location on 12th Main Indiranagar to Church Street, Bengaluru’s favourite gastropub by Olive Bar & Kitchen retains its old vibe with a new menu. The high-ceilinged space has a lovely outdoor deck overlooking the action on the street. Dig in to signature appetizers like tuna cutlet, Japanese-inspired chicken tsukune, loaded keema wedges and old favourites like cheese burger, besides military mutton biryani and mutton kofta with appam. Address: 1st Floor, The Museum, No.1, Museum Road",
    "insta": "https://www.instagram.com/monkeybarind/?hl=en",
    "website": "",
    "img": "/images/real/spice_terrace.jpg"
  },
  {
    "name": "Airlines Hotel",
    "location": "No.4, State Bank of India Road, Shanthala Nagar, Ashok Nagar",
    "desc": "The original drive-in restaurant in Bengaluru (they’ll also serve you in the car), Airlines Hotel is an institution with unbeatable old-world charm. Located in the heart of the city near the Lavelle Road intersection, it remains the OG of open-air dining under a canopy of two massive banyan trees. Stewards have been around for decades and regulars love the unhurried service. This is where MF Hussain has doodled on napkins, Dr Rajkumar relished breakfast and famous politicians cracked deals. Start with their trademark warm jeera water or pineapple juice before diving into classic South Indian staples—masala dosa, benne masala, idli vada, rava idli, bisi bele bath or chola bhatura. Wrap up with the iconic foamy filter coffee or specialty cold brew coffee. Address: No.4, State Bank of India Road, Shanthala Nagar, Ashok Nagar",
    "insta": "",
    "website": "",
    "img": "/images/real/suzy_q.jpg"
  },
  {
    "name": "Loya",
    "location": "Race Course Road",
    "desc": "Savour Himalayan foothill cuisine and lesser known delicacies from Punjab, Kashmir, Himachal and Uttarakhand at Loya in the breezy outdoors of Taj West End, Bangalore. Watch cocktails like Woody Manhattan with apple wood smoke and Malwa Highball being shaken and stirred at the outdoor bar. Their new menu features Kauni ke kebab, a crunchy millet patty, dahi kraal, yoghurt kebabs stuffed with water chestnut, Gosht reshiya kebab with fig yogurt dip, the famous atta chicken from Kot Kapura and mains—Amritsari wadi aloo, melt-in-the-mouth cha gosht and mandi chicken paired with cashew-studded malera rotis. Address: Race Course Road",
    "insta": "",
    "website": "https://www.tajhotels.com/en-in/hotels/taj-west-end-bengaluru/restaurants/loya-taj-west-end",
    "img": "/images/real/bier_library.jpg"
  },
  {
    "name": "Spice Terrace",
    "location": "24/1, Vittal Mallya Road",
    "desc": "The North Indian poolside restaurant at JW Marriott Hotel Bengaluru overlooking Cubbon Park offers excellent views of UB City and the Kingfisher Towers in Bengaluru’s CBD. Great for a romantic date or a celebration, the best part is its ambience. The charming dining area near the bar is decked with chic furniture and pretty foliage. The open-air seating around the pool can get nippy so carry warm clothing or enjoy a meal in the cosy cabanas. Opt for a set menu or order a la carte—galouti kebabs, Jodhpuri paneer tikka to dal makhani, paired with craft beers and cocktails. Address: 24/1, Vittal Mallya Road",
    "insta": "",
    "website": "https://www.marriott.com/en-us/dining/restaurant-bar/blrjw-jw-marriott-hotel-bengaluru/5281786-spice-terrace.mi",
    "img": "/images/real/spice_terrace.jpg"
  },
  {
    "name": "Suzy Q",
    "location": "No.1, Express Building, Queens Road, Vasanth Nagar",
    "desc": "A stylish bar below the Indian Express building, Suzy Q has a leafy outdoor space and vibrant décor and murals livening up the indoor seating. Be it morning, noon or night, the vibe is youthful and charged with exciting global food and cocktails. Don’t miss their excellent chilli prawn mayo and fish tikka. Fun begins mid-week with Karaoke nights on Wednesdays and weekends are almost always packed. Address: No.1, Express Building, Queens Road, Vasanth Nagar",
    "insta": "https://www.instagram.com/suzyqblr/?hl=en",
    "website": "",
    "img": "/images/real/suzy_q.jpg"
  },
  {
    "name": "The Craftery BLR",
    "location": "374, St John's Hospital Rd, 3rd Block, Koramangala",
    "desc": "Housed in a repurposed spa, The Craftery BLR by Subko continues its relaxing vibe for anyone who loves coffee, chocolate and baked goodies. Shaded by majestic ficus trees, the spacious open-air courtyard Mehfil is a pet-friendly multi-event space with a small amphitheatre lined with a Gabion wall. Expansive arched windows provide unrestricted views into the workings of the Craft Bakehouse, taking guests “Behind the Bread”. The elevated glass-enclosed Sensory Lab curates cherry-to-cup and pod-to-bar experiences from coffee cupping and brewing to cacao-tasting workshops. Upstairs, it highlights its old-school Bangalorean home feel with exposed-brick walls and red oxide floors. Under chef Daniel Trulson, The Craftery is more sorcery, blending traditional and experimental baking styles, manifested in upma sourdough, kulfi-stuffed croissants, chicken haleem quiche and their new pizza speakeasy SOPI. Address: 374, St John's Hospital Rd, 3rd Block, Koramangala",
    "insta": "https://www.instagram.com/p/DKR5DZiIzrb/?hl=en",
    "website": "",
    "img": "/images/real/oasis_brewery.jpg"
  },
  {
    "name": "The Bier Library",
    "location": "14, Patel Narayana Reddy Layout, 80 Ft Main Road, Koramangala 6th Block",
    "desc": "The central courtyard with open-air seating around a koi pond with lush greenery and a biergarten atmosphere makes The Bier Library a popular outdoor spot in Koramangala. The industrial design of concrete and brick is given a pop of colour with old doors and stained-glass windows sourced from Pondicherry. Two floors of covered seating enjoy the courtyard view and provide ample space to lounge about. The mood is loud and boisterous to quaff some decent craft beer paired with Naga chilli Pork, Kodava chicken wings, Tangra-style chilli chicken and wood-fired 21-inch pizzas—perfect for large groups. Address: 14, Patel Narayana Reddy Layout, 80 Ft Main Road, Koramangala 6th Block",
    "insta": "https://www.instagram.com/thebierlibrary/?hl=en",
    "website": "",
    "img": "/images/real/bier_library.jpg"
  },
  {
    "name": "Seta Restaurant",
    "location": "Off Intermediate Ring Road, Embassy Golf Links Business Park, Challaghatta",
    "desc": "Inspired by the outdoors and nature, Seta at Hilton Bangalore Embassy GolfLinks offers a pleasant poolside alfresco dining experience with elegant minimalist design. Sandwiched between a charcoal grill on one side and a rippling pool on the other, the cuisine is Mediterranean-Asian, served in an easy informal izakaya style, meant to be shared at the table. Besides signatures like yuzu kosho shrimp and turnip cake, the new menu features Silk Road kebab, citrus-dusted halloumi, panela with onion chermoula sauce, sweet and sour crispy tofu, Hawkers style udon and more. Address: Off Intermediate Ring Road, Embassy Golf Links Business Park, Challaghatta",
    "insta": "",
    "website": "https://www.hilton.com/en/hotels/blrrehi-hilton-bangalore-embassy-golflinks/dining/",
    "img": "/images/real/lupa.jpg"
  },
  {
    "name": "Zen",
    "location": "23, Old Airport Road",
    "desc": "Spread over 7.5 acres, The Leela Palace Bengaluru hides a culinary gem under its leafy canopy. Led by chef Piched, Zen serves Pan-Asian cuisine, blending flavours from China, Japan and Thailand. Awarded the International Cuisine Restaurant of the Year (Pan Asian South), everything about Zen is top notch—the décor, service, ambience and food. The elegant indoor seating has opulent chandeliers suspended from the lofty ceiling, while the outdoor seating overlooks the greenery with the gentle flicker of lanterns above. Try their Dim Sum Brunch, Aroy Maki, Chilli Honey Lotus Stem, Pla Neung Manao and Rambutan Crème Brûlée. Address: 23, Old Airport Road",
    "insta": "",
    "website": "https://www.theleela.com/the-leela-palace-bengaluru",
    "img": "/images/real/13th_floor.jpg"
  },
  {
    "name": "Jollygunj",
    "location": "3rd Floor, RMZ Galleria Residential, Ambedkar Colony, Yelahanka",
    "desc": "After wowing JP Nagar and Whitefield with their Kolkata-inspired cuisine and cocktails, Jollygunj opened their third outlet at The Galleria Mall, Yelahanka in June this year. A massive terrace restaurant under a twinkling sky with funky retro music livening up the place, Jollygunj brings much cheer to North Bengaluru. Relish starters like reshmi kebab, OG chilli chicken, mutton xseekh kebab with mughlai paratha, and mains from dal makhani, chicken bharta, chicken rizala with assorted breads to biryani. Don’t miss their signature cocktails—gin-based Darjeeling Line and whiskey-based Chowringhee No.1 and choice of 16 shots—from Angrezi to Zabardast. Address: 3rd Floor, RMZ Galleria Residential, Ambedkar Colony, Yelahanka",
    "insta": "https://www.instagram.com/jollygunj/?hl=en",
    "website": "",
    "img": "/images/real/lotus_pavilion.jpg"
  },
  {
    "name": "The French Treaty",
    "location": "Shop 15, Avalahalli Estate, Near CRPF Camp, Off Doddaballapur Road, Yelahanka",
    "desc": "Discover the charm of The French Treaty in serene Jinvara, Mahindra’s strip mall and community space in Yelahanka. Set on an old mango plantation, the two-and-a-half acre shopping, dining and cultural centre in North Bengaluru draws patrons from as far as JP Nagar on a Sunday. Chef Shivroop Khokhar worked at Amiel Gourmet and Royal Champagne in France, ranked #3 best hotel in France by Condé Nast Traveller, before bringing her French flair to the city. Hand-rolled pasta, charcoal buns, croissants, crepes, sandwiches, salads, artisanal six-inch pizzettes and desserts, their food is a culinary adventure worth every mile. A must-visit gem, weekends are the perfect time to unwind at TFT. Address: Shop 15, Avalahalli Estate, Near CRPF Camp, Off Doddaballapur Road, Yelahanka",
    "insta": "https://www.instagram.com/thefrenchtreaty/?hl=en",
    "website": "",
    "img": "/images/real/polo_club.jpg"
  },
  {
    "name": "Grover Vineyards",
    "location": "63, Raghunathapura, Devanahalli Road, Doddaballapura",
    "desc": "If you like wine, drive down to Lounge de La Reserve at Grover Vineyards in Doddaballapura. Order a bottle from the store and sip it in the garden lawns lined by koi ponds. The 410-acre vineyard at the Nandi foothills is 10 minutes away from the facility but you can learn about viticulture on a 60-90 minute winery tour to see the bottling and labelling process and the cellar. End with a tasting session at Cave de La Reserve and try 6 varietals in 30 ml serves—three whites, one rosé and two reds, priced Rs.1000-3000/person + tax, depending on your preferred wine series Reserve, Luxury and Signet. Grape stomping is held in season (Jan-Mar) on prior request for groups of 10 or more at Rs500/person. The delish food by Trippy Goat features burrata salad, Sauvignon Blanc garlic chilli prawns, lamb bolognese on hummus and thin crust pizzas. Address: 63, Raghunathapura, Devanahalli Road, Doddaballapura",
    "insta": "https://www.instagram.com/groverzampa/?hl=en",
    "website": "",
    "img": "/images/real/spice_terrace.jpg"
  },
  {
    "name": "Layla",
    "location": "ITPL Main Road, KIADB Export Promotion Industrial Area, Whitefield",
    "desc": "Layla, the rooftop bar and restaurant at The Den in Whitefield returns in a new avatar; not Mediterranean, but Indian-Terranean! Chef Yuval Ben Neriah and chef Dolev Maymon curated a new menu that perks up fresh, vibrant Mediterranean cuisine with aromatic flavours of Indian spices—Jerusalem Bagel with hot platter and pickles, Sashimi in Rajasthani watermelon curry, Koji Dosa with wild fish tartar and Blue Swimmer Crab Chaat. The dishes are flavourful and the excellent presentation with lots of live flourish at the table makes it a visual treat. The a la carte menu is divided into four chapters—amuse bouche, starters, mids and mains, with a nice cocktail programme that keeps you coming back for more than the view. Address: ITPL Main Road, KIADB Export Promotion Industrial Area, Whitefield",
    "insta": "https://www.instagram.com/layla_indianterraneanlovestory/",
    "website": "",
    "img": "/images/real/suzy_q.jpg"
  },
  {
    "name": "Mannheim Craft Brewery",
    "location": "40H, Whitefield Road, Doddanakundi Industrial Area 2, Phase II, Hoodi",
    "desc": "Designed as a community venue, Mannheim in Whitefield has an open plan with distinct indoor-outdoor zones to seat 750. An ode to old Bangalore, it has lush landscaping and two towering mango trees forming a living centerpiece. Besides estate-sourced coffee, live music and sports screenings, the highlight is their signature custom-built smoker and grill, best experienced at their Sunday BBQ & Beer sessions. Pair your Nawabi lamb chops and grilled chicken steak with nearly 14 beers on tap including Kolsch, Rauchbier, Helles Lager, Altbier, Kokum Sour and a seasonal Mead (currently Ambrosia or Blue Pea Mead). Being a commercial brewery, it has a growler station for takeaways of your favourite beer. Another big plus is that it’s completely pet friendly. Address: 40H, Whitefield Road, Doddanakundi Industrial Area 2, Phase II, Hoodi",
    "insta": "https://www.instagram.com/mannheimcraftbrewery/?__d=1",
    "website": "",
    "img": "/images/real/bier_library.jpg"
  },
  {
    "name": "Kaavu",
    "location": "Pattandur Agrahara Road, Siddapura, Brookefield",
    "desc": "Literally ‘sacred grove’, Kaavu promises alfresco dining surrounded by trees, serene water bodies and mini forests. Run by the promoters of URU and launched last December, a barren 1-acre patch was greened with trees and bamboo and transformed into a 750-seater restaurant with distinct zones. Enter from the lobby and forest area with 50 covers, into a cavern for 80, a 60-seater café in collaboration with P.U. Dingding, a 250-seater bistro, Cicada for private parties and the 250-seater Stonehenge. The menu blends Indian, Pan-Asian and European cuisines with beers from Mannheim and signature cocktails like Mocking bird, Kaavu Spirit and Shitake infused gin. The Western & Ethnic Breakfast on weekends 9am to 12pm serves truffled mushroom, Bombay Irani Café keema ghotala and the famous Kaavu smoked cheese & aloo paratha. Address: Pattandur Agrahara Road, Siddapura, Brookefield",
    "insta": "https://www.instagram.com/thekaavu/?hl=en",
    "website": "",
    "img": "/images/real/oasis_brewery.jpg"
  },
  {
    "name": "Oasis Brewery",
    "location": "26, Plot No.1A & 2B, Whitefield Main Road, Devasandra Industrial Estate",
    "desc": "It’s hard to imagine a 1,50,000sq ft space hiding off Whitefield Main Road, yet a small driveway short of Singayyanapalya metro station leads to Bengaluru’s largest brewery. With 1,800+ indoor and outdoor space landscaped around old trees, it has 11 cabanas and sunken seating around water bodies and koi ponds, designed by Nilay Patalia who did Longboat. The 800-seater ground floor launched in early October with the first floor and terrace slated to open soon. Chef Nuthan Prasad (earlier at Ebony on MG Road and corporate chef at BLR Brewing) brings South Indian flavours to the fore with Tranquil Bar prawns, Golconda chicken, lamb chops and Cerelac prawns, an innovation from his college days. They have seven beers on tap, besides cocktails like Aurora Flame and London Sour. Address: 26, Plot No.1A & 2B, Whitefield Main Road, Devasandra Industrial Estate",
    "insta": "https://www.instagram.com/oasis.brewery.blr/?hl=en",
    "website": "",
    "img": "/images/real/oasis_brewery.jpg"
  },
  {
    "name": "Maize & Malt",
    "location": "3, 4th Cross Road, Vigneshwar Nagar, Kaveri Nagar, Krishnarajapuram",
    "desc": "Large open spaces, multiple decks, a winding ramp and the customary brewery waterbody, Maize and Malt is a 60,000sq ft space with a rooftop island bar. The food by chef Sombir Choudhari is a mix of North Indian, South Indian, Anglo Indian and Tangra Chinese—M&M palak patta chat, railway fish cutlet, galouti kebab, besides burgers and pizzas (uniquely served in a box, so you can take home whatever you couldn’t finish). The inventive cocktails by Avinash Kapoli have a techie theme—Code Crush Cooler, Debugging Sour, Binary Breeze, Firewall Fizz and Virus Splash and good old gin and tonic, which comes with a choice of six mixers!",
    "insta": "https://www.instagram.com/maizeandmalt/?hl=en",
    "website": "",
    "img": "/images/real/lupa.jpg"
  }
];

const EditorsRecommendation = () => {
  const navigate = useNavigate();
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        // give it a small timeout to ensure data is rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [hash]);

  return (
    <div className="dashboard-page" style={{ paddingBottom: '60px', height: '100%', overflowY: 'auto' }}>
      <nav className="dash-nav">
        <button onClick={() => navigate('/dashboard')} className="back-btn-details">
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
        <div className="dash-nav-logo">Editor&apos;s Picks</div>
        <div className="dash-nav-right"></div>
      </nav>

      <div className="details-container">
        <header className="details-header">
          <h1>The 25 Best Outdoor Restaurants in Bengaluru</h1>
          <p className="details-subtitle">
            The Garden City offers a wide variety, from scenic rooftops and massive breweries to green lawns and sprawling courtyards.
          </p>
          <div className="details-divider" />
        </header>
        
        <div className="recommendations-list">
          {recommendations.map((item, index) => (
            <div key={index} id={slugify(item.name)} className="recommendation-row">
              <div className="rec-image-card">
                <img src={item.img} alt={item.name} />
                <div className="rec-number">{index + 1}</div>
              </div>
              
              <div className="rec-content">
                <div className="rec-header">
                  <h2 className="rec-title">{item.name}</h2>
                  <div className="rec-location">
                    <MapPin size={14} />
                    <span>{item.location}</span>
                  </div>
                </div>
                
                <p className="rec-description">{item.desc}</p>
                
                <div className="rec-actions">
                  {item.insta && (
                    <a href={item.insta} target="_blank" rel="noopener noreferrer" className="rec-action-link insta">
                      <Instagram size={16} /> Instagram
                    </a>
                  )}
                  {item.website && (
                    <a href={item.website} target="_blank" rel="noopener noreferrer" className="rec-action-link web">
                      <Globe size={16} /> Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditorsRecommendation;
